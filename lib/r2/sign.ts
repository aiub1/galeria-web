import "server-only";
import { GetObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import type { Tables } from "@/lib/database.types";
import { serverEnv } from "@/lib/env.server";
import { r2Endpoint } from "./host";

/*
 * URLs assinadas de leitura do R2 (bucket privado).
 *
 * ⚠️ REGRA DESTE ARQUIVO: só assine linhas de `events`/`photos` que uma
 * consulta feita com o JWT do usuário (`lib/supabase/server.ts`) acabou de
 * devolver. Assinar uma chave que a RLS não liberou transforma o bucket
 * privado numa porta lateral: a URL assinada não passa por policy nenhuma.
 *
 * Por isso a API recebe LINHAS, nunca strings. Uma chave solta vinda do
 * cliente, de `searchParams` ou de um formulário não tem como entrar aqui —
 * e uma linha sem a coluna da variante pedida é recusada, não "adivinhada".
 *
 * Variantes assinadas: `thumb` e `web`. `original` (`storage_key`) não é
 * assinado nesta fase (ADR 0003).
 */

export type PhotoVariant = "thumb" | "web";

export type SignablePhoto = Pick<Tables<"photos">, "id" | "thumb_key" | "web_key">;
export type SignableEvent = Pick<Tables<"events">, "id" | "cover_key">;

const EXPIRES_IN_SECONDS = 30 * 60;
// A mesma foto gera a mesma URL dentro de uma janela fixa, para o navegador
// reaproveitar o cache. Ver ADR 0003: a validade efetiva de uma URL fica entre
// 20 e 30 minutos, conforme o ponto da janela em que foi emitida.
const SIGNING_WINDOW_MS = 10 * 60 * 1000;

/** Início do bloco de 10 min que contém `now`. */
export function signingWindowStart(now: number): Date {
  return new Date(Math.floor(now / SIGNING_WINDOW_MS) * SIGNING_WINDOW_MS);
}

let client: S3Client | null = null;

function getClient(): S3Client {
  client ??= new S3Client({
    region: "auto",
    endpoint: r2Endpoint(serverEnv.R2_ACCOUNT_ID),
    credentials: {
      accessKeyId: serverEnv.R2_ACCESS_KEY_ID,
      secretAccessKey: serverEnv.R2_SECRET_ACCESS_KEY,
    },
  });
  return client;
}

async function signKey(key: string, signingDate: Date): Promise<string> {
  return getSignedUrl(
    getClient(),
    new GetObjectCommand({
      Bucket: serverEnv.R2_BUCKET,
      Key: key,
      // Parte da assinatura: estável dentro da janela, então não quebra o cache.
      ResponseCacheControl: "private, max-age=600",
    }),
    { expiresIn: EXPIRES_IN_SECONDS, signingDate },
  );
}

function keyFor(photo: SignablePhoto, variant: PhotoVariant): string {
  const key = variant === "thumb" ? photo.thumb_key : photo.web_key;
  if (typeof key !== "string" || key.length === 0) {
    throw new Error(`Foto ${photo.id} sem chave para a variante "${variant}"`);
  }
  return key;
}

/** photo.id → URL assinada (GET) da variante pedida. */
export async function signPhotoUrls(
  photos: readonly SignablePhoto[],
  variant: PhotoVariant,
  now: number = Date.now(),
): Promise<Map<string, string>> {
  const signingDate = signingWindowStart(now);
  // Valida tudo antes de assinar qualquer coisa.
  const keyed = photos.map((photo) => ({ id: photo.id, key: keyFor(photo, variant) }));
  const entries = await Promise.all(
    keyed.map(async ({ id, key }) => [id, await signKey(key, signingDate)] as const),
  );
  return new Map(entries);
}

/** event.id → URL assinada da capa; eventos sem `cover_key` ficam de fora. */
export async function signEventCovers(
  events: readonly SignableEvent[],
  now: number = Date.now(),
): Promise<Map<string, string>> {
  const signingDate = signingWindowStart(now);
  const withCover = events.filter(
    (event): event is SignableEvent & { cover_key: string } =>
      typeof event.cover_key === "string" && event.cover_key.length > 0,
  );
  const entries = await Promise.all(
    withCover.map(async (event) => [event.id, await signKey(event.cover_key, signingDate)] as const),
  );
  return new Map(entries);
}
