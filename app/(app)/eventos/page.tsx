import { EventCard } from "@/components/gallery/EventCard";
import { Button } from "@/components/ui/Button";
import { requireActiveProfile } from "@/lib/auth/require-active-profile";
import { resolveEventCovers } from "@/lib/gallery/covers";
import { listEvents } from "@/lib/gallery/queries";

export const metadata = { title: "Eventos — Galeria Poiema CWB" };

export default async function EventosPage({ searchParams }: PageProps<"/eventos">) {
  await requireActiveProfile();

  const { cursor } = await searchParams;
  const page = await listEvents(typeof cursor === "string" ? cursor : undefined);
  const covers = await resolveEventCovers(page.events);

  return (
    <main className="mx-auto max-w-[1200px] px-[20px] pb-[80px] pt-[clamp(28px,4vw,56px)]">
      <div className="mb-[36px] flex flex-wrap items-end justify-between gap-[28px]">
        <h1 className="m-0 font-display text-display-3 uppercase text-text-strong">Eventos</h1>
        <div className="flex flex-wrap justify-end gap-[12px]">
          <Button href="/privacidade" variant="outline" size="md">
            Minha privacidade
          </Button>
          <Button href="/busca" variant="solid" size="md">
            Buscar fotos minhas
          </Button>
        </div>
      </div>

      {page.events.length === 0 ? (
        <div className="bg-surface-sunken p-[24px] text-body-sm text-ink-2">
          Nenhum evento disponível para você por enquanto.
        </div>
      ) : (
        <div className="grid grid-cols-[repeat(auto-fit,minmax(min(300px,100%),1fr))] gap-[20px]">
          {page.events.map((event) => (
            <EventCard
              key={event.id}
              name={event.name}
              slug={event.slug}
              eventDate={event.event_date}
              coverUrl={covers.get(event.id) ?? null}
              photoCount={event.photoCount}
              sessionCount={event.sessionCount}
            />
          ))}
        </div>
      )}

      {page.nextCursor && (
        <div className="mt-[32px] flex justify-center">
          <Button href={`/eventos?cursor=${page.nextCursor}`} variant="outline" size="md">
            Eventos anteriores
          </Button>
        </div>
      )}
    </main>
  );
}
