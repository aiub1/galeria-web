import type { InputHTMLAttributes, ReactNode } from "react";

type Props = Omit<InputHTMLAttributes<HTMLInputElement>, "id" | "type"> & {
  name: string;
  children: ReactNode;
};

export function Checkbox({ name, children, className = "", disabled, ...rest }: Props) {
  const id = `field-${name}`;

  return (
    <label
      htmlFor={id}
      className={
        "inline-flex items-center gap-[var(--space-3)] font-ui text-body-sm text-text-body " +
        (disabled ? "cursor-not-allowed opacity-40" : "cursor-pointer") +
        ` ${className}`
      }
    >
      <input id={id} name={name} type="checkbox" disabled={disabled} className="peer sr-only" {...rest} />
      <span
        aria-hidden="true"
        className="grid h-5 w-5 flex-none place-items-center bg-paper-1 shadow-[inset_0_0_0_1px_var(--paper-4)] transition-[var(--transition-control)] peer-checked:bg-ink-1 peer-checked:shadow-none"
      >
        <svg
          viewBox="0 0 12 10"
          className="hidden h-[7px] w-[9px] peer-checked:block"
          aria-hidden="true"
        >
          <path d="M1 5l3 3 7-7" stroke="var(--paper-1)" strokeWidth="2" fill="none" />
        </svg>
      </span>
      {children}
    </label>
  );
}
