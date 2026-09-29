"use client";

import { useActionState } from "react";
import Link from "next/link";
import { login, type FormState } from "@/lib/auth/actions";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";

export function LoginForm({ next }: { next: string }) {
  const [state, formAction, pending] = useActionState<FormState, FormData>(login, null);

  return (
    <form action={formAction} className="flex flex-col gap-[18px]">
      <input type="hidden" name="next" value={next} />
      <Input label="E-mail" type="email" name="email" placeholder="voce@exemplo.com" required autoFocus />
      <Input label="Senha" type="password" name="password" placeholder="Sua senha" required />
      {state?.error && (
        <p role="alert" className="text-body-sm text-[var(--red-3)]">
          {state.error}
        </p>
      )}
      <Button type="submit" variant="primary" size="lg" fullWidth disabled={pending}>
        {pending ? "Entrando…" : "Entrar"}
      </Button>
      <div className="mt-[6px] flex flex-col gap-[10px] border-t border-border-hairline pt-[20px] text-body-sm">
        <Link href="/recuperar" className="text-text-link">
          Esqueci minha senha
        </Link>
      </div>
    </form>
  );
}
