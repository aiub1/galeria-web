import Link from "next/link";
import Image from "next/image";
import type { ReactNode } from "react";
import { logout } from "@/lib/auth/actions";
import { canUpload, navDefsForRole, type UserRole } from "@/lib/auth/roles";
import { Button } from "@/components/ui/Button";

function initials(fullName: string): string {
  const parts = fullName.trim().split(/\s+/);
  const first = parts[0]?.[0] ?? "";
  const last = parts.length > 1 ? (parts[parts.length - 1]?.[0] ?? "") : "";
  return (first + last).toUpperCase();
}

export function AppShell({
  role,
  fullName,
  children,
}: {
  role: UserRole;
  fullName: string;
  children: ReactNode;
}) {
  const navItems = navDefsForRole(role);

  return (
    <>
      <header className="sticky top-0 z-40 border-b border-border-hairline bg-white/92 backdrop-blur-[10px]">
        <div className="mx-auto flex h-[68px] max-w-[1200px] items-center gap-[20px] px-[20px]">
          <Link href="/eventos" className="flex flex-none items-center gap-[14px] no-underline">
            <Image src="/brand/poiema-cwb.svg" alt="Poiema CWB" width={116} height={24} className="h-[24px] w-auto" />
            <span className="border-l border-border-hairline pl-[14px] font-ui text-[11px] font-bold uppercase tracking-[var(--ls-eyebrow)] text-ink-4">
              Gallery
            </span>
          </Link>
          <nav className="ml-auto flex flex-1 justify-end gap-[18px] overflow-x-auto">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="whitespace-nowrap border-b-2 border-transparent pb-[3px] font-ui text-micro font-bold uppercase tracking-[var(--ls-label)] text-ink-4 no-underline hover:border-clay-3 hover:text-ink-1"
              >
                {item.label}
              </Link>
            ))}
          </nav>
          <div className="ml-auto flex flex-none items-center gap-[12px]">
            {canUpload(role) && (
              <Button href="/enviar" variant="primary" size="sm">
                Enviar fotos
              </Button>
            )}
            <Link
              href="/perfil"
              aria-label="Abrir perfil"
              className="grid h-[38px] w-[38px] flex-none place-items-center bg-ink-1 font-ui text-[13px] font-bold text-paper-1 no-underline"
            >
              {initials(fullName)}
            </Link>
            <form action={logout}>
              <button
                type="submit"
                className="font-ui text-micro font-bold uppercase tracking-[var(--ls-label)] text-ink-4 hover:text-ink-1"
              >
                Sair
              </button>
            </form>
          </div>
        </div>
      </header>
      {children}
    </>
  );
}
