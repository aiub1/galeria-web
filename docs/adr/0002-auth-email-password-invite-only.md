# 0002 — Auth: email/password, invite-only

Status: accepted · Date: 2026-09-29

## Context

`galeria-web` needs a login flow before any product screen can exist. The
core already provisions profiles as `member` + `is_active = false` via a
database trigger (`docs/ARQUITETURA.md` §5.3, ADR 0003 of `poiema-gallery`),
and public signup is disabled in Supabase Auth for the same reason: this is
a closed system (CLAUDE.md §1), and the only legitimate way in is an invite
from someone who already has an account.

## Decision

- **Email + password via Supabase Auth.** No magic link, no social login —
  matches how invitations are issued (an email with a link) and keeps the
  surface small.
- **Invite is the only entry point.** Until the members screen exists
  (phase 6), invites are sent from the Supabase dashboard. The web never
  writes an `auth.users` row itself.
- **Single route handler for both token flows.** `/auth/confirm` receives
  `token_hash` + `type` (`invite` or `recovery`) from the Supabase email
  template, calls `verifyOtp`, and redirects to `/convite` or `/nova-senha`.
  An invalid/expired token redirects to `/login` with a Portuguese error
  instead of failing inline — the person has no session to show anything
  else on.
- **Inactive state is checked in the protected layout, every request.**
  `app/(app)/layout.tsx` is `force-dynamic` and calls `getSessionProfile()`
  on every render. There is no caching layer to invalidate when an admin
  deactivates someone — CONTRATO §6 requires that effect to be immediate,
  and the simplest way to guarantee that is to never cache the check at all.
- **Role-based screens are UX, not authorization.** `lib/auth/roles.ts`
  drives what the nav shows and which placeholder pages render "Sem
  acesso" for the wrong role. None of this replaces RLS — a member who
  somehow got a UI showing `/admin/revisao` content would still get nothing
  back from the database, because every policy goes through `is_member()`
  and `is_admin()` (`docs/ARQUITETURA.md` §5.1).
- **`safeNext()` guards every post-login redirect.** The `next` query param
  is attacker-controlled (it survives round-tripping through the invite and
  recovery emails too), so it's validated against open redirects before
  being used, both in the login form and after `acceptInvite`/
  `setNewPassword`.
- **Terms-of-invite checkbox blocks submission but persists nothing.** The
  core has no table for a general terms acceptance record (only
  `minor_consents` and `face_consents`, both scoped to specific consents
  unrelated to this). Recording the invite's terms acceptance for real
  needs a core migration — tracked as a `TODO(core)` in
  `lib/auth/actions.ts` and called out again in the PR that introduces this
  ADR.

## Hardening

- **`safeNext()` also rejects control characters and literal spaces**
  (`/[\u0000-\u001F\u007F\s]/`). A value like `/\t/evil.com` passes every
  other check (starts with `/`, no `//`, no backslash, no `:`), but a
  browser strips the tab when normalizing the URL before navigating,
  turning it into `//evil.com` — which it then reads as
  `https://evil.com/`. Same failure mode for `\n` and `\r`. Percent-encoded
  sequences like `%09` are not affected: they're three printable
  characters (`%`, `0`, `9`), not an actual tab, and a browser doesn't
  collapse them the same way — so `safeNext` still accepts them as a
  literal (if unusual) internal path. The dangerous case is specifically
  the *decoded* value, which is exactly what `searchParams.next` on the
  login page already is by the time it reaches `safeNext` — covered by a
  test that round-trips a percent-encoded tab through `URLSearchParams`
  the way Next.js's router does.
- **`/nova-senha` requires a live recovery session**, same as `/convite`:
  it calls `getUser()` server-side before rendering the form and redirects
  to `/login?erro=link-invalido` if there's no session. Without this, the
  page would render the form for anyone, and `setNewPassword`'s
  `updateUser` call would just fail with an unhelpful generic error
  instead of sending the person back to request a fresh link.
- **Baseline security headers** in `next.config.ts`, applied to every
  route: `X-Frame-Options: DENY` and `Content-Security-Policy:
  frame-ancestors 'none'` (belt-and-suspenders against clickjacking —
  photos of children are the kind of content this app most needs to keep
  out of an invisible iframe), `X-Content-Type-Options: nosniff`, and
  `Referrer-Policy: strict-origin-when-cross-origin`. The CSP only sets
  `frame-ancestors` for now; a full policy (`script-src`, `img-src`
  scoped to the R2 domain, etc.) is deferred to phase 3, once photo
  upload/display exists and there's something real to scope `img-src` to.
  **Superseded by [ADR 0003](0003-r2-signed-reads.md):** the full policy,
  with a per-request nonce, now lives in `proxy.ts`.

## Consequences

- Password minimum length (8 characters) is enforced both client-side and
  in the server actions; it should also be configured as the Supabase Auth
  password policy (`docs/supabase-auth.md`) so a direct API call can't
  bypass it.
- `proxy.ts` gained one line forwarding the request path as an `x-pathname`
  header, purely so the protected layout (a Server Component with no access
  to the request path) can build `/login?next=...`. This does not change
  what `proxy.ts` decides — it still carries no visibility logic — but it's
  worth flagging since ADR 0001 called that file's narrow scope out
  explicitly.
- The "Sem acesso" screen only exists for routes phase 2 actually created
  (`/admin/revisao`, `/enviar`). Every future protected screen needs the
  same `getSessionProfile()` + role check pattern until a shared route
  guard is worth extracting.
