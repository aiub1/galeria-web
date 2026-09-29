// Hosts do bucket R2. Sem "server-only" e sem ler ambiente: o `proxy.ts` (CSP)
// e o assinador (`lib/r2/sign.ts`) precisam concordar sobre o host, e é este
// módulo puro que os mantém alinhados.

export function r2Endpoint(accountId: string): string {
  return `https://${accountId}.r2.cloudflarestorage.com`;
}

// O S3Client usa endereçamento virtual-hosted (bucket como subdomínio), que é
// o que o presigner emite; a CSP `img-src` autoriza exatamente esse host.
export function r2ObjectHost(accountId: string, bucket: string): string {
  return `${bucket}.${accountId}.r2.cloudflarestorage.com`;
}
