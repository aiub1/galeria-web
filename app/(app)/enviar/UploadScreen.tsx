"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useReducer, useRef, useState, type DragEvent } from "react";
import { Button } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { Select } from "@/components/ui/Select";
import { formatEventDateShort } from "@/lib/format/date";
import { ACCEPTED_SOURCE_TYPES } from "@/lib/upload/limits";
import type { EventOption, MinorOption } from "@/lib/upload/options";
import { createSerialRunner, MAX_PARALLEL_PHOTOS, runPhotoJob, runPool, type ConfirmBody } from "@/lib/upload/pipeline";
import { canEncodeWebp, makePreviewUrl, processImage, validateSourceFile } from "@/lib/upload/process-image";
import { putBlob } from "@/lib/upload/put-blob";
import { confirmUpload, createEvent, createSession, prepareUpload, reportUploadError } from "./actions";
import { LinkButton, NewItemForm } from "./NewItemForm";
import { isBusy, isEditable, PhotoRow, type UploadItem } from "./PhotoRow";

type Action =
  | { type: "add"; items: UploadItem[] }
  | { type: "patch"; id: string; patch: Partial<UploadItem> }
  | { type: "remove"; id: string }
  | { type: "answerAll"; value: boolean };

function reducer(items: UploadItem[], action: Action): UploadItem[] {
  switch (action.type) {
    case "add":
      return [...items, ...action.items];
    case "patch":
      return items.map((i) => (i.id === action.id ? { ...i, ...action.patch } : i));
    case "remove":
      return items.filter((i) => i.id !== action.id);
    case "answerAll":
      // Só as ainda sem resposta: não sobrescreve escolha deliberada.
      return items.map((i) => (isEditable(i) && i.containsMinors === null ? { ...i, containsMinors: action.value } : i));
  }
}

// crypto.randomUUID só existe em contexto seguro (https ou localhost); em http
// pelo IP da rede (celular no servidor de dev) ele é undefined. O id é só uma
// chave de lista no navegador, então getRandomValues (sempre disponível) basta.
function newItemId(): string {
  const bytes = crypto.getRandomValues(new Uint8Array(12));
  return Array.from(bytes, (b) => b.toString(16).padStart(2, "0")).join("");
}

const panel = "mb-[24px] border border-border-hairline bg-surface-card p-[24px]";

export function UploadScreen({
  events: initialEvents,
  minors,
  canTagMinors,
}: {
  events: EventOption[];
  minors: MinorOption[];
  canTagMinors: boolean;
}) {
  const [events, setEvents] = useState(initialEvents);
  const [eventId, setEventId] = useState("");
  const [sessionId, setSessionId] = useState("");
  const [items, dispatch] = useReducer(reducer, []);
  const [webp, setWebp] = useState<"checking" | "ok" | "unsupported">("checking");
  const [rejected, setRejected] = useState<string[]>([]);
  const [dragging, setDragging] = useState(false);
  const [confirmNoAll, setConfirmNoAll] = useState(false);
  const [creating, setCreating] = useState<null | "event" | "session">(null);
  const [publishing, setPublishing] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const itemsRef = useRef(items);
  const serial = useRef(createSerialRunner());

  const event = events.find((e) => e.id === eventId) ?? null;
  const busy = publishing || items.some(isBusy);

  // Handlers assíncronos leem a lista mais recente por aqui.
  useEffect(() => {
    itemsRef.current = items;
  }, [items]);

  useEffect(() => {
    let alive = true;
    canEncodeWebp().then((ok) => alive && setWebp(ok ? "ok" : "unsupported"));
    return () => {
      alive = false;
    };
  }, []);

  // Liberar as objectURLs ao sair da tela.
  useEffect(
    () => () => {
      for (const i of itemsRef.current) if (i.previewUrl) URL.revokeObjectURL(i.previewUrl);
    },
    [],
  );

  // Avisar antes de fechar a aba com envio em andamento.
  useEffect(() => {
    if (!busy) return;
    const warn = (e: BeforeUnloadEvent) => e.preventDefault();
    window.addEventListener("beforeunload", warn);
    return () => window.removeEventListener("beforeunload", warn);
  }, [busy]);

  const addFiles = useCallback(async (files: FileList | File[]) => {
    const accepted: UploadItem[] = [];
    const refused: string[] = [];
    for (const file of Array.from(files)) {
      const problem = validateSourceFile(file);
      if (problem) {
        refused.push(`${file.name}: ${problem}`);
        continue;
      }
      accepted.push({
        id: newItemId(),
        file,
        previewUrl: null,
        // Sem valor padrão: o usuário precisa responder cada foto.
        containsMinors: null,
        isPrivate: false,
        minorIds: [],
        stage: "idle",
        progress: 0,
        error: null,
      });
    }
    setRejected(refused);
    dispatch({ type: "add", items: accepted });
    // Miniaturas uma a uma, cedendo entre elas.
    for (const item of accepted) {
      const previewUrl = await makePreviewUrl(item.file);
      dispatch({ type: "patch", id: item.id, patch: { previewUrl } });
      await new Promise((r) => setTimeout(r));
    }
  }, []);

  const onDrop = (e: DragEvent) => {
    e.preventDefault();
    setDragging(false);
    if (webp === "ok" && e.dataTransfer.files.length > 0) void addFiles(e.dataTransfer.files);
  };

  const remove = (item: UploadItem) => {
    if (item.previewUrl) URL.revokeObjectURL(item.previewUrl);
    dispatch({ type: "remove", id: item.id });
  };

  // Resume (arquivos já no R2, só a confirmação pendente) fica fora do estado
  // de renderização: é detalhe do pipeline.
  const resumes = useRef(new Map<string, ConfirmBody>());

  const runItem = useCallback(
    async (id: string) => {
      const item = itemsRef.current.find((i) => i.id === id);
      if (!item || !event) return;
      const outcome = await runPhotoJob(
        {
          clientId: item.id,
          file: item.file,
          eventId: event.id,
          sessionId: sessionId || null,
          containsMinors: item.containsMinors,
          isPrivate: item.isPrivate,
          minorIds: item.minorIds,
          resume: resumes.current.get(id),
        },
        {
          process: (file) => serial.current(() => processImage(file)),
          prepare: prepareUpload,
          confirm: confirmUpload,
          put: putBlob,
        },
        (stage, progress) => dispatch({ type: "patch", id, patch: { stage, progress: progress ?? 0, error: null } }),
      );
      if (outcome.ok) {
        resumes.current.delete(id);
        dispatch({
          type: "patch",
          id,
          patch: { stage: outcome.indexing === "failed" ? "done_pending" : "done", progress: 1 },
        });
      } else {
        if (outcome.resume) resumes.current.set(id, outcome.resume);
        const detail = outcome.stage ? `${outcome.error} [etapa: ${outcome.stage}]` : outcome.error;
        dispatch({ type: "patch", id, patch: { stage: "error", error: detail } });
        void reportUploadError({
          stage: outcome.stage,
          error: outcome.error,
          origin: location.origin,
          userAgent: navigator.userAgent,
        }).catch(() => {});
      }
    },
    [event, sessionId],
  );

  const publish = async () => {
    const ids = itemsRef.current.filter((i) => i.stage === "idle").map((i) => i.id);
    setPublishing(true);
    try {
      await runPool(ids, MAX_PARALLEL_PHOTOS, runItem);
    } finally {
      setPublishing(false);
    }
  };

  const retry = async (id: string) => {
    setPublishing(true);
    try {
      await runItem(id);
    } finally {
      setPublishing(false);
    }
  };

  const pendingItems = items.filter((i) => i.stage === "idle");
  const unanswered = items.filter((i) => isEditable(i) && i.containsMinors === null);
  const doneCount = items.filter((i) => i.stage === "done" || i.stage === "done_pending").length;
  const canPublish =
    webp === "ok" && event !== null && pendingItems.length > 0 && unanswered.length === 0 && !busy;

  const eventOptions = useMemo(
    () => [
      { value: "", label: "Selecione um evento" },
      ...events.map((e) => ({ value: e.id, label: `${e.name} · ${formatEventDateShort(e.eventDate)}` })),
    ],
    [events],
  );
  const sessionOptions = [{ value: "", label: "Sem sessão" }, ...(event?.sessions.map((s) => ({ value: s.id, label: s.name })) ?? [])];

  const addEvent = async ({ name, date }: { name: string; date: string }) => {
    const r = await createEvent({ name, eventDate: date });
    if (!r.ok) return r.error;
    setEvents((prev) => [
      { id: r.item.id, name: r.item.name, slug: r.item.slug ?? "", eventDate: r.item.eventDate ?? date, sessions: [] },
      ...prev,
    ]);
    setEventId(r.item.id);
    setSessionId("");
    setCreating(null);
    return null;
  };

  const addSession = async ({ name }: { name: string; date: string }) => {
    const r = await createSession({ eventId, name });
    if (!r.ok) return r.error;
    setEvents((prev) =>
      prev.map((e) => (e.id === eventId ? { ...e, sessions: [...e.sessions, { id: r.item.id, name: r.item.name }] } : e)),
    );
    setSessionId(r.item.id);
    setCreating(null);
    return null;
  };

  return (
    <>
      {webp === "unsupported" && (
        <div role="alert" className="mb-[24px] border-l-2 border-red-3 bg-clay-1 px-[20px] py-[16px] text-body-sm text-clay-5">
          <strong>Este navegador não consegue preparar as fotos.</strong> O envio precisa gerar imagens WebP, e este
          navegador não sabe. Abra a galeria no Chrome, no Edge ou no Firefox.
        </div>
      )}

      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={onDrop}
        className={`mb-[24px] border border-dashed bg-surface-card px-[24px] py-[40px] text-center ${dragging ? "border-clay-3" : "border-paper-4"}`}
      >
        <div className="inline-flex flex-col items-center gap-[14px]">
          <Icon name="upload-cloud" size={32} />
          <div className="text-body-md text-text-body">Arraste as fotos aqui ou selecione do seu dispositivo</div>
          <input
            ref={inputRef}
            type="file"
            multiple
            accept={ACCEPTED_SOURCE_TYPES.join(",")}
            className="sr-only"
            tabIndex={-1}
            onChange={(e) => {
              if (e.target.files) void addFiles(e.target.files);
              e.target.value = "";
            }}
          />
          <Button variant="outline" size="md" disabled={webp !== "ok"} onClick={() => inputRef.current?.click()}>
            Selecionar fotos
          </Button>
          <div className="text-body-sm text-text-muted">JPG ou PNG até 20 MB cada</div>
        </div>
        {rejected.length > 0 && (
          <ul role="status" className="mx-auto mb-0 mt-[18px] max-w-[60ch] list-none p-0 text-left text-body-sm text-red-3">
            {rejected.map((r) => (
              <li key={r}>{r}</li>
            ))}
          </ul>
        )}
      </div>

      <div className={panel}>
        <div className="grid gap-[18px] sm:grid-cols-2">
          <Select
            label="Evento"
            name="event"
            value={eventId}
            disabled={busy}
            options={eventOptions}
            onChange={(e) => {
              setEventId(e.target.value);
              setSessionId("");
              setCreating(null);
            }}
          />
          <Select
            label="Sessão"
            name="session"
            value={sessionId}
            disabled={busy || !event}
            options={sessionOptions}
            hint="Opcional — eventos sem sessão ficam com as fotos soltas."
            onChange={(e) => setSessionId(e.target.value)}
          />
        </div>
        <div className="mt-[14px] flex flex-wrap gap-[18px]">
          <LinkButton disabled={busy} onClick={() => setCreating(creating === "event" ? null : "event")}>
            + Novo evento
          </LinkButton>
          <LinkButton disabled={busy || !event} onClick={() => setCreating(creating === "session" ? null : "session")}>
            + Nova sessão
          </LinkButton>
        </div>
        {creating && (
          <NewItemForm
            key={creating}
            kind={creating}
            onSubmit={creating === "event" ? addEvent : addSession}
            onCancel={() => setCreating(null)}
          />
        )}
      </div>

      {items.length > 0 && (
        <div className={panel}>
          <div className="mb-[6px] flex flex-wrap items-baseline justify-between gap-[12px]">
            <h2 className="m-0 text-h3 font-bold text-text-strong">
              {items.length} {items.length === 1 ? "foto" : "fotos"} · responda cada uma
            </h2>
            <span
              className={`text-micro font-bold uppercase tracking-[var(--ls-label)] ${unanswered.length === 0 ? "text-green-3" : "text-amber-3"}`}
            >
              {unanswered.length === 0 ? "Todas respondidas" : `${unanswered.length} sem resposta`}
            </span>
          </div>
          <p className="m-0 mb-[18px] max-w-[64ch] text-body-sm text-text-body">
            Ao marcar <strong>Sim</strong>, a foto sai da indexação facial e passa a ser visível só para a administração,
            para você e para os responsáveis cadastrados das crianças marcadas.
          </p>

          {unanswered.length > 1 && (
            <div className="mb-[14px] flex flex-wrap items-center gap-[10px] text-body-sm text-text-muted">
              <span>Responder todas as {unanswered.length} sem resposta:</span>
              <Button variant="outline" size="sm" disabled={busy} onClick={() => dispatch({ type: "answerAll", value: true })}>
                Sim
              </Button>
              <Button variant="outline" size="sm" disabled={busy} onClick={() => setConfirmNoAll(true)}>
                Não
              </Button>
              {confirmNoAll && (
                <span role="alertdialog" aria-label="Confirmar" className="flex flex-wrap items-center gap-[10px] bg-clay-1 px-[12px] py-[8px] text-clay-5">
                  Marcar {unanswered.length} fotos como SEM crianças ou adolescentes?
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() => {
                      dispatch({ type: "answerAll", value: false });
                      setConfirmNoAll(false);
                    }}
                  >
                    Confirmar
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => setConfirmNoAll(false)}>
                    Cancelar
                  </Button>
                </span>
              )}
            </div>
          )}

          <ul className="m-0 flex list-none flex-col gap-[14px] p-0">
            {items.map((item) => (
              <PhotoRow
                key={item.id}
                item={item}
                minors={minors}
                canTagMinors={canTagMinors}
                onAnswer={(value) =>
                  dispatch({ type: "patch", id: item.id, patch: { containsMinors: value, minorIds: value ? item.minorIds : [] } })
                }
                onPrivate={(value) => dispatch({ type: "patch", id: item.id, patch: { isPrivate: value } })}
                onToggleMinor={(minorId) =>
                  dispatch({
                    type: "patch",
                    id: item.id,
                    patch: {
                      minorIds: item.minorIds.includes(minorId)
                        ? item.minorIds.filter((m) => m !== minorId)
                        : [...item.minorIds, minorId],
                    },
                  })
                }
                onRetry={() => retry(item.id)}
                onRemove={() => remove(item)}
              />
            ))}
          </ul>
        </div>
      )}

      <div className="flex flex-wrap items-center gap-[16px]">
        <Button variant="primary" size="lg" disabled={!canPublish} onClick={publish}>
          {busy ? "Publicando…" : "Publicar fotos"}
        </Button>
        <span className="max-w-[52ch] text-body-sm text-text-muted">
          As fotos sem menores entram na fila de indexação (cerca de 10 s cada). As marcadas com menores são publicadas
          sem passar pela indexação.
        </span>
      </div>

      {items.length > 0 && !event && (
        <p className="mt-[14px] text-body-sm text-text-muted">Escolha o evento para poder publicar.</p>
      )}

      {doneCount > 0 && !busy && event && (
        <p role="status" className="mt-[24px] text-body-sm text-text-body">
          {doneCount} {doneCount === 1 ? "foto publicada" : "fotos publicadas"}.{" "}
          <Link href={`/eventos/${event.slug}`} className="font-bold text-text-link underline">
            Ver o evento
          </Link>
        </p>
      )}
    </>
  );
}
