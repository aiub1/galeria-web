import { RecoverForm } from "./RecoverForm";

export const metadata = { title: "Recuperar senha — Galeria Poiema CWB" };

export default function RecoverPage() {
  return (
    <div className="mx-auto max-w-[420px] px-[20px] py-[clamp(48px,8vw,110px)]">
      <h1 className="m-0 mb-[6px] font-display text-display-4 uppercase text-text-strong">
        Recuperar senha
      </h1>
      <p className="m-0 mb-[28px] text-body-sm text-text-muted">
        Informe o e-mail da sua conta para receber um link de recuperação.
      </p>
      <RecoverForm />
    </div>
  );
}
