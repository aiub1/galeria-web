import Link from "next/link";
import { notFound } from "next/navigation";
import { z } from "zod";
import { KeyNav } from "@/components/gallery/KeyNav";
import { PrivateImage } from "@/components/gallery/PrivateImage";
import { Button } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { requireActiveProfile } from "@/lib/auth/require-active-profile";
import { formatDateTime } from "@/lib/format/date";
import { neighborsOf } from "@/lib/gallery/neighbors";
import { getPhoto, listNeighborIds } from "@/lib/gallery/queries";
import { showsInternalInfo, STATUS_LABEL } from "@/lib/gallery/tiles";
import { signPhotoUrls } from "@/lib/r2/sign";

export const metadata = { title: "Foto — Galeria Poiema CWB" };

const stepClass =
  "inline-flex items-center gap-[8px] border-b-0 bg-ink-2 px-[16px] py-[12px] font-ui text-[13px] font-bold uppercase " +
  "tracking-[var(--ls-label)] text-paper-1 no-underline transition-[var(--transition-control)] outline-none " +
  "hover:bg-ink-3 hover:text-paper-1 focus-visible:shadow-[var(--ring-focus)]";

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <>
      <dt className="font-ui text-micro font-bold uppercase tracking-[var(--ls-label)] text-ink-5">{label}</dt>
      <dd className="m-0 text-paper-3">{children}</dd>
    </>
  );
}

export default async function FotoPage({ params }: PageProps<"/fotos/[id]">) {
  const { profile } = await requireActiveProfile();

  const { id } = await params;
  // Foto inexistente, id malformado e foto que a RLS não liberou: mesma resposta.
  if (!z.guid().safeParse(id).success) notFound();

  const photo = await getPhoto(id);
  if (!photo || !photo.event) notFound();

  const [urls, siblingIds] = await Promise.all([
    signPhotoUrls([photo], "web"),
    listNeighborIds({ eventId: photo.event_id, sessionId: photo.session_id }),
  ]);
  const webUrl = urls.get(photo.id)!;

  const neighbors = neighborsOf(siblingIds, photo.id);
  const prevHref = neighbors?.prevId ? `/fotos/${neighbors.prevId}` : null;
  const nextHref = neighbors?.nextId ? `/fotos/${neighbors.nextId}` : null;
  const backHref = `/eventos/${photo.event.slug}${photo.session ? `?sessao=${photo.session.id}` : ""}`;

  const internal = showsInternalInfo(profile.role);
  const takenAt = photo.taken_at ? formatDateTime(photo.taken_at) : null;
  const title = neighbors ? `Foto ${String(neighbors.position).padStart(3, "0")}` : "Foto";
  const aspect = photo.width && photo.height ? `${photo.width} / ${photo.height}` : "4 / 3";

  return (
    <main data-theme="inverse" className="min-h-[calc(100vh-68px)] bg-ink-1 p-[clamp(20px,4vw,40px)]">
      <KeyNav prevHref={prevHref} nextHref={nextHref} backHref={backHref} />

      <div className="mx-auto grid max-w-[1200px] grid-cols-[repeat(auto-fit,minmax(min(300px,100%),1fr))] items-start gap-[clamp(20px,3vw,40px)]">
        <div className="relative grid place-items-center bg-ink-2">
          <PrivateImage
            src={webUrl}
            alt={`${title} — ${photo.event.name}`}
            style={{ aspectRatio: aspect }}
            className="block max-h-[80vh] w-full object-contain"
          />
          {photo.is_private && (
            <span className="absolute left-[14px] top-[14px] inline-flex items-center gap-[6px] bg-ink-1/72 px-[9px] py-[6px] font-ui text-[10px] font-bold uppercase tracking-[var(--ls-label)] text-paper-1">
              <Icon name="lock" size={13} />
              Foto privada
            </span>
          )}
        </div>

        <div className="text-paper-1">
          <div className="mb-[12px] font-ui text-micro font-semibold uppercase tracking-[var(--ls-eyebrow)] text-clay-2">
            {photo.event.name}
            {photo.session ? ` · ${photo.session.name}` : ""}
          </div>
          <h1 className="m-0 mb-[24px] font-display text-display-3 uppercase text-paper-1">{title}</h1>

          <dl className="m-0 mb-[26px] grid grid-cols-[auto_1fr] gap-x-[20px] gap-y-[12px] text-body-sm">
            <Row label="Data da foto">{takenAt ?? "Sem data registrada"}</Row>
            {internal && <Row label="Situação">{STATUS_LABEL[photo.status]}</Row>}
            {internal && photo.contains_minors === true && <Row label="Menores">Contém menores</Row>}
          </dl>

          {photo.is_private && (
            <div className="mb-[26px] flex items-start gap-[12px] border-l-2 border-clay-2 bg-ink-2 px-[20px] py-[18px]">
              <Icon name="shield" size={20} className="flex-none" />
              <p className="m-0 text-body-sm text-paper-3">
                Foto privada: aparece só para quem a enviou, para a administração e para quem se reconheceu nela
                por busca. Não pode ser baixada nem compartilhada fora da galeria.
              </p>
            </div>
          )}

          {/* TODO(core): o mockup traz "Pedir remoção desta foto" aqui, mas a policy
              `create request` de removal_requests exige can_upload(): `member`
              não consegue criar o pedido. Fora da tela até o core decidir se
              libera para membros. */}
          <div className="flex flex-wrap items-center gap-[12px]">
            {prevHref ? (
              <Link href={prevHref} className={stepClass} aria-label="Foto anterior">
                <Icon name="chevron-left" size={16} />
                Anterior
              </Link>
            ) : null}
            {nextHref ? (
              <Link href={nextHref} className={stepClass} aria-label="Próxima foto">
                Próxima
                <Icon name="chevron-right" size={16} />
              </Link>
            ) : null}
            <Button href={backHref} variant="ghost" size="md" className="text-paper-1 hover:bg-ink-2 hover:text-paper-1">
              Fechar
            </Button>
          </div>
          {neighbors && (
            <p className="mt-[16px] text-body-sm text-text-muted">
              {neighbors.position} de {neighbors.total}
            </p>
          )}
        </div>
      </div>
    </main>
  );
}
