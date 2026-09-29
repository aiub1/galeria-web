"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

function isTypingTarget(target: EventTarget | null): boolean {
  if (!(target instanceof HTMLElement)) return false;
  return target.isContentEditable || ["INPUT", "TEXTAREA", "SELECT"].includes(target.tagName);
}

// ← → navegam entre fotos, Esc volta para a galeria. Só navegação: os hrefs
// vêm do servidor, calculados a partir de fotos que a RLS liberou.
export function KeyNav({
  prevHref,
  nextHref,
  backHref,
}: {
  prevHref: string | null;
  nextHref: string | null;
  backHref: string;
}) {
  const router = useRouter();

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.altKey || event.ctrlKey || event.metaKey || event.shiftKey) return;
      if (isTypingTarget(event.target)) return;

      if (event.key === "ArrowLeft" && prevHref) router.push(prevHref);
      else if (event.key === "ArrowRight" && nextHref) router.push(nextHref);
      else if (event.key === "Escape") router.push(backHref);
    }

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [router, prevHref, nextHref, backHref]);

  return null;
}
