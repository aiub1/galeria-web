"use client";

import { useState, useTransition, type ReactNode } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

// Formulário mínimo para criar evento (nome + data) ou sessão (só nome) sem
// sair da tela. Em conflito (slug do evento, nome de sessão) mostra a
// mensagem do servidor e para: não tenta de novo sozinho.
export function NewItemForm({
  kind,
  onSubmit,
  onCancel,
}: {
  kind: "event" | "session";
  onSubmit: (values: { name: string; date: string }) => Promise<string | null>;
  onCancel: () => void;
}) {
  const [name, setName] = useState("");
  const [date, setDate] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [pending, start] = useTransition();
  const isEvent = kind === "event";

  const submit = () =>
    start(async () => {
      setError(await onSubmit({ name, date }));
    });

  return (
    <div className="mt-[18px] grid gap-[14px] border-t border-border-hairline pt-[18px] sm:grid-cols-[1fr_200px_auto]">
      <Input
        label={isEvent ? "Nome do evento" : "Nome da sessão"}
        name={`new-${kind}-name`}
        value={name}
        maxLength={120}
        onChange={(e) => setName(e.target.value)}
        invalid={error !== null}
      />
      {isEvent && (
        <Input
          label="Data"
          name="new-event-date"
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          invalid={error !== null}
        />
      )}
      <div className="flex items-end gap-[8px]">
        <Button
          variant="solid"
          size="md"
          disabled={pending || name.trim().length < (isEvent ? 2 : 1) || (isEvent && !date)}
          onClick={submit}
        >
          {pending ? "Criando…" : "Criar"}
        </Button>
        <Button variant="ghost" size="md" onClick={onCancel} disabled={pending}>
          Cancelar
        </Button>
      </div>
      {error && (
        <p role="alert" className={`m-0 text-body-sm text-red-3 ${isEvent ? "sm:col-span-3" : "sm:col-span-2"}`}>
          {error}
        </p>
      )}
    </div>
  );
}

export function LinkButton({ onClick, children, disabled }: { onClick: () => void; children: ReactNode; disabled?: boolean }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className="border-0 bg-transparent p-0 text-body-sm font-bold text-text-link underline disabled:cursor-not-allowed disabled:opacity-40"
    >
      {children}
    </button>
  );
}
