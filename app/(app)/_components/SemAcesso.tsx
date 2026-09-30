import { Button } from "@/components/ui/Button";

// Só UX: avisa que esta rota não é do papel do usuário. A proteção de
// verdade é a RLS (CONTRATO §1) — mesmo que alguém contorne esta tela, o
// banco não devolve nada que o papel dele não possa ver.
export function SemAcesso() {
  return (
    <div className="mx-auto max-w-[560px] px-[20px] py-[clamp(48px,8vw,110px)] text-center">
      <div className="inline-flex flex-col items-center gap-[18px]">
        <svg width="30" height="30" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <rect x="5" y="11" width="14" height="10" rx="1" stroke="var(--ink-1)" strokeWidth="1.5" />
          <path d="M8 11V7a4 4 0 018 0v4" stroke="var(--ink-1)" strokeWidth="1.5" />
        </svg>
        <h1 className="m-0 font-display text-display-3 uppercase text-text-strong">
          Esta área não está disponível para você
        </h1>
        <p className="m-0 max-w-[54ch] text-body-md text-text-body">
          Sua conta não tem acesso a esta tela. Se você acha que isso é um engano, fale com um
          administrador.
        </p>
        <Button href="/eventos" variant="primary" size="md">
          Ir para eventos
        </Button>
      </div>
    </div>
  );
}
