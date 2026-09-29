const DEFAULT_NEXT = "/eventos";

// Evita open redirect no `?next=` do login: só aceita um caminho relativo
// interno de verdade. `//evil.com` e `/\evil.com` são reinterpretados como
// URL absoluta pelo navegador em alguns contextos, por isso são rejeitados
// junto de qualquer esquema (`javascript:`, `https:`, ...).
export function safeNext(value: string | null | undefined): string {
  if (!value) return DEFAULT_NEXT;
  if (!value.startsWith("/")) return DEFAULT_NEXT;
  if (value.startsWith("//")) return DEFAULT_NEXT;
  if (value.startsWith("/\\")) return DEFAULT_NEXT;
  if (value.includes("\\")) return DEFAULT_NEXT;
  if (value.includes(":")) return DEFAULT_NEXT;
  return value;
}
