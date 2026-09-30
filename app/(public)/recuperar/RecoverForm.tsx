"use client";

import { useActionState, useState } from "react";
import { requestPasswordReset, type FormState } from "@/lib/auth/actions";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";

const SUCCESS_MESSAGE = "Se houver uma conta com esse e-mail, enviamos um link de recuperação.";

export function RecoverForm() {
  const [submitted, setSubmitted] = useState(false);
  const [, formAction, pending] = useActionState<FormState, FormData>(async (prev, formData) => {
    const result = await requestPasswordReset(prev, formData);
    setSubmitted(true);
    return result;
  }, null);

  if (submitted) {
    return <p className="text-body text-text-body">{SUCCESS_MESSAGE}</p>;
  }

  return (
    <form action={formAction} className="flex flex-col gap-[18px]">
      <Input label="E-mail" type="email" name="email" placeholder="voce@exemplo.com" required autoFocus />
      <Button type="submit" variant="primary" size="lg" fullWidth disabled={pending}>
        {pending ? "Enviando…" : "Enviar link de recuperação"}
      </Button>
    </form>
  );
}
