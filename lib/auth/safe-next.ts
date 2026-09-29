const DEFAULT_NEXT = "/eventos";

// Caractere de controle (inclui tab/\n/\r) ou espaço literal: o navegador
// remove esses caracteres ao normalizar a URL antes de navegar, então
// "/\t/evil.com" vira "//evil.com" na hora do redirect e sai como
// "https://evil.com/". Barrado aqui pra nunca chegar nesse estado.
const CONTROL_OR_SPACE = /[\u0000-\u001F\u007F\s]/;

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
  if (CONTROL_OR_SPACE.test(value)) return DEFAULT_NEXT;
  return value;
}
