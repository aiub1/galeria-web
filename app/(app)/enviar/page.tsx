import { getSessionProfile } from "@/lib/auth/session";
import { canUpload } from "@/lib/auth/roles";
import { SemAcesso } from "../_components/SemAcesso";

export const metadata = { title: "Enviar fotos — Galeria Poiema CWB" };

export default async function EnviarPage() {
  const session = await getSessionProfile();

  if (!session || !canUpload(session.profile.role)) {
    return <SemAcesso />;
  }

  return (
    <main className="mx-auto max-w-[1200px] px-[20px] py-[clamp(28px,4vw,56px)]">
      <h1 className="m-0 font-display text-display-3 uppercase text-text-strong">Enviar fotos</h1>
      <p className="mt-[16px] text-body text-text-muted">Esta tela está em construção.</p>
    </main>
  );
}
