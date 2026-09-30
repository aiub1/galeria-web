import "server-only";
import { createClient } from "@/lib/supabase/server";

export type EventOption = {
  id: string;
  name: string;
  eventDate: string;
  sessions: { id: string; name: string }[];
};

// Eventos e sessões para os selects de /enviar. Consulta com o JWT: a RLS
// decide o que existe. Só ordenação/limite aqui.
export async function listEventOptions(): Promise<EventOption[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("events")
    .select("id, name, event_date, sessions(id, name, position)")
    .order("event_date", { ascending: false })
    .order("id", { ascending: false })
    .limit(200);
  if (error) throw new Error(`Falha ao listar eventos: ${error.message}`);

  return (data ?? []).map((event) => ({
    id: event.id,
    name: event.name,
    eventDate: event.event_date,
    sessions: [...event.sessions]
      .sort((a, b) => a.position - b.position)
      .map(({ id, name }) => ({ id, name })),
  }));
}
