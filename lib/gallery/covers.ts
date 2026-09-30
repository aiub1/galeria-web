import "server-only";
import { signEventCovers, signPhotoUrls } from "@/lib/r2/sign";
import { firstVisiblePhoto, type EventListItem } from "./queries";

/**
 * event.id → URL assinada da capa, para eventos que vieram de uma consulta com
 * JWT. Com `cover_key`, assina a capa (CONTRATO §7). Sem ela, usa o thumb da
 * primeira foto que a RLS devolveu para ESTE usuário — o usuário nunca vê,
 * como capa, uma foto que não veria dentro do evento. Sem nenhuma: sem entrada
 * no mapa, e a tela mostra o placeholder.
 */
export async function resolveEventCovers(events: readonly EventListItem[]): Promise<Map<string, string>> {
  const covers = await signEventCovers(events);

  const withoutCover = events.filter((event) => !covers.has(event.id));
  const firstPhotos = await Promise.all(withoutCover.map((event) => firstVisiblePhoto(event.id)));

  const fallbackRows = firstPhotos.filter((photo) => photo !== null);
  const thumbs = await signPhotoUrls(fallbackRows, "thumb");

  for (const photo of fallbackRows) {
    const url = thumbs.get(photo.id);
    if (url) covers.set(photo.event_id, url);
  }
  return covers;
}
