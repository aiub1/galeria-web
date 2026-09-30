import { getSessionProfile } from "@/lib/auth/session";
import { isAdmin } from "@/lib/auth/roles";
import { SemAcesso } from "../../_components/SemAcesso";

export const metadata = { title: "Fila de revisão — Galeria Poiema CWB" };

export default async function AdminRevisaoPage() {
  const session = await getSessionProfile();

  if (!session || !isAdmin(session.profile.role)) {
    return <SemAcesso />;
  }

  return (
    <main className="mx-auto max-w-[1200px] px-[20px] py-[clamp(28px,4vw,56px)]">
      <h1 className="m-0 font-display text-display-3 uppercase text-text-strong">Fila de revisão</h1>
      <p className="mt-[16px] text-body text-text-muted">Esta tela está em construção.</p>
    </main>
  );
}
