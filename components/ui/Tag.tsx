import Link from "next/link";
import type { ReactNode } from "react";

type Tone = "neutral" | "accent" | "inverse";

const tones: Record<Tone, string> = {
  neutral: "bg-paper-3 text-ink-2",
  accent: "bg-clay-1 text-clay-5",
  inverse: "bg-paper-1/14 text-paper-1",
};

const base =
  "inline-flex items-center gap-[6px] rounded-[var(--radius-pill)] px-[12px] py-[6px] font-ui text-micro font-semibold " +
  "uppercase tracking-[var(--ls-label)] leading-[1.6] transition-[var(--transition-control)] outline-none " +
  "focus-visible:shadow-[var(--ring-focus)]";

// `href` transforma o Tag em link (abas de sessão); sem `href` é só rótulo.
export function Tag({
  tone = "neutral",
  selected,
  href,
  children,
}: {
  tone?: Tone;
  selected?: boolean;
  href?: string;
  children: ReactNode;
}) {
  const color = selected ? "bg-ink-1 text-paper-1" : tones[tone];

  if (href) {
    return (
      <Link
        href={href}
        aria-current={selected ? "page" : undefined}
        className={`${base} ${color} border-b-0 no-underline ${selected ? "hover:text-paper-1" : "hover:bg-paper-4 hover:text-ink-2"}`}
      >
        {children}
      </Link>
    );
  }

  return <span className={`${base} ${color}`}>{children}</span>;
}
