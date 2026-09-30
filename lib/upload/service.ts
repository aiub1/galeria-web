import "server-only";
import { randomUUID } from "node:crypto";
import type { SupabaseClient } from "@supabase/supabase-js";
import { canUpload, type UserRole } from "@/lib/auth/roles";
import type { Database } from "@/lib/database.types";
import { enqueueIndexFaces } from "@/lib/jobs/enqueue-index-faces";
import { signPhotoUploads, UploadLimitError, verifyUploadedObjects, type SignedUpload } from "@/lib/r2/sign-upload";
import { photoKeys } from "./keys";
import type { UploadVariant } from "./limits";
import {
  confirmUploadSchema,
  createEventSchema,
  createSessionSchema,
  prepareUploadSchema,
} from "./schemas";
import { eventSlug } from "./slug";

/*
 * Lógica das Server Actions de upload (app/(app)/enviar/actions.ts). As actions
 * são endpoints públicos: cada uma reautentica (requireActiveProfile), e aqui
 * o papel e o evento/sessão são checados DE NOVO. Tudo que toca dados usa o
 * cliente com o JWT do usuário — a RLS decide; a única exceção é o enfileirar
 * do job, isolado em lib/jobs/enqueue-index-faces.ts.
 */

export type UploadContext = {
  supabase: SupabaseClient<Database>;
  userId: string;
  role: UserRole;
};

type Failure = { ok: false; error: string };
const fail = (error: string): Failure => ({ ok: false, error });

const FORBIDDEN = "Seu perfil não pode enviar fotos.";
const INVALID = "Dados inválidos. Recarregue a página e tente de novo.";
const EVENT_NOT_FOUND = "Evento não encontrado.";
const SESSION_NOT_FOUND = "Sessão não encontrada neste evento.";
const PG_UNIQUE_VIOLATION = "23505";

/** Evento visível pela RLS e, se houver, sessão que pertence a ele. */
async function checkEventAndSession(
  { supabase }: UploadContext,
  eventId: string,
  sessionId: string | null,
): Promise<string | null> {
  const { data: event, error } = await supabase.from("events").select("id").eq("id", eventId).maybeSingle();
  if (error) throw new Error(`Falha ao ler evento: ${error.message}`);
  if (!event) return EVENT_NOT_FOUND;

  if (sessionId) {
    const { data: session, error: sessionError } = await supabase
      .from("sessions")
      .select("id")
      .eq("id", sessionId)
      .eq("event_id", eventId)
      .maybeSingle();
    if (sessionError) throw new Error(`Falha ao ler sessão: ${sessionError.message}`);
    if (!session) return SESSION_NOT_FOUND;
  }
  return null;
}

export type PreparedPhoto = {
  clientId: string;
  photoId: string;
  uploads: Record<UploadVariant, SignedUpload>;
};

export type PrepareResult = { ok: true; photos: PreparedPhoto[] } | Failure;

export async function prepareUpload(ctx: UploadContext, raw: unknown): Promise<PrepareResult> {
  if (!canUpload(ctx.role)) return fail(FORBIDDEN);
  const parsed = prepareUploadSchema.safeParse(raw);
  if (!parsed.success) return fail(INVALID);
  const { eventId, sessionId, photos } = parsed.data;

  const problem = await checkEventAndSession(ctx, eventId, sessionId);
  if (problem) return fail(problem);

  try {
    const prepared = await Promise.all(
      photos.map(async ({ clientId, originalBytes, webBytes, thumbBytes }) => {
        // O id e as chaves nascem aqui, nunca vêm do cliente.
        const photoId = randomUUID();
        const uploads = await signPhotoUploads(photoKeys(eventId, photoId), {
          original: originalBytes,
          web: webBytes,
          thumb: thumbBytes,
        });
        return { clientId, photoId, uploads };
      }),
    );
    return { ok: true, photos: prepared };
  } catch (error) {
    if (error instanceof UploadLimitError) return fail(INVALID);
    throw error;
  }
}

export type ConfirmResult =
  | {
      ok: true;
      status: "pending" | "skipped";
      /** queued: job criado · not_applicable: com menores, sem indexação · failed: publicada, job não criado */
      indexing: "queued" | "not_applicable" | "failed";
    }
  | Failure;

async function findOwnPhoto(ctx: UploadContext, photoId: string) {
  const { data, error } = await ctx.supabase
    .from("photos")
    .select("id, uploaded_by, status, contains_minors")
    .eq("id", photoId)
    .maybeSingle();
  if (error) throw new Error(`Falha ao ler foto: ${error.message}`);
  return data;
}

export async function confirmUpload(ctx: UploadContext, raw: unknown): Promise<ConfirmResult> {
  if (!canUpload(ctx.role)) return fail(FORBIDDEN);
  const parsed = confirmUploadSchema.safeParse(raw);
  if (!parsed.success) return fail(INVALID);
  const input = parsed.data;

  const problem = await checkEventAndSession(ctx, input.eventId, input.sessionId);
  if (problem) return fail(problem);

  let existing = await findOwnPhoto(ctx, input.photoId);

  if (!existing) {
    const keys = photoKeys(input.eventId, input.photoId);
    const problems = await verifyUploadedObjects(keys, {
      original: input.originalBytes,
      web: input.webBytes,
      thumb: input.thumbBytes,
    });
    if (problems.length > 0) return fail("Os arquivos enviados não conferem. Tente enviar de novo.");

    const { error } = await ctx.supabase.from("photos").insert({
      id: input.photoId,
      event_id: input.eventId,
      session_id: input.sessionId,
      uploaded_by: ctx.userId,
      storage_key: keys.original,
      web_key: keys.web,
      thumb_key: keys.thumb,
      width: input.width,
      height: input.height,
      bytes: input.originalBytes,
      taken_at: input.takenAt,
      contains_minors: input.containsMinors,
      is_private: input.isPrivate,
      // Com menores: nunca indexada (CONTRATO §4). Sem: espera o worker.
      status: input.containsMinors ? "skipped" : "pending",
    });

    if (error) {
      // Reenvio da mesma confirmação (idempotência): a linha já é nossa.
      if (error.code !== PG_UNIQUE_VIOLATION) throw new Error(`Falha ao publicar foto: ${error.message}`);
    }
    existing = await findOwnPhoto(ctx, input.photoId);
  }

  // Linha de outro usuário não é visível para este (RLS) ou não é dele.
  if (!existing || existing.uploaded_by !== ctx.userId) {
    return fail("Não foi possível publicar esta foto.");
  }

  const status = existing.status === "skipped" ? "skipped" : "pending";
  if (existing.contains_minors !== false) return { ok: true, status, indexing: "not_applicable" };

  try {
    await enqueueIndexFaces(existing.id);
    return { ok: true, status, indexing: "queued" };
  } catch (error) {
    console.error("confirmUpload: falha ao enfileirar index_faces", { photoId: existing.id, error });
    return { ok: true, status, indexing: "failed" };
  }
}

export type CreatedRef = { id: string; name: string; slug?: string; eventDate?: string };
export type CreateResult = { ok: true; item: CreatedRef } | Failure;

export async function createEvent(ctx: UploadContext, raw: unknown): Promise<CreateResult> {
  if (!canUpload(ctx.role)) return fail(FORBIDDEN);
  const parsed = createEventSchema.safeParse(raw);
  if (!parsed.success) return fail("Informe o nome e a data do evento.");
  const { name, eventDate } = parsed.data;

  const { data, error } = await ctx.supabase
    .from("events")
    .insert({ name, slug: eventSlug(name, eventDate), event_date: eventDate, created_by: ctx.userId })
    .select("id, name, slug, event_date")
    .single();

  if (error) {
    if (error.code === PG_UNIQUE_VIOLATION) return fail("Já existe um evento com esse nome nessa data.");
    throw new Error(`Falha ao criar evento: ${error.message}`);
  }
  return { ok: true, item: { id: data.id, name: data.name, slug: data.slug, eventDate: data.event_date } };
}

export async function createSession(ctx: UploadContext, raw: unknown): Promise<CreateResult> {
  if (!canUpload(ctx.role)) return fail(FORBIDDEN);
  const parsed = createSessionSchema.safeParse(raw);
  if (!parsed.success) return fail("Informe o nome da sessão.");
  const { eventId, name } = parsed.data;

  const problem = await checkEventAndSession(ctx, eventId, null);
  if (problem) return fail(problem);

  const { data: last } = await ctx.supabase
    .from("sessions")
    .select("position")
    .eq("event_id", eventId)
    .order("position", { ascending: false })
    .limit(1)
    .maybeSingle();

  const { data, error } = await ctx.supabase
    .from("sessions")
    .insert({ event_id: eventId, name, position: (last?.position ?? -1) + 1, created_by: ctx.userId })
    .select("id, name")
    .single();

  if (error) {
    if (error.code === PG_UNIQUE_VIOLATION) return fail("Já existe uma sessão com esse nome neste evento.");
    throw new Error(`Falha ao criar sessão: ${error.message}`);
  }
  return { ok: true, item: { id: data.id, name: data.name } };
}
