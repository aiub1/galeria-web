/** `culto-de-domingo-2026-08-23`: nome sem acento/símbolos + data. */
export function eventSlug(name: string, eventDate: string): string {
  const base = name
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60)
    .replace(/-+$/g, "");
  return base ? `${base}-${eventDate}` : eventDate;
}
