# 0004 — Browser upload: row only after the files are in R2

Status: accepted · Date: 2026-09-30

## Context

Phase 4 is the first phase that writes: the "Enviar fotos" screen. The photo
files go from the browser straight to R2 (`docs/CONTRATO.md` §1, ADR 0001: a
Vercel function body is capped at 4.5 MB), and one row per photo goes into
`photos`. Three facts about the core decide the shape of the flow. They were
checked against the local stack (Supabase local, uploader `uploader@poiema.test`,
JWT via `signInWithPassword`), not just read from the docs.

### What the core allows

1. **`pending_review` is invisible to everyone**, including the uploader and the
   admin (`read photos` requires `status <> 'pending_review'`). In Postgres,
   `INSERT … RETURNING` and `UPDATE … WHERE` also go through the `SELECT`
   policy. Observed:

   | Step (uploader JWT) | Result |
   |---|---|
   | `insert` with `status='pending_review'` **and** `RETURNING` | `new row violates row-level security policy` |
   | same `insert` without `RETURNING` | 201, row created |
   | `update … set status='pending'` on that row | 0 rows, 204, **the row stays `pending_review`** (confirmed with `service_role`) |
   | `insert` with `status='pending'` and `RETURNING` | works (own row is visible) |

   So the web cannot insert a photo as `pending_review` and promote it later
   with the user's JWT: the row would be stuck, invisible, forever.

2. **`jobs` accepts nothing from the JWT** (`revoke all on jobs from anon,
   authenticated`): `insert` and `select` both fail with
   `permission denied for table jobs`. `index_faces` can only be enqueued by the
   server with the `service_role` client.

3. **`minors` is readable only by admin** (or by a guardian, for their own): the
   uploader's `select` returns `[]`. An uploader cannot list children to tag in
   `photo_minors`.

## Decision

### 1. The row is created only after the three files are in R2

The photo becomes a `photos` row **after** `original`, `web` and `thumb` exist in
the bucket. There is never a row pointing at a missing file, and the flow does
not depend on `pending_review` (fact 1). Sequence per photo:

1. Browser: converts to three WebP files, reads `taken_at`, width, height, bytes.
2. Server Action `prepareUpload`: checks profile/role, checks event (and
   session) through the JWT, generates `photo_id`, builds the keys, returns
   signed `PUT` URLs.
3. Browser: `PUT`s the three files with `XMLHttpRequest` (progress), at most 3
   photos in parallel.
4. Server Action `confirmUpload`: re-checks role and event, re-derives the keys,
   `HeadObject`s the three files, inserts the row with the **user's JWT**, then
   enqueues.

The client calls `prepareUpload` with one photo at a time because the sizes it
must send are known only after that photo is converted. The action accepts up to
20 photos per call (the limit is enforced on the server).

### 2. `photo_id` and keys are generated on the server

A signed `PUT` URL is a write capability on the bucket that bypasses RLS. If the
client chose the key, an uploader could overwrite another photo's file (or one in
an event they should not touch) with a perfectly valid signature. So
`lib/r2/sign-upload.ts` takes `PhotoKeys` built by `photoKeys()` (CONTRATO §7)
from a `photo_id` made by `crypto.randomUUID()` in `prepareUpload` and an event
that RLS returned. No action has a field for a key; the zod schemas drop unknown
fields (a test pins this).

`confirmUpload` receives `photo_id` from the client (the server keeps no state
between the two calls) and derives the keys again from it and from the event.
Guessing another user's id gains nothing: a key that was never uploaded fails
`HeadObject`, and an existing id fails the primary key (see idempotency).

### 3. `ContentLength` and `ContentType` are signed; `HeadObject` before the insert

`PutObjectCommand` is signed with `ContentType: image/webp` and `ContentLength`
equal to the declared size; `X-Amz-SignedHeaders` is
`content-length;content-type;host`, so R2 refuses a file of another size or
type. Sizes are capped before signing: original 15 MB, web 3 MB, thumb 300 KB.

Two SDK details worth knowing:

- `content-type` is **not** signed by default; `signableHeaders: {content-type}`
  is required.
- The AWS SDK v3 adds a CRC32 checksum by default; on a presigned `PUT` it lands
  in the query string **with the checksum of an empty body**, and R2 would reject
  every real file. `requestChecksumCalculation: "WHEN_REQUIRED"` removes it
  (`lib/r2/client.ts`).

Even so, `confirmUpload` calls `HeadObject` on the three keys and compares size
and `Content-Type` with what was declared before inserting anything. A file that
is missing, has another size or is not `image/webp` means no row.

### 4. Initial `status` from `contains_minors`; no default

`contains_minors = false` → `status = 'pending'` and `index_faces` is enqueued;
`contains_minors = true` → `status = 'skipped'` and **no job** (CONTRATO §4).
`contains_minors` null never leaves the browser (the pipeline refuses) and is
rejected again on the server: `z.boolean()` accepts neither `null` nor a missing
field (CONTRATO §8, invariant 2). The form has no default answer; "Publicar
fotos" stays disabled until every photo has an explicit Sim/Não. "Responder
todas" only fills the photos still unanswered, and "Não" in bulk asks for
confirmation showing how many photos it affects.

`confirmUpload` is idempotent: if a row with that id exists and belongs to the
caller (or the insert hits `23505` because a duplicate call won the race), it is
a success and only the enqueue step runs. On a retry after a network failure the
browser reuses the files already in R2 and repeats only the confirmation.

### 5. First use of `service_role`, confined to one file

`lib/jobs/enqueue-index-faces.ts` is the **only** file other than
`lib/supabase/admin.ts` that imports the `service_role` client; a CI step fails
the build if any other file imports `lib/supabase/admin`. The function takes only
`photo_id`, re-reads the photo with `service_role`, and inserts the job only if
`contains_minors === false` and `deleted_at` is null. The decision comes from the
database, never from an argument. It skips a photo that already has an
`index_faces` job (`payload->>'photo_id'`) and writes only `{ type, payload }`,
never `status` (CONTRATO §4). This is the web's lock; the worker and the trigger
on `photo_faces` are the other two.

### 6. Processing in the browser, no EXIF

`createImageBitmap(file, { imageOrientation: 'from-image' })` applies the EXIF
rotation, then the image is redrawn on a canvas and encoded with
`convertToBlob`/`toBlob({ type: 'image/webp' })`. A canvas carries pixels only:
GPS, camera model and date are **not** copied to the output. As a guard, every
generated file is inspected (`lib/upload/webp.ts`) and the upload is blocked if a
RIFF `EXIF` or `XMP ` chunk shows up. `blob.type` is checked: a browser that
cannot encode WebP returns PNG. The first version blocked the upload there with a
message suggesting Chrome, Edge or Firefox, but WebKit (Safari and **every**
browser on iOS) always lands in that case, so an iPhone could not upload.

Amendment (2026-09-30): when the native canvas does not produce WebP, the app
falls back to libwebp compiled to WASM (`@jsquash/webp`, loaded lazily, so browsers
with native WebP never download it). The input is raw `ImageData`, so no metadata
can come along, and the EXIF/XMP guard still runs on the output. The cost is
`'wasm-unsafe-eval'` in `script-src`, granted **only on `/enviar`**
(`buildCsp({ allowWasm })`, set by `proxy.ts`); it allows compiling WASM, not
`eval` of strings. The block-with-a-message path remains for when even the WASM
encoder fails. iOS Safari caps a canvas at ~16.7 MP, so photos above that (e.g. the
48 MP mode) still fail there with an error on the item.

`taken_at` is read from the **original** file before re-encoding, with the raw
EXIF strings (`reviveValues: false`): a `Date` revived by the reader would be
interpreted in the browser's time zone. `DateTimeOriginal` without
`OffsetTimeOriginal` is read as `America/Sao_Paulo` (with the DST that applied on
that date, up to 2019); without a date, `taken_at` is null. The `exifr` **full**
build is used: `mini`/`lite` do not resolve `pick` by tag name and fail silently,
which would leave `taken_at` always null (a test with real JPEGs pins this).

Variants, following the reference values of the collection: original at full
resolution, q85; web longest side 2048 px, q82; thumb longest side 400 px, q75.
"Longest side, never upscaled" is an **assumption**: the core repository has no
collection-loading script to confirm what "2048 px"/"400 px" meant there (no
`upload_acervo.sh` or equivalent exists in `../poiema-gallery`). If the
collection was made with a crop, the thumbs of this phase will differ in shape.

One photo is processed at a time on the main thread (a serial runner in front of
three parallel upload lanes), yielding between steps. No Web Worker, so no
`worker-src` change. `ImageBitmap`s and canvases are released after each photo;
preview object URLs are revoked on removal and unmount.

### 7. CSP and CORS

`connect-src` gains the same exact bucket host that `img-src` already had; both
come from `R2_BUCKET` and `R2_ACCOUNT_ID` through `lib/r2/host.ts`, shared with
the signer and pinned by a test. The bucket needs CORS for `PUT` from the app's
origins with `content-type` allowed; that is core infrastructure (OpenTofu) and
is **not** configured from code here. The exact rule is in
[`docs/r2-cors.md`](../r2-cors.md).

### 8. Minors tagging

"+ marcar do cadastro" exists only for `admin` (the only role that can read
`minors`); `confirmUpload` inserts `photo_minors` with the JWT (`tag minors`
policy) and refuses `minorIds` from anyone else or on a photo without minors. For
`uploader` the selector is hidden and the text says the secretary links the
children afterwards. `TODO(core)`: without that link the guardian does not see
the photo.

## Known gaps

- **Orphan objects in R2.** If the tab closes (or the network drops for good)
  between the `PUT`s and `confirmUpload`, the files stay in the bucket with no row.
  Nothing cleans them; `delete_objects` works from rows. A core job that lists
  `events/*/photos/*` and drops keys without a row (older than a day) would close
  it. Same for a failed upload where some of the three files landed.
- **`pending` photo without a job.** If the row insert succeeds and the job insert
  fails, the photo stays `pending` with no job. The screen shows it as
  "publicada, indexação pendente" and the server logs it. The phase-6 admin screen
  needs a "requeue" action (the same `enqueueIndexFaces`, which is idempotent).
- **Duplicate jobs under a race.** The "no duplicate job" check is a read followed
  by an insert; two simultaneous `confirmUpload` calls for the same photo could
  both insert. The core could add a partial unique index on
  `(payload->>'photo_id') where type = 'index_faces'`.
- **Uploader cannot read `minors`** (fact 3): no children tagging for them until
  the core offers a way (e.g. a function returning only the names of the children
  of a given event). `TODO(core)`.
- **No HEIC**, no editing of answers after publishing, no deleting.
- The collection-loading script was not found in the core repository (see §6).

## Consequences

- Any new write path that needs `service_role` must go through
  `lib/jobs/*` style single-purpose modules and update the CI boundary check.
- Changing the key format (CONTRATO §7) means changing `photoKeys()` here and the
  worker's `delete_objects` together.
- The read window of ADR 0003 (30 min) and this write window (10 min, no rounding)
  are independent.
