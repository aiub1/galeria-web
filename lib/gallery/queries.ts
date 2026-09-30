import "server-only";
import { createClient } from "@/lib/supabase/server";
import type { Tables } from "@/lib/database.types";
import { decodeEventsCursor, encodeEventsCursor, type EventsCursor } from "./cursor";

/*
 * Leituras do acervo. TODAS usam o cliente de servidor com o JWT do usuário
 * (lib/supabase/server.ts): quem decide o que aparece é a RLS (CONTRATO §1).
 *
 * Nenhum filtro de visibilidade aqui — nada de `contains_minors`,
 * `is_private`, `status` ou papel. Se a consulta devolveu, pode mostrar; se
 * não devolveu, não existe para este usuário. Os únicos filtros são de
 * NAVEGAÇÃO (slug, sessão escolhida na aba, paginação).
 *
 * lib/supabase/admin.ts não é importado por nada desta fase.
 */

export const EVENTS_PAGE_SIZE = 24;
export const PHOTOS_PAGE_SIZE = 48;
const ID_PAGE_SIZE = 1000; // teto de linhas por resposta do PostgREST

export type EventListItem = Pick<Tables<"events">, "id" | "name" | "slug" | "event_date" | "cover_key"> & {
  /** fotos que a RLS liberou para este usuário — nunca o total real */
  photoCount: number;
  sessionCount: number;
};

export type EventsPage = {
  events: EventListItem[];
  nextCursor: string | null;
};

export async function listEvents(rawCursor: string | undefined): Promise<EventsPage> {
  const cursor: EventsCursor | null = decodeEventsCursor(rawCursor);
  const supabase = await createClient();

  let query = supabase
    .from("events")
    .select("id, name, slug, event_date, cover_key, photos(count), sessions(count)")
    .order("event_date", { ascending: false })
    .order("id", { ascending: false })
    .limit(EVENTS_PAGE_SIZE + 1);

  if (cursor) {
    // Valores já validados por decodeEventsCursor (data + uuid).
    query = query.or(
      `event_date.lt.${cursor.date},and(event_date.eq.${cursor.date},id.lt.${cursor.id})`,
    );
  }

  const { data, error } = await query;
  if (error) throw new Error(`Falha ao listar eventos: ${error.message}`);

  const rows = data ?? [];
  const page = rows.slice(0, EVENTS_PAGE_SIZE);
  const last = page[page.length - 1];

  return {
    events: page.map((row) => ({
      id: row.id,
      name: row.name,
      slug: row.slug,
      event_date: row.event_date,
      cover_key: row.cover_key,
      photoCount: row.photos[0]?.count ?? 0,
      sessionCount: row.sessions[0]?.count ?? 0,
    })),
    nextCursor:
      rows.length > EVENTS_PAGE_SIZE && last
        ? encodeEventsCursor({ date: last.event_date, id: last.id })
        : null,
  };
}

export type GalleryPhotoRow = Pick<
  Tables<"photos">,
  | "id"
  | "event_id"
  | "session_id"
  | "thumb_key"
  | "web_key"
  | "taken_at"
  | "created_at"
  | "is_private"
  | "status"
  | "contains_minors"
>;

const GALLERY_COLUMNS =
  "id, event_id, session_id, thumb_key, web_key, taken_at, created_at, is_private, status, contains_minors";

// Ordem da galeria: cronológica, fotos sem `taken_at` no fim, desempate por
// `created_at` e `id` (ordem total, para a paginação por offset não repetir
// nem pular). A mesma ordem vale para vizinhos, capa e paginação.
function inGalleryOrder<T extends { order: (column: string, opts: { ascending: boolean; nullsFirst?: boolean }) => T }>(
  query: T,
): T {
  return query
    .order("taken_at", { ascending: true, nullsFirst: false })
    .order("created_at", { ascending: true })
    .order("id", { ascending: true });
}

/** Thumb-source da capa: primeira foto que a RLS devolveu para este usuário. */
export async function firstVisiblePhoto(eventId: string): Promise<GalleryPhotoRow | null> {
  const supabase = await createClient();
  const { data, error } = await inGalleryOrder(
    supabase.from("photos").select(GALLERY_COLUMNS).eq("event_id", eventId),
  ).limit(1);
  if (error) throw new Error(`Falha ao buscar foto de capa: ${error.message}`);
  return data?.[0] ?? null;
}

export async function getEventBySlug(slug: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("events")
    .select("id, name, slug, description, event_date, cover_key")
    .eq("slug", slug)
    .maybeSingle();
  if (error) throw new Error(`Falha ao buscar evento: ${error.message}`);
  return data;
}

export async function listSessions(eventId: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("sessions")
    .select("id, name, position")
    .eq("event_id", eventId)
    .order("position", { ascending: true })
    .order("created_at", { ascending: true });
  if (error) throw new Error(`Falha ao listar sessões: ${error.message}`);
  return data ?? [];
}

export type PhotosPage = {
  photos: GalleryPhotoRow[];
  /** total de fotos visíveis para este usuário neste recorte */
  visibleCount: number;
  hasMore: boolean;
};

export async function listEventPhotos(args: {
  eventId: string;
  sessionId: string | null;
  offset: number;
}): Promise<PhotosPage> {
  const supabase = await createClient();

  let query = supabase
    .from("photos")
    .select(GALLERY_COLUMNS, { count: "exact" })
    .eq("event_id", args.eventId);
  if (args.sessionId) query = query.eq("session_id", args.sessionId);

  const { data, count, error } = await inGalleryOrder(query).range(
    args.offset,
    args.offset + PHOTOS_PAGE_SIZE - 1,
  );
  if (error) throw new Error(`Falha ao listar fotos: ${error.message}`);

  const photos = data ?? [];
  const visibleCount = count ?? photos.length;
  return {
    photos,
    visibleCount,
    hasMore: args.offset + photos.length < visibleCount,
  };
}

export async function getPhoto(id: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("photos")
    .select(
      `${GALLERY_COLUMNS}, width, height,
       event:events(id, name, slug, event_date),
       session:sessions(id, name)`,
    )
    .eq("id", id)
    .maybeSingle();
  if (error) throw new Error(`Falha ao buscar foto: ${error.message}`);
  return data;
}

/**
 * Ids das fotos que a RLS liberou no mesmo evento e na mesma sessão da foto
 * atual (`sessionId` nulo = fotos sem sessão), na ordem da galeria. Alimenta
 * anterior/próxima.
 */
export async function listNeighborIds(args: { eventId: string; sessionId: string | null }): Promise<string[]> {
  const supabase = await createClient();
  const ids: string[] = [];

  for (let from = 0; ; from += ID_PAGE_SIZE) {
    let query = supabase.from("photos").select("id").eq("event_id", args.eventId);
    query = args.sessionId ? query.eq("session_id", args.sessionId) : query.is("session_id", null);

    const { data, error } = await inGalleryOrder(query).range(from, from + ID_PAGE_SIZE - 1);
    if (error) throw new Error(`Falha ao listar vizinhas: ${error.message}`);

    ids.push(...(data ?? []).map((row) => row.id));
    if ((data?.length ?? 0) < ID_PAGE_SIZE) return ids;
  }
}
