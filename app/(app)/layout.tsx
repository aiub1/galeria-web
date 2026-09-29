import { headers } from "next/headers";
import { redirect } from "next/navigation";
import type { ReactNode } from "react";
import { getSessionProfile } from "@/lib/auth/session";
import { safeNext } from "@/lib/auth/safe-next";
import { AppShell } from "./_components/AppShell";
import { PendingScreen } from "./_components/PendingScreen";

// Sem cache: o estado de is_active precisa ser checado a cada request —
// desativar um perfil tem efeito imediato (CONTRATO §6).
export const dynamic = "force-dynamic";

export default async function AppLayout({ children }: { children: ReactNode }) {
  const session = await getSessionProfile();

  if (!session) {
    const headersList = await headers();
    const currentPath = headersList.get("x-pathname");
    redirect(`/login?next=${encodeURIComponent(safeNext(currentPath))}`);
  }

  const { profile } = session;

  if (!profile.is_active) {
    return <PendingScreen createdAt={profile.created_at} />;
  }

  return (
    <AppShell role={profile.role} fullName={profile.full_name}>
      {children}
    </AppShell>
  );
}
