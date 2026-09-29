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
