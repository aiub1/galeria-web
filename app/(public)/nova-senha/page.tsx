import { NewPasswordForm } from "./NewPasswordForm";

export const metadata = { title: "Nova senha — Galeria Poiema CWB" };

export default function NewPasswordPage() {
  return (
    <div className="mx-auto max-w-[420px] px-[20px] py-[clamp(48px,8vw,110px)]">
      <h1 className="m-0 mb-[6px] font-display text-display-4 uppercase text-text-strong">Nova senha</h1>
      <p className="m-0 mb-[28px] text-body-sm text-text-muted">Defina a nova senha da sua conta.</p>
      <NewPasswordForm />
    </div>
  );
}
