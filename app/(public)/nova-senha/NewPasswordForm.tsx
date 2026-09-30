"use client";

import { useActionState } from "react";
import { setNewPassword, type FormState } from "@/lib/auth/actions";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";

export function NewPasswordForm() {
  const [state, formAction, pending] = useActionState<FormState, FormData>(setNewPassword, null);

  return (
    <form action={formAction} className="flex flex-col gap-[18px]">
      <Input
        label="Nova senha"
        type="password"
        name="password"
        placeholder="Mínimo 8 caracteres"
        required
        autoFocus
      />
      <Input label="Confirmar senha" type="password" name="confirmPassword" required />
      {state?.error && (
        <p role="alert" className="text-body-sm text-[var(--red-3)]">
          {state.error}
        </p>
      )}
      <Button type="submit" variant="primary" size="lg" fullWidth disabled={pending}>
        {pending ? "Salvando…" : "Salvar nova senha"}
      </Button>
    </form>
  );
}
