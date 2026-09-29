import type { Enums } from "@/lib/database.types";
import type { UserRole } from "@/lib/auth/roles";
import { formatTimeOfDay } from "@/lib/format/date";
import type { GalleryPhotoRow } from "./queries";

export type PhotoStatus = Enums<"photo_status">;

// Rótulos do mockup (statusMeta).
export const STATUS_LABEL: Record<PhotoStatus, string> = {
  pending_review: "Retida em revisão",
  pending: "Na fila",
  indexing: "Indexando",
  indexed: "Publicada e indexada",
  skipped: "Publicada sem indexação",
  failed: "Falhou",
};

/**
 * Selos internos (status + "contém menores") só para admin e uploader, só
 * como informação. É apresentação: a RLS já decidiu se a foto chegou até aqui.
 * Para `member`, esses campos nem saem do servidor.
 */
export function showsInternalInfo(role: UserRole): boolean {
  return role === "admin" || role === "uploader";
}

export type PhotoTile = {
  id: string;
  thumbUrl: string;
  timeLabel: string | null;
  isPrivate: boolean;
  internal: { status: PhotoStatus; containsMinors: boolean } | null;
};

export function toTile(row: GalleryPhotoRow, thumbUrl: string, role: UserRole): PhotoTile {
  return {
    id: row.id,
    thumbUrl,
    timeLabel: row.taken_at ? formatTimeOfDay(row.taken_at) : null,
    isPrivate: row.is_private,
    internal: showsInternalInfo(role)
      ? { status: row.status, containsMinors: row.contains_minors === true }
      : null,
  };
}
