# 0001 — Web stack

Status: accepted · Date: 2026-09-29

## Context

`galeria-web` is the Next.js front-end for the church photo gallery
described in `docs/CONTRATO.md` and `docs/ARQUITETURA.md`. It talks to the
Supabase-backed core (`poiema-gallery`) entirely through RLS-gated queries
and a small set of server-only integrations (Cloudflare R2, the face
service). Hosting, framework and styling needed deciding before any product
code could land.

## Decision

- **Next.js, App Router, TypeScript `strict` + `noUncheckedIndexedAccess`.**
  Scaffolded with `create-next-app@latest` rather than pinning a version
  from memory; installed **Next.js 16.3.6** (App Router, Turbopack default).
  `src/` disabled, `@/*` import alias.

- **Hosting: Vercel Hobby.** Internal, non-profit use — no paid tier
  justified. Two consequences the code must respect from day one:
  - **4.5 MB request body limit on server routes.** The face-search selfie
    will be downscaled in the browser before it's sent to
    `/api/face/search` (implemented in a later phase; this ADR only
    records the constraint so the upload path is designed around it from
    the start).
  - **Function region.** `vercel.json` pins `regions: ["gru1"]` (São
    Paulo) — the closest Vercel region to the Supabase project, minimizing
    latency for every server-side query. Hobby plan supports pinning a
    single region; this is as close as the plan allows.

- **Tailwind CSS v4**, with the Poiema design tokens (extracted from
  `docs/design/mockups.html`, see `docs/design/extracted/tokens.source.css`)
  as the single source of truth. `app/styles/tokens.css` copies the tokens
  verbatim as CSS custom properties; `app/globals.css` maps colors, fonts,
  text sizes and spacing into Tailwind's `@theme inline` by referencing
  those variables — never duplicating a hex value in the theme config, so
  the token file stays the only place a designer-facing color lives.

- **`@supabase/ssr`**, with a browser client (`lib/supabase/client.ts`) and
  a server client (`lib/supabase/server.ts`) built on Next's `cookies()`.
  `proxy.ts` — Next.js 16 renamed `middleware.ts` to `proxy.ts`; see the
  framework's own migration note in `node_modules/next/dist/docs/01-app/
  03-api-reference/03-file-conventions/proxy.md` — only refreshes the
  session cookie on every request.

- **npm** as the package manager.

- **Visibility is always the RLS's call; the front only reflects it.**
  `proxy.ts` carries no visibility logic, `service_role` lives only in
  `lib/supabase/admin.ts` (never imported by client code), and no route in
  this repository filters photos on its own authority — every read goes
  through the policies described in `docs/CONTRATO.md` §1 and
  `docs/CLAUDE-CORE.md` §5.1. This is the rule this repository is least
  allowed to relax; see `CLAUDE.md` here for the enforcement list.

## Consequences

- Any server route handling an image upload must downscale/compress
  client-side first; a route that assumes a larger body will fail silently
  on Vercel Hobby, not with an obvious local-dev error.
- If the project ever needs multi-region functions or a body limit above
  4.5 MB, that requires leaving Vercel Hobby — a cost decision, not a code
  change.
- `lib/database.types.ts` is generated from the core's local Supabase
  stack (`docs/CONTRATO.md` §2) and committed here, not hand-written.
