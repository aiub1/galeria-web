import { Checkbox } from "@/components/ui/Checkbox";
import { Icon } from "@/components/ui/Icon";
import type { MinorOption } from "@/lib/upload/options";

export type ItemStage = "idle" | "processing" | "uploading" | "confirming" | "done" | "done_pending" | "error";

export type UploadItem = {
  id: string;
  file: File;
  previewUrl: string | null;
  containsMinors: boolean | null;
  isPrivate: boolean;
  minorIds: string[];
  stage: ItemStage;
  progress: number;
  error: string | null;
};

const BUSY: ItemStage[] = ["processing", "uploading", "confirming"];
export const isBusy = (item: UploadItem) => BUSY.includes(item.stage);
export const isEditable = (item: UploadItem) => item.stage === "idle" || item.stage === "error";

const label = "text-micro font-bold uppercase tracking-[var(--ls-label)]";

function Status({ item }: { item: UploadItem }) {
  switch (item.stage) {
    case "idle":
      return item.containsMinors === null ? (
        <span className={`${label} text-amber-3`}>Aguardando resposta</span>
      ) : (
        <span className={`${label} text-text-muted`}>Pronta para publicar</span>
      );
    case "processing":
      return <span className={`${label} text-clay-3`}>Processando</span>;
    case "uploading":
      return <span className={`${label} text-clay-3`}>Enviando {Math.round(item.progress * 100)}%</span>;
    case "confirming":
      return <span className={`${label} text-clay-3`}>Publicando</span>;
    case "done":
      return item.containsMinors ? (
        <span className={`${label} text-slate-3`}>Publicada sem indexação</span>
      ) : (
        <span className={`${label} text-green-3`}>Publicada · na fila de indexação</span>
      );
    case "done_pending":
      return <span className={`${label} text-amber-3`}>Publicada, indexação pendente</span>;
    case "error":
      return <span className={`${label} text-red-3`}>Falhou</span>;
  }
}

const answerBtn =
  "min-h-[44px] border-0 px-[18px] font-ui text-body-sm font-bold tracking-[0.04em] transition-[var(--transition-control)] " +
  "outline-none focus-visible:shadow-[var(--ring-focus)] disabled:cursor-not-allowed disabled:opacity-40";

export function PhotoRow({
  item,
  minors,
  canTagMinors,
  onAnswer,
  onPrivate,
  onToggleMinor,
  onRetry,
  onRemove,
}: {
  item: UploadItem;
  minors: MinorOption[];
  canTagMinors: boolean;
  onAnswer: (value: boolean) => void;
  onPrivate: (value: boolean) => void;
  onToggleMinor: (minorId: string) => void;
  onRetry: () => void;
  onRemove: () => void;
}) {
  const editable = isEditable(item);
  const unanswered = item.containsMinors === null && item.stage === "idle";
  const tagged = minors.filter((m) => item.minorIds.includes(m.id));
  const available = minors.filter((m) => !item.minorIds.includes(m.id));

  return (
    <li
      className={
        "flex flex-wrap items-start gap-[16px] border-l-2 p-[16px] " +
        (unanswered ? "border-amber-3 bg-amber-3/10" : "border-transparent bg-surface-sunken")
      }
    >
      <div className="grid h-[64px] w-[64px] flex-none place-items-center overflow-hidden bg-paper-4 text-ink-5">
        {item.previewUrl ? (
          // eslint-disable-next-line @next/next/no-img-element -- miniatura local (blob:), não passa pelo otimizador
          <img src={item.previewUrl} alt="" className="h-full w-full object-cover" />
        ) : (
          <Icon name="image" size={18} />
        )}
      </div>

      <div className="min-w-[200px] flex-1">
        <div className="flex flex-wrap items-baseline justify-between gap-[12px]">
          <span className="break-all text-body-sm text-text-body">{item.file.name}</span>
          <span aria-live="polite">
            <Status item={item} />
          </span>
        </div>

        {item.stage === "error" && (
          <div className="mt-[8px] flex flex-wrap items-center gap-[12px]">
            <span role="alert" className="text-body-sm text-red-3">
              {item.error}
            </span>
            <button type="button" onClick={onRetry} className="text-body-sm font-bold text-text-link underline">
              Tentar de novo
            </button>
          </div>
        )}

        <div className="mt-[10px] flex flex-wrap items-center gap-[18px]">
          <span id={`q-${item.id}`} className="text-body-sm text-text-muted">
            Tem criança ou adolescente?
          </span>
          <div role="group" aria-labelledby={`q-${item.id}`} className="flex gap-[6px]">
            <button
              type="button"
              aria-pressed={item.containsMinors === true}
              disabled={!editable}
              onClick={() => onAnswer(true)}
              className={`${answerBtn} ${item.containsMinors === true ? "bg-ink-1 text-paper-1" : "bg-paper-1 text-text-body shadow-[inset_0_0_0_1px_var(--paper-4)]"}`}
            >
              Sim
            </button>
            <button
              type="button"
              aria-pressed={item.containsMinors === false}
              disabled={!editable}
              onClick={() => onAnswer(false)}
              className={`${answerBtn} ${item.containsMinors === false ? "bg-clay-3 text-paper-1" : "bg-paper-1 text-text-body shadow-[inset_0_0_0_1px_var(--paper-4)]"}`}
            >
              Não
            </button>
          </div>
          <Checkbox
            name={`private-${item.id}`}
            checked={item.isPrivate}
            disabled={!editable}
            onChange={(e) => onPrivate(e.target.checked)}
            className="min-h-[44px]"
          >
            Foto privada
          </Checkbox>
          {editable && (
            <button type="button" onClick={onRemove} className="text-body-sm text-text-muted underline">
              Remover
            </button>
          )}
        </div>

        {item.containsMinors === true && (
          <div className="mt-[10px] flex flex-wrap items-center gap-[8px]">
            {canTagMinors ? (
              <>
                <span className="text-body-sm text-text-muted">Crianças marcadas:</span>
                {tagged.map((m) => (
                  <button
                    key={m.id}
                    type="button"
                    disabled={!editable}
                    onClick={() => onToggleMinor(m.id)}
                    aria-label={`Desmarcar ${m.name}`}
                    className="rounded-[var(--radius-pill)] bg-ink-1 px-[12px] py-[6px] font-ui text-micro font-semibold uppercase tracking-[var(--ls-label)] text-paper-1"
                  >
                    {m.name} ×
                  </button>
                ))}
                {available.length > 0 && editable && (
                  <select
                    aria-label="Marcar do cadastro"
                    value=""
                    onChange={(e) => e.target.value && onToggleMinor(e.target.value)}
                    className="rounded-[var(--radius-pill)] border-0 bg-paper-3 px-[12px] py-[6px] font-ui text-micro font-semibold uppercase tracking-[var(--ls-label)] text-ink-2"
                  >
                    <option value="">+ marcar do cadastro</option>
                    {available.map((m) => (
                      <option key={m.id} value={m.id}>
                        {m.name}
                      </option>
                    ))}
                  </select>
                )}
              </>
            ) : (
              // TODO(core): sem o vínculo, o responsável não vê a foto. Só o
              // admin lê `minors`; o uploader não consegue listar crianças.
              <span className="text-body-sm text-text-muted">A secretaria vincula as crianças depois.</span>
            )}
          </div>
        )}
      </div>
    </li>
  );
}
