"use client";

import Link from "next/link";
import { useState, useTransition } from "react";
import { loadMorePhotos } from "@/app/(app)/eventos/[slug]/actions";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import type { PhotoStatus, PhotoTile } from "@/lib/gallery/tiles";
import { PrivateImage } from "./PrivateImage";

const STATUS_SHORT: Record<PhotoStatus, { label: string; tone: "glass" | "accent" | "live" }> = {
  pending_review: { label: "Em revisão", tone: "glass" },
  pending: { label: "Na fila", tone: "glass" },
  indexing: { label: "Indexando", tone: "accent" },
  indexed: { label: "Indexada", tone: "glass" },
  skipped: { label: "Sem indexação", tone: "glass" },
  failed: { label: "Falhou", tone: "live" },
};

function Tile({ tile, position }: { tile: PhotoTile; position: number }) {
  const flags = [tile.isPrivate ? "privada" : null, tile.internal?.containsMinors ? "contém menores" : null]
    .filter(Boolean)
    .join(", ");

  return (
    <Link
      href={`/fotos/${tile.id}`}
      aria-label={`Abrir foto ${position}${flags ? `, ${flags}` : ""}`}
      className="group block border-b-0 no-underline outline-none focus-visible:shadow-[var(--ring-focus)]"
    >
      <div className="relative aspect-square overflow-hidden border border-border-hairline bg-surface-sunken transition-[var(--transition-control)] group-hover:border-border-strong">
        <span className="absolute inset-0 grid place-items-center text-ink-5">
          <Icon name="image" size={22} />
        </span>
        <PrivateImage
          src={tile.thumbUrl}
          alt=""
          loading="lazy"
          className="absolute inset-0 h-full w-full object-cover"
        />
        {tile.internal && (
          <span className="absolute left-[10px] top-[10px] z-[2]">
            <Badge tone={STATUS_SHORT[tile.internal.status].tone}>{STATUS_SHORT[tile.internal.status].label}</Badge>
          </span>
        )}
        {(tile.isPrivate || tile.internal?.containsMinors) && (
          <span className="absolute right-[10px] top-[10px] z-[2] flex flex-col items-end gap-[4px]">
            {tile.isPrivate && <Badge tone="glass">Privada</Badge>}
            {tile.internal?.containsMinors && <Badge tone="glass">Menor</Badge>}
          </span>
        )}
        {tile.timeLabel && (
          <span className="absolute inset-x-0 bottom-0 z-[1] bg-[image:var(--overlay-protect)] p-[12px] text-left font-ui text-micro font-bold uppercase tracking-[var(--ls-label)] text-paper-1 opacity-0 transition-opacity duration-[var(--dur-fast)] group-hover:opacity-100 group-focus-visible:opacity-100">
            {tile.timeLabel}
          </span>
        )}
      </div>
    </Link>
  );
}

export function PhotoGrid({
  slug,
  sessionId,
  initialTiles,
  initialHasMore,
}: {
  slug: string;
  sessionId: string | null;
  initialTiles: PhotoTile[];
  initialHasMore: boolean;
}) {
  const [tiles, setTiles] = useState(initialTiles);
  const [hasMore, setHasMore] = useState(initialHasMore);
  const [failed, setFailed] = useState(false);
  const [pending, startTransition] = useTransition();

  function loadMore() {
    setFailed(false);
    startTransition(async () => {
      const result = await loadMorePhotos({ slug, sessionId, offset: tiles.length });
      if (!result.ok) {
        setFailed(true);
        return;
      }
      setTiles((current) => {
        const seen = new Set(current.map((tile) => tile.id));
        return [...current, ...result.tiles.filter((tile) => !seen.has(tile.id))];
      });
      setHasMore(result.hasMore);
    });
  }

  return (
    <>
      <div className="grid grid-cols-2 gap-[14px] sm:grid-cols-3 lg:grid-cols-4">
        {tiles.map((tile, index) => (
          <Tile key={tile.id} tile={tile} position={index + 1} />
        ))}
      </div>

      {hasMore && (
        <div className="mt-[32px] flex flex-col items-center gap-[12px]">
          <Button variant="outline" size="md" onClick={loadMore} disabled={pending}>
            {pending ? "Carregando…" : "Carregar mais fotos"}
          </Button>
          {failed && (
            <p role="alert" className="m-0 text-body-sm text-red-3">
              Não foi possível carregar mais fotos. Tente de novo.
            </p>
          )}
        </div>
      )}
    </>
  );
}
