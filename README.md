# galeria-web

Front-end (Next.js) da galeria interna de fotos da igreja Poiema CWB.

Repositório irmão: `poiema-gallery` (banco, worker, serviço facial). Contrato
entre os dois: [docs/CONTRATO.md](docs/CONTRATO.md).

## Setup local

```bash
npm install
cp .env.example .env.local   # preencher com as chaves do Supabase local/remoto
npm run dev
```

## Scripts

| Script | O que faz |
|---|---|
| `npm run dev` | servidor de desenvolvimento |
| `npm run build` | build de produção |
| `npm run lint` | ESLint |
| `npm run types:gen` | regenera `lib/database.types.ts` a partir do stack local do core (requer `../poiema-gallery` com `npx supabase start` rodando) |

## Documentação

- [CLAUDE.md](CLAUDE.md) — regras permanentes do repositório
- [docs/CONTRATO.md](docs/CONTRATO.md) — contrato entre web e core
- [docs/ARQUITETURA.md](docs/ARQUITETURA.md) — arquitetura do sistema
- [docs/adr/](docs/adr/) — decisões registradas
