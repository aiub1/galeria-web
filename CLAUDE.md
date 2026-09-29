# CLAUDE.md — galeria-web

Front-end (Next.js) da galeria interna de fotos da igreja Poiema CWB.
Instruções permanentes para o Claude Code. Leia antes de qualquer alteração.

Repositório irmão: **galeria-core** (`poiema-gallery`) — banco, worker,
serviço facial. Contrato entre os dois: [docs/CONTRATO.md](docs/CONTRATO.md).

Documentação em português; código, commits e ADRs em **inglês**.

---

## 1. O que é

Sistema fechado, sem acesso anônimo. Conteúdo: Evento → Sessão → Fotos.
Sem fins lucrativos, sem cobrança. Uso interno da igreja.

---

## 2. As 9 invariantes do CONTRATO (§8) — cópia literal

Nenhuma das duas está livre para quebrar qualquer uma destas:

1. Foto com `contains_minors` verdadeiro **nunca** tem embedding.
2. `contains_minors` nulo significa "não respondido" e a foto não é publicada.
3. Nenhuma resposta de API contém vetor de embedding.
4. A selfie não é persistida em nenhum ponto do caminho.
5. Somente `admin` executa `DELETE` em fotos.
6. Vínculo responsável→menor só é criado por `admin`.
7. `service_role key` nunca chega ao navegador.
8. Perfil nasce **inativo** e não enxerga nada até ser ativado por um `admin`.
9. Perfil **nunca é excluído** — nem pelo admin. Desativar é o único caminho.

Quebrar qualquer uma delas é incidente, não bug comum. Se qualquer decisão
conflitar com esta seção, **pare e pergunte**.

---

## 3. Regras específicas do front

- **O front nunca é camada de proteção de menores nem de visibilidade.**
  Quem decide o que aparece é a RLS (`docs/CONTRATO.md` §1). Nenhuma rota,
  Server Component ou `proxy.ts` filtra fotos por conta própria — sempre
  pergunte ao banco.
- **`service_role` só em `lib/supabase/admin.ts`**, nunca importado de
  componente cliente. Uso restrito aos casos do CONTRATO (ex.: soft delete
  de evento), nunca para ler em nome de um usuário.
- **Selfie de busca facial**: memória → `POST /api/face/search` → descarte.
  Nunca `localStorage`, IndexedDB, cache HTTP, log ou Sentry com a imagem.
- **Nenhuma resposta de API do web devolve embedding.**
- **`contains_minors` no upload nunca tem valor padrão** — o formulário
  exige resposta explícita antes de permitir o envio.
- Textos de interface em **pt-BR**.
- **Tokens só via CSS variables / classes do `@theme`** — sem hex solto em
  componente. Ver `app/styles/tokens.css` e `app/globals.css`.

---

## 4. Estrutura

```
/app
  /(dev)/ui       preview dos primitivos — 404 fora de development
  /styles         tokens.css
  globals.css
  layout.tsx
/components/ui    primitivos (Button, ...), sem lib externa de componentes
/lib
  env.ts          variáveis públicas (zod)
  env.server.ts   variáveis de servidor (zod, "server-only")
  database.types.ts
  /supabase       client.ts, server.ts, admin.ts
proxy.ts          renova sessão — sem regra de visibilidade
/docs
  CONTRATO.md
  ARQUITETURA.md
  /adr
  /design         mockups.html + extracted/ (referência, não produção)
```

---

## 5. Comandos

```bash
npm run dev
npm run build
npm run lint
npm run types:gen   # regenera lib/database.types.ts (requer stack local do core)
```

---

## 6. Ao trabalhar aqui

- Antes de criar tela nova: reler `docs/CONTRATO.md` e a seção 3 acima.
- Mudanças pequenas e revisáveis.
- Se algo contrariar este arquivo ou o CONTRATO, **pare e pergunte**.

---

## 7. Fora de escopo (fundação)

Login, telas de produto, upload, busca facial, admin — ver roadmap em
`docs/ARQUITETURA.md`.
