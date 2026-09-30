"use server";

import { z } from "zod";
import { requireActiveProfile } from "@/lib/auth/require-active-profile";
import { loadTilesPage } from "@/lib/gallery/load";
import { getEventBySlug } from "@/lib/gallery/queries";
import type { PhotoTile } from "@/lib/gallery/tiles";

const inputSchema = z.object({
  slug: z.string().min(1).max(200),
  sessionId: z.guid().nullable(),
  offset: z.number().int().min(0).max(100_000),
});

export type LoadMoreResult = { ok: true; tiles: PhotoTile[]; hasMore: boolean } | { ok: false };

// Server Action é endpoint público: refaz TUDO com o JWT de quem chamou —
// perfil ativo, evento pela RLS, fotos pela RLS — e assina só o que a consulta
// devolveu. Nada do que vem do cliente vira chave do R2.
export async function loadMorePhotos(input: unknown): Promise<LoadMoreResult> {
  const { profile } = await requireActiveProfile();

  const parsed = inputSchema.safeParse(input);
  if (!parsed.success) return { ok: false };

  const event = await getEventBySlug(parsed.data.slug);
  if (!event) return { ok: false };

  const page = await loadTilesPage({
    eventId: event.id,
    sessionId: parsed.data.sessionId,
    offset: parsed.data.offset,
    role: profile.role,
  });
  return { ok: true, tiles: page.tiles, hasMore: page.hasMore };
}
