import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { InviteForm } from "./InviteForm";

export const metadata = { title: "Criar conta — Galeria Poiema CWB" };

export default async function InvitePage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Sem sessão de convite válida (token expirado, link reaberto depois de já
  // ter criado a conta, acesso direto à rota) — volta para o login.
  if (!user?.email) {
    redirect("/login");
  }

  return (
    <div className="mx-auto max-w-[560px] px-[20px] py-[clamp(32px,6vw,72px)]">
      <h1 className="m-0 mb-[6px] font-display text-display-3 uppercase text-text-strong">Criar conta</h1>
      <p className="m-0 mb-[28px] text-body-sm text-text-muted">
        Este convite é pessoal. Complete seu cadastro para continuar.
      </p>
      <InviteForm email={user.email} />
    </div>
  );
}
