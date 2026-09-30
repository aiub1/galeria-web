"use server";

import { canUpload } from "@/lib/auth/roles";
import { requireActiveProfile } from "@/lib/auth/require-active-profile";
import { createClient } from "@/lib/supabase/server";
import * as service from "@/lib/upload/service";
import type { ConfirmResult, CreateResult, PrepareResult } from "@/lib/upload/types";

// Server Actions são endpoints POST públicos: nada aqui confia na página que
// as chamou. Cada uma exige sessão + perfil ativo, monta o contexto com o JWT
// do usuário e delega a `lib/upload/service.ts`, que valida o corpo (zod),
// confere o papel e o evento/sessão. O papel de verdade é imposto pela RLS.

async function context(): Promise<service.UploadContext> {
  const { userId, profile } = await requireActiveProfile();
  return { supabase: await createClient(), userId, role: profile.role };
}

export async function prepareUpload(input: unknown): Promise<PrepareResult> {
  return service.prepareUpload(await context(), input);
}

export async function confirmUpload(input: unknown): Promise<ConfirmResult> {
  return service.confirmUpload(await context(), input);
}

export async function createEvent(input: unknown): Promise<CreateResult> {
  return service.createEvent(await context(), input);
}

export async function createSession(input: unknown): Promise<CreateResult> {
  return service.createSession(await context(), input);
}

// Diagnóstico: o celular não tem console, então a tela manda o erro de envio
// para cá e ele aparece no terminal do servidor. Só texto curto, nunca imagem.
export async function reportUploadError(input: unknown): Promise<void> {
  const ctx = await context();
  if (!canUpload(ctx.role)) return;
  const { stage, error, userAgent, origin } = (input ?? {}) as Record<string, unknown>;
  const clip = (v: unknown) => String(v ?? "").slice(0, 400);
  console.error("[upload-error]", {
    user: ctx.userId,
    stage: clip(stage),
    error: clip(error),
    origin: clip(origin),
    userAgent: clip(userAgent),
  });
}
