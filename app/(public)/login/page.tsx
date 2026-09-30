import Image from "next/image";
import { LoginForm } from "./LoginForm";
import { safeNext } from "@/lib/auth/safe-next";

export const metadata = { title: "Entrar — Galeria Poiema CWB" };

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string; erro?: string }>;
}) {
  const { next, erro } = await searchParams;

  return (
    <div className="grid min-h-screen grid-cols-1 lg:grid-cols-2">
      <div
        data-theme="inverse"
        className="flex flex-col justify-between gap-[48px] bg-ink-1 p-[clamp(32px,6vw,80px)]"
      >
        <div className="flex items-center gap-[16px]">
          <Image src="/brand/poiema-cwb.svg" alt="Poiema CWB" width={154} height={32} className="h-8 w-auto invert" />
          <span className="border-l border-white/20 pl-[16px] font-ui text-micro font-bold uppercase tracking-[var(--ls-eyebrow)] text-ink-5">
            Gallery
          </span>
        </div>
        <div>
          <div className="mb-[16px] font-ui text-micro font-bold uppercase tracking-[var(--ls-eyebrow)] text-clay-2">
            Acervo interno
          </div>
          <h1 className="m-0 max-w-[14ch] font-display text-display-2 uppercase text-paper-1">
            A memória da nossa casa
          </h1>
          <p className="mt-[24px] max-w-[46ch] text-body text-[#E8E6E3]">
            Acesrvo de fotos da nossa fámilia espiritual, com registros de eventos, pessoas e momentos que marcaram a história da nossa casa.
          </p>
        </div>
        <div />
      </div>
      <div className="flex items-center justify-center p-[clamp(32px,5vw,64px)]">
        <div className="w-full max-w-[420px] bg-surface-card p-[clamp(24px,4vw,40px)]">
          <h2 className="m-0 mb-[6px] font-display text-display-4 uppercase text-text-strong">Entrar</h2>
          <p className="m-0 mb-[28px] text-body-sm text-text-muted">Cadastro apenas por convite.</p>
          {erro === "link-invalido" && (
            <p role="alert" className="mb-[18px] text-body-sm text-[var(--red-3)]">
              Este link expirou ou já foi usado. Peça um novo convite ou uma nova recuperação de senha.
            </p>
          )}
          <LoginForm next={safeNext(next)} />
        </div>
      </div>
    </div>
  );
}
