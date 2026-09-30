import "server-only";
import type { UserRole } from "@/lib/auth/roles";
import { signPhotoUrls } from "@/lib/r2/sign";
import { listEventPhotos } from "./queries";
import { toTile, type PhotoTile } from "./tiles";

export type TilesPage = {
  tiles: PhotoTile[];
  visibleCount: number;
  hasMore: boolean;
};

/**
 * Uma página da galeria: consulta com JWT → assina só o que ela devolveu →
 * monta os tiles que vão ao navegador. É o único caminho de fotos da galeria
 * (página inicial e "carregar mais" passam por aqui).
 */
export async function loadTilesPage(args: {
  eventId: string;
  sessionId: string | null;
  offset: number;
  role: UserRole;
}): Promise<TilesPage> {
  const page = await listEventPhotos(args);
  const urls = await signPhotoUrls(page.photos, "thumb");

  return {
    tiles: page.photos.map((photo) => toTile(photo, urls.get(photo.id)!, args.role)),
    visibleCount: page.visibleCount,
    hasMore: page.hasMore,
  };
}
