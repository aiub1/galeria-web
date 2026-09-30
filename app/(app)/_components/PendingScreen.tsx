import { logout } from "@/lib/auth/actions";
import { Button } from "@/components/ui/Button";

export function PendingScreen({ createdAt }: { createdAt: string }) {
  const createdLabel = new Date(createdAt).toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

  return (
    <div className="mx-auto max-w-[560px] px-[20px] py-[clamp(48px,8vw,110px)] text-center">
      <div className="inline-flex flex-col items-center gap-[18px]">
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path
            d="M6 2h12M6 22h12M8 2c0 4 8 4 8 8s-8 4-8 8M16 2c0 4-8 4-8 8s8 4 8 8"
            stroke="var(--ink-1)"
            strokeWidth="1.5"
          />
        </svg>
        <h1 className="m-0 font-display text-display-3 uppercase text-text-strong">
          Conta aguardando liberação
        </h1>
        <p className="m-0 max-w-[52ch] text-body-md text-text-body">
          Sua conta foi criada, mas ainda precisa ser liberada por um administrador da igreja. Enquanto
          isso, o acervo fica indisponível — nada é ocultado por erro seu.
        </p>
        <div className="max-w-[52ch] bg-surface-sunken px-[20px] py-[16px] text-left text-body-sm text-text-body">
          Criada em {createdLabel} · Perfil: <strong>membro</strong> · Situação: <strong>inativa</strong>
        </div>
        <form action={logout}>
          <Button type="submit" variant="outline" size="md">
            Sair
          </Button>
        </form>
      </div>
    </div>
  );
}
