// Content-Security-Policy completa. Montada no `proxy.ts` a cada requisição
// porque o nonce de `script-src` é por requisição (ADR 0003).
//
// - Scripts: só `'self'` + nonce + `'strict-dynamic'`. Sem `'unsafe-inline'`.
// - Estilos: nonce para <style>; atributos `style=""` liberados à parte em
//   `style-src-attr` (nonce não cobre atributo, e o React emite alguns). Em
//   desenvolvimento, `'unsafe-inline'` no lugar do nonce (o overlay do
//   `next dev` injeta <style> sem nonce; nonce presente anula 'unsafe-inline').
// - `img-src` e `connect-src` incluem o host exato do bucket R2 (leitura por URL
//   assinada e PUT do upload direto do navegador).

export type CspInput = {
  nonce: string;
  isDev: boolean;
  supabaseUrl: string;
  r2ObjectHost: string;
};

export function buildCsp({ nonce, isDev, supabaseUrl, r2ObjectHost }: CspInput): string {
  const supabase = new URL(supabaseUrl);
  const supabaseWs = `${supabase.protocol === "https:" ? "wss:" : "ws:"}//${supabase.host}`;

  const directives = [
    `default-src 'self'`,
    // React usa eval em desenvolvimento (stacks de erro); em produção não.
    `script-src 'self' 'nonce-${nonce}' 'strict-dynamic'${isDev ? " 'unsafe-eval'" : ""}`,
    `style-src 'self' ${isDev ? "'unsafe-inline'" : `'nonce-${nonce}'`}`,
    `style-src-attr 'unsafe-inline'`,
    `img-src 'self' data: blob: https://${r2ObjectHost}`,
    `font-src 'self'`,
    // O host do bucket também vale aqui: o PUT do upload (XMLHttpRequest) é connect-src.
    `connect-src 'self' ${supabase.origin} ${supabaseWs} https://${r2ObjectHost}`,
    `object-src 'none'`,
    `base-uri 'self'`,
    `form-action 'self'`,
    `frame-ancestors 'none'`,
  ];
  return directives.join("; ");
}
