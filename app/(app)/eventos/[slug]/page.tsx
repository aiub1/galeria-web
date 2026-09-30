import { notFound } from "next/navigation";
import { PhotoGrid } from "@/components/gallery/PhotoGrid";
import { Icon } from "@/components/ui/Icon";
import { Tag } from "@/components/ui/Tag";
import { requireActiveProfile } from "@/lib/auth/require-active-profile";
import { formatEventDateLong } from "@/lib/format/date";
import { loadTilesPage } from "@/lib/gallery/load";
import { getEventBySlug, listSessions } from "@/lib/gallery/queries";

export const metadata = { title: "Evento — Galeria Poiema CWB" };

export default async function EventoPage({ params, searchParams }: PageProps<"/eventos/[slug]">) {
  const { profile } = await requireActiveProfile();

  const { slug } = await params;
  const { sessao } = await searchParams;

  // Evento inexistente e evento que a RLS não liberou (ou apagado) são
  // indistinguíveis aqui: a consulta volta vazia nos dois casos.
  const event = await getEventBySlug(slug);
  if (!event) notFound();

  const sessions = await listSessions(event.id);
  // `sessao` vem da URL: só vale se for uma sessão deste evento; qualquer
  // outra coisa cai em "Todas".
  const activeSession = typeof sessao === "string" ? sessions.find((s) => s.id === sessao) : undefined;

  const page = await loadTilesPage({
    eventId: event.id,
    sessionId: activeSession?.id ?? null,
    offset: 0,
    role: profile.role,
  });

  const base = `/eventos/${event.slug}`;

  return (
    <main className="mx-auto max-w-[1200px] px-[20px] pb-[80px] pt-[clamp(28px,4vw,48px)]">
      <div className="mb-[24px] flex flex-wrap items-end justify-between gap-[24px]">
        <div>
          <div className="mb-[12px] font-ui text-micro font-semibold uppercase tracking-[var(--ls-eyebrow)] text-text-accent">
            {formatEventDateLong(event.event_date)}
          </div>
          <h1 className="m-0 font-display text-display-3 uppercase text-text-strong">{event.name}</h1>
          {event.description && (
            <p className="mt-[12px] max-w-[62ch] text-body text-ink-2">{event.description}</p>
          )}
        </div>
        {/* Só a contagem visível: o front não sabe (e não deve revelar) quantas
            fotos a RLS escondeu deste usuário. */}
        <div className="flex items-center gap-[10px] text-body-sm text-text-muted">
          <Icon name="eye" size={16} />
          <span>{page.visibleCount === 1 ? "1 foto" : `${page.visibleCount} fotos`}</span>
        </div>
      </div>

      {sessions.length > 0 && (
        <nav aria-label="Sessões" className="mb-[24px] flex flex-wrap gap-[8px]">
          <Tag href={base} selected={!activeSession}>
            Todas
          </Tag>
          {sessions.map((session) => (
            <Tag key={session.id} href={`${base}?sessao=${session.id}`} selected={session.id === activeSession?.id}>
              {session.name}
            </Tag>
          ))}
        </nav>
      )}

      {page.tiles.length === 0 ? (
        <div className="bg-surface-sunken p-[24px] text-body-sm text-ink-2">
          Nenhuma foto para mostrar aqui.
        </div>
      ) : (
        <PhotoGrid
          key={activeSession?.id ?? "todas"}
          slug={event.slug}
          sessionId={activeSession?.id ?? null}
          initialTiles={page.tiles}
          initialHasMore={page.hasMore}
        />
      )}
    </main>
  );
}
