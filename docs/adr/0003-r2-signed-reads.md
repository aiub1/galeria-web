# 0003 — R2 signed reads, full CSP, per-page profile check

Status: accepted · Date: 2026-09-29

## Context

Phase 3 is the first phase that shows photos. Photos live in a **private**
Cloudflare R2 bucket (`docs/CONTRATO.md` §7), so the browser can only load
them through pre-signed `GET` URLs. That makes URL signing the second
authorization surface of the system, next to RLS: a signed URL is a
capability that bypasses every policy. CLAUDE.md §3 says the front never
decides visibility, so signing must be a pure function of what RLS already
decided.

## Decision

### 1. Sign only rows that came back from an RLS-scoped query

`lib/r2/sign.ts` (`server-only`) exposes `signPhotoUrls(photos, variant)` and
`signEventCovers(events)`. Both take **rows** (`{id, thumb_key, web_key}` /
`{id, cover_key}`) returned by a query made with the caller's JWT
(`lib/supabase/server.ts`). They never take a bare key, so a key coming from
a client, a `searchParams` value or a form field has no way in. A row missing
the requested column is rejected (`throw`), and the whole batch is validated
before anything is signed.

Every read of `events`, `sessions` and `photos` in this phase uses the JWT
client. There is no `.eq("contains_minors", …)`, `.eq("is_private", …)`,
`status` filter or role check to hide a photo — if the query returned it, it
is shown; if not, it does not exist for that user. `lib/supabase/admin.ts` is
not imported anywhere in the phase. The only filters are navigation ones
(slug, chosen session tab, pagination).

Server Actions are public endpoints, so `loadMorePhotos` re-runs the whole
chain (active profile → event by slug through RLS → photos through RLS →
sign) and validates its input with zod. The event page and the action share
one function, `lib/gallery/load.ts`.

**Event covers.** With `events.cover_key`, the cover is signed (the event row
came from the JWT query). Without it, the cover is the thumb of the first
photo that the photo query returned *for that user* — a user never sees, as a
cover, a photo they would not see inside the event. With no photo at all, a
design-system placeholder.

### 2. Variants

Only `thumb_key` and `web_key` are signed. `original` (`storage_key`) is not
signed in this phase: the gallery shows `web` and `thumb`, and no download
button exists. The "cannot be downloaded or shared outside the gallery"
notice on private photos is a **policy**, not DRM — a visible `web` image can
always be saved by the browser.

### 3. Signing window for browser caching

URLs are valid for 15 minutes (`X-Amz-Expires=900`). A fresh `Date.now()` in
every signature would give every page render a different URL for the same
photo and defeat the browser cache. Instead the `signingDate` is rounded down
to the start of the current 10-minute block, so the same photo yields the
same URL for the whole block. The responses also carry
`response-cache-control=private, max-age=600` (part of the signed query, so
it is stable inside the window too).

Consequence worth knowing: the 15 minutes count from the block start, so the
**effective** remaining validity of a URL is between 5 and 15 minutes. Every
page is rendered per request, so a reload re-signs; a tab left open for more
than ~5–15 minutes may show broken images for lazy-loaded tiles until
reloaded. If that turns out to hurt, raise `EXPIRES_IN_SECONDS` to 25 minutes
(guaranteeing ≥15 remaining) — a one-constant change.

### 4. No Vercel image optimizer

Photos render through a plain `<img>` (`components/gallery/PrivateImage.tsx`,
the only place that does). `next/image` would route them through the Vercel
optimizer, which stores copies of private photos in Vercel's cache and eats
into the Hobby plan quota. Thumbs and web variants are already produced as
WebP by the upload pipeline (CONTRATO §1), so the optimizer adds nothing.

### 5. Full CSP, with a per-request nonce

The CSP is built by `lib/csp.ts` and set in `proxy.ts`, because `script-src`
carries a nonce that must change on every request:

```
default-src 'self';
script-src 'self' 'nonce-…' 'strict-dynamic';
style-src 'self' 'nonce-…'; style-src-attr 'unsafe-inline';
img-src 'self' data: blob: https://{bucket}.{account}.r2.cloudflarestorage.com;
font-src 'self';
connect-src 'self' <supabase origin> <supabase ws origin>;
object-src 'none'; base-uri 'self'; form-action 'self'; frame-ancestors 'none'
```

- `script-src` has **no `'unsafe-inline'`**. Next.js applies the nonce found in
  the request's CSP header to its own scripts, so no per-tag code is needed.
- Nonces only work on pages rendered per request, so `app/layout.tsx` awaits
  `connection()`, making every route dynamic. The app is closed and every
  screen depends on the session, so nothing was prerendered usefully anyway.
- `style-src-attr 'unsafe-inline'` is needed because React and Tailwind
  utilities emit `style=""` attributes, which a nonce does not cover. Inline
  `<style>` elements still need the nonce. In development only,
  `style-src` uses `'unsafe-inline'` instead of the nonce (the `next dev`
  overlay injects `<style>` without one).
- `img-src` names the **exact** bucket host instead of the
  `*.r2.cloudflarestorage.com` wildcard: the wildcard would also allow images
  from any other R2 account. `lib/r2/host.ts` is shared by the signer and the
  CSP, and a test pins them together.
- `upgrade-insecure-requests` is deliberately absent: it would upgrade the
  local Supabase stack (`http://127.0.0.1:54321`).
- The CSP header moved out of `next.config.ts` (which keeps the other
  baseline headers). This supersedes the "frame-ancestors only" note in
  ADR 0002.

Verified in a headless Chrome against both `next dev` and
`next build && next start`: login, event list, gallery (load more, session
tabs) and photo detail (← → Esc) run with no CSP violation in production and
none in development.

### 6. Active-profile check on every page and action

`app/(app)/layout.tsx` shows "Aguardando liberação" for inactive profiles, but
a layout rendering a waiting screen does not stop the page below from running
— in the App Router, layout and page are evaluated independently. Every page
or action that reads the archive or signs a URL therefore calls
`requireActiveProfile()` (`lib/auth/require-active-profile.ts`) first: no
session → redirect to `/login?next=…`; inactive → `notFound()` (a redirect
would loop, since the layout already shows the waiting screen on that URL).
Nothing is signed for an inactive profile.

## Consequences

- Anyone adding a screen that shows photos must go through
  `requireActiveProfile()` → JWT query → `signPhotoUrls()`. Signing a key that
  did not come from a JWT query is a review-blocking mistake.
- `original` signing (download, face indexing preview) needs its own decision
  and probably its own ADR.
- The event list shows the number of photos **visible to the user**
  (embedded `photos(count)` under RLS). The mockup's "you see 148 of 212"
  wording was dropped: the front cannot know the hidden total, and showing it
  would reveal that restricted photos exist.
- Gallery pagination is offset-based (48 per page) over a total order
  (`taken_at` nulls last, `created_at`, `id`); the event list uses a
  `(event_date, id)` cursor so two events on the same day cannot swallow each
  other. Previous/next on the photo page is computed from the ids the JWT
  query returned for the same event and session.
- IDs from the URL are validated with zod `guid()`, not `uuid()`: zod 4's
  `uuid()` enforces RFC version/variant bits and would reject seed ids that
  Postgres accepts.
