import Link from "next/link";
import { Icon } from "@/components/ui/Icon";
import { PrivateImage } from "./PrivateImage";
import { formatEventDateShort } from "@/lib/format/date";

function plural(count: number, one: string, many: string): string {
  return `${count} ${count === 1 ? one : many}`;
}

export function EventCard({
  name,
  slug,
  eventDate,
  coverUrl,
  photoCount,
  sessionCount,
}: {
  name: string;
  slug: string;
  eventDate: string;
  coverUrl: string | null;
  /** fotos visíveis para o usuário — nunca o total real do evento */
  photoCount: number;
  sessionCount: number;
}) {
  return (
    <Link
      href={`/eventos/${slug}`}
      className="group block border-b-0 no-underline outline-none focus-visible:shadow-[var(--ring-focus)]"
    >
      <div className="border border-border-hairline bg-surface-card transition-[var(--transition-control)] group-hover:-translate-y-[2px] group-hover:border-border-strong group-hover:shadow-[var(--shadow-2)]">
        <div className="relative grid aspect-[16/10] place-items-center overflow-hidden bg-surface-sunken">
          {coverUrl ? (
            <PrivateImage src={coverUrl} alt="" loading="lazy" className="absolute inset-0 h-full w-full object-cover" />
          ) : (
            <div className="flex flex-col items-center gap-[8px] text-ink-5">
              <Icon name="image" size={28} />
              <span className="font-ui text-[10px] font-bold uppercase tracking-[var(--ls-label)]">Sem capa</span>
            </div>
          )}
          <div className="absolute inset-x-0 bottom-0 h-[60%] bg-[image:var(--overlay-protect)]" />
          <span className="absolute bottom-[12px] left-[14px] font-ui text-micro font-bold uppercase tracking-[var(--ls-label)] text-paper-1">
            {formatEventDateShort(eventDate)}
          </span>
        </div>
        <div className="p-[18px]">
          <h3 className="m-0 mb-[10px] font-display text-[22px] uppercase leading-[1.05] tracking-[var(--ls-display)] text-text-strong">
            {name}
          </h3>
          <div className="text-body-sm text-text-muted">
            {sessionCount > 0 ? plural(sessionCount, "sessão", "sessões") : "Sem sessões"}
          </div>
          <div className="mt-[10px] text-body-sm text-ink-2">{plural(photoCount, "foto", "fotos")}</div>
        </div>
      </div>
    </Link>
  );
}
