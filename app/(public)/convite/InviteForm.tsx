"use client";

import { useActionState, useState } from "react";
import { acceptInvite, type FormState } from "@/lib/auth/actions";
import { Input } from "@/components/ui/Input";
import { Checkbox } from "@/components/ui/Checkbox";
import { Button } from "@/components/ui/Button";

export function InviteForm({ email }: { email: string }) {
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [state, formAction, pending] = useActionState<FormState, FormData>(acceptInvite, null);

  return (
    <form action={formAction} className="flex flex-col gap-[18px]">
      <Input label="Nome completo" name="fullName" placeholder="Como você é conhecido na igreja" required autoFocus />
      <Input
        label="E-mail do convite"
        type="email"
        name="invitedEmail"
        value={email}
        disabled
        hint="Vinculado ao convite e não pode ser alterado."
      />
      <Input label="Criar senha" type="password" name="password" placeholder="Mínimo 8 caracteres" required />
      <Input label="Confirmar senha" type="password" name="confirmPassword" required />

      <div className="mt-[10px] bg-surface-sunken p-[20px]">
        <p className="m-0 mb-[14px] text-body-sm text-text-body">
          Depois de criar a conta, um administrador precisa liberar seu acesso. Você não vê nenhuma foto
          até lá.
        </p>
        <Checkbox
          name="termsAccepted"
          checked={termsAccepted}
          onChange={(e) => setTermsAccepted(e.target.checked)}
        >
          Li e aceito a política de privacidade (versão 2.1) e o tratamento dos meus dados conforme a
          LGPD.
        </Checkbox>
      </div>

      {state?.error && (
        <p role="alert" className="text-body-sm text-[var(--red-3)]">
          {state.error}
        </p>
      )}

      <Button type="submit" variant="primary" size="lg" fullWidth disabled={pending || !termsAccepted}>
        {pending ? "Criando conta…" : "Criar conta"}
      </Button>
    </form>
  );
}
