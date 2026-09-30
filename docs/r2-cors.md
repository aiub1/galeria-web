# CORS do bucket R2 (upload direto do navegador)

O upload de fotos (`/enviar`) faz `PUT` do **navegador** direto no bucket, por
URL assinada (ADR [0004](adr/0004-browser-upload.md)). O navegador só permite
isso se o bucket responder ao preflight `OPTIONS` com CORS liberado. Sem a
regra abaixo, o servidor assina, o navegador converte, e o envio morre no
preflight com "No 'Access-Control-Allow-Origin' header is present".

Isto é **infraestrutura do core** (OpenTofu, `infra/`): a web não configura o
bucket por código, e o token R2 da web (só objetos) não tem permissão de
`PutBucketCors`. O `infra/main.tf` do core hoje declara só o bucket, sem CORS.

## Regra

Um bucket por ambiente, cada um com as suas origens.

**Desenvolvimento** (`poiema-gallery-dev`):

```json
[
  {
    "AllowedOrigins": ["http://localhost:3000"],
    "AllowedMethods": ["PUT", "GET", "HEAD"],
    "AllowedHeaders": ["content-type"],
    "ExposeHeaders": ["ETag"],
    "MaxAgeSeconds": 3600
  }
]
```

**Produção** (`poiema-gallery`): a mesma regra, com a(s) origem(ns) da Vercel
no lugar de `localhost` (o domínio de produção; a URL de preview só se
previews forem enviar fotos):

```json
"AllowedOrigins": ["https://<domínio-da-vercel>"]
```

## Por que cada campo

| Campo | Motivo |
|---|---|
| `AllowedOrigins` | origem exata, sem `*`: o `PUT` é uma escrita |
| `PUT` | o upload |
| `GET`, `HEAD` | leitura das fotos por URL assinada e diagnóstico; `<img>` não exige CORS, mas `fetch`/`HEAD` de conferência sim |
| `AllowedHeaders: content-type` | o `PUT` manda `Content-Type: image/webp`, que não é um tipo "seguro" de CORS e força o preflight. `Content-Length` é cabeçalho proibido para o navegador (ele mesmo o calcula) e **não** entra na lista |
| `MaxAgeSeconds` | evita um preflight por arquivo (são 3 por foto) |

O `Content-Type` e o `Content-Length` estão dentro da assinatura da URL
(`X-Amz-SignedHeaders=content-length;content-type;host`), então o R2 recusa o
arquivo se algum diferir do que o servidor assinou.

## OpenTofu (sugestão para o core)

```hcl
resource "cloudflare_r2_bucket_cors" "gallery" {
  account_id  = var.account_id
  bucket_name = cloudflare_r2_bucket.gallery.name

  rules = [{
    allowed = {
      origins = var.r2_cors_origins          # lista por ambiente
      methods = ["PUT", "GET", "HEAD"]
      headers = ["content-type"]
    }
    expose_headers  = ["ETag"]
    max_age_seconds = 3600
  }]
}
```

(O nome exato do recurso e dos atributos depende da versão do provider
Cloudflare em `infra/versions.tf`; confira a documentação dela.)

## Como conferir

Preflight de fora do navegador (não escreve nada):

```bash
curl -si -X OPTIONS \
  "https://<bucket>.<account>.r2.cloudflarestorage.com/qualquer/chave.webp" \
  -H "Origin: http://localhost:3000" \
  -H "Access-Control-Request-Method: PUT" \
  -H "Access-Control-Request-Headers: content-type"
```

Esperado: `200` com `access-control-allow-origin: http://localhost:3000`,
`access-control-allow-methods` contendo `PUT` e `access-control-allow-headers`
contendo `content-type`. Bucket sem regra responde `403` com
`CORS not configured for this bucket`.

`TODO(core)`: aplicar a regra nos dois buckets e versioná-la no OpenTofu.
