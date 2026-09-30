import { z } from "zod";

// Cursor da lista de eventos: (event_date, id) do último evento da página.
// `event_date` sozinho não basta — dois cultos no mesmo dia empatam e um deles
// sumiria na virada de página. O cursor chega por `searchParams` (controlado
// pelo usuário) e entra num filtro `.or()` do PostgREST, então só passa se
// casar exatamente com este formato. `guid`, não `uuid`: o `uuid` do zod 4 exige
// bits de versão/variante RFC e recusaria ids válidos do Postgres (seed, fixtures).
const cursorSchema = z.object({
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  id: z.guid(),
});

export type EventsCursor = z.infer<typeof cursorSchema>;

export function encodeEventsCursor(cursor: EventsCursor): string {
  return `${cursor.date}_${cursor.id}`;
}

export function decodeEventsCursor(raw: string | undefined): EventsCursor | null {
  if (!raw) return null;
  const [date, id, ...rest] = raw.split("_");
  if (rest.length > 0) return null;
  const parsed = cursorSchema.safeParse({ date, id });
  return parsed.success ? parsed.data : null;
}
