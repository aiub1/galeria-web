import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { NewPasswordForm } from "./NewPasswordForm";

export const metadata = { title: "Nova senha — Galeria Poiema CWB" };

export default async function NewPasswordPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Mesmo padrão de /convite: sem sessão de recuperação válida (token
  // expirado, link reaberto depois de já ter trocado a senha, acesso direto
  // à rota) — volta pro login com a mesma mensagem de link inválido.
  if (!user) {
    redirect("/login?erro=link-invalido");
  }

  return (
    <div className="mx-auto max-w-[420px] px-[20px] py-[clamp(48px,8vw,110px)]">
      <h1 className="m-0 mb-[6px] font-display text-display-4 uppercase text-text-strong">Nova senha</h1>
      <p className="m-0 mb-[28px] text-body-sm text-text-muted">Defina a nova senha da sua conta.</p>
      <NewPasswordForm />
    </div>
  );
}
