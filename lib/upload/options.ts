import "server-only";
import { createClient } from "@/lib/supabase/server";

export type EventOption = {
  id: string;
  name: string;
  slug: string;
  eventDate: string;
  sessions: { id: string; name: string }[];
};

// Eventos e sessões para os selects de /enviar. Consulta com o JWT: a RLS
// decide o que existe. Só ordenação/limite aqui.
export async function listEventOptions(): Promise<EventOption[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("events")
    .select("id, name, slug, event_date, sessions(id, name, position)")
    .order("event_date", { ascending: false })
    .order("id", { ascending: false })
    .limit(200);
  if (error) throw new Error(`Falha ao listar eventos: ${error.message}`);

  return (data ?? []).map((event) => ({
    id: event.id,
    name: event.name,
    slug: event.slug,
    eventDate: event.event_date,
    sessions: [...event.sessions]
      .sort((a, b) => a.position - b.position)
      .map(({ id, name }) => ({ id, name })),
  }));
}

export type MinorOption = { id: string; name: string };

// Cadastro de crianças para "marcar na foto". A RLS de `minors` só devolve
// linhas para admin (e responsáveis, para as próprias); para uploader volta
// vazio, e a tela nem oferece o seletor (ver UploadScreen).
export async function listMinorOptions(): Promise<MinorOption[]> {
  const supabase = await createClient();
  const { data, error } = await supabase.from("minors").select("id, full_name").order("full_name").limit(500);
  if (error) throw new Error(`Falha ao listar cadastro de crianças: ${error.message}`);
  return (data ?? []).map((m) => ({ id: m.id, name: m.full_name }));
}
