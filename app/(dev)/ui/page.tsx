import { notFound } from "next/navigation";
import { Button } from "@/components/ui/Button";

const variants = ["primary", "solid", "outline", "ghost", "inverse"] as const;
const sizes = ["sm", "md", "lg"] as const;

export default function UiPreviewPage() {
  if (process.env.NODE_ENV !== "development") {
    notFound();
  }

  return (
    <main className="mx-auto max-w-[var(--max-content)] px-[var(--gutter-page)] py-[var(--space-9)]">
      <h1 className="mb-[var(--space-6)] font-display text-display-3 uppercase text-text-strong">
        Primitivos de UI
      </h1>

      <section className="flex flex-col gap-[var(--space-6)] bg-surface-page p-[var(--space-6)]">
        <h2 className="text-h3 font-bold text-text-strong">Button</h2>
        {sizes.map((size) => (
          <div key={size} className="flex flex-wrap items-center gap-[var(--space-4)]">
            <span className="w-12 text-body-sm text-text-muted">{size}</span>
            {variants.map((variant) => (
              <Button key={variant} variant={variant} size={size}>
                {variant}
              </Button>
            ))}
            <Button size={size} disabled>
              disabled
            </Button>
          </div>
        ))}
      </section>

      <section
        data-theme="inverse"
        className="mt-[var(--space-6)] flex flex-wrap items-center gap-[var(--space-4)] bg-surface-page p-[var(--space-6)]"
      >
        <span className="w-12 text-body-sm text-text-muted">inverse bg</span>
        {variants.map((variant) => (
          <Button key={variant} variant={variant}>
            {variant}
          </Button>
        ))}
      </section>
    </main>
  );
}
