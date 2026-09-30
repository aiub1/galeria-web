import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("server-only", () => ({}));

const signPhotoUploads = vi.fn();
const verifyUploadedObjects = vi.fn();
vi.mock("@/lib/r2/sign-upload", () => ({
  signPhotoUploads: (...a: unknown[]) => signPhotoUploads(...a),
  verifyUploadedObjects: (...a: unknown[]) => verifyUploadedObjects(...a),
  UploadLimitError: class UploadLimitError extends Error {},
}));
const enqueueIndexFaces = vi.fn();
vi.mock("@/lib/jobs/enqueue-index-faces", () => ({
  enqueueIndexFaces: (...a: unknown[]) => enqueueIndexFaces(...a),
}));

const { prepareUpload, confirmUpload, createEvent, createSession } = await import("./service");

const USER = "22222222-2222-4222-8222-222222222222";
const EVENT = "44444444-4444-4444-8444-444444444444";
const SESSION = "55555555-5555-4555-8555-555555555555";
const PHOTO = "66666666-6666-4666-8666-666666666666";

type Row = Record<string, unknown>;
const db = {
  events: [] as Row[],
  sessions: [] as Row[],
  photos: [] as Row[],
  insertError: null as null | { code: string; message: string },
  inserted: [] as Row[],
};

// Fake mínimo do query builder: só o que o serviço usa.
function fakeSupabase() {
  const from = (table: "events" | "sessions" | "photos") => {
    const filters: [string, unknown][] = [];
    const builder = {
      select: () => builder,
      eq: (col: string, val: unknown) => (filters.push([col, val]), builder),
      order: () => builder,
      limit: () => builder,
      maybeSingle: async () => ({
        data: db[table].find((r) => filters.every(([c, v]) => r[c] === v)) ?? null,
        error: null,
      }),
      single: async () => ({ data: db.inserted.at(-1) ?? null, error: db.insertError }),
      insert: (row: Row) => {
        if (!db.insertError) {
          db.inserted.push(row);
          if (table === "photos") db.photos.push({ ...row });
        }
        const result = { error: db.insertError, select: () => ({ single: builder.single }) };
        return Object.assign(Promise.resolve(result), result);
      },
    };
    return builder;
  };
  return { from } as unknown as { from: typeof from };
}

const ctx = (role: "admin" | "uploader" | "member" = "uploader") => ({
  supabase: fakeSupabase() as never,
  userId: USER,
  role,
});

const confirmBody = {
  photoId: PHOTO,
  eventId: EVENT,
  sessionId: null,
  containsMinors: false,
  isPrivate: false,
  width: 4000,
  height: 3000,
  takenAt: "2026-08-23T13:30:00.000Z",
  originalBytes: 1000,
  webBytes: 500,
  thumbBytes: 100,
};

beforeEach(() => {
  db.events = [{ id: EVENT }];
  db.sessions = [{ id: SESSION, event_id: EVENT }];
  db.photos = [];
  db.insertError = null;
  db.inserted = [];
  signPhotoUploads.mockReset().mockImplementation(async (keys: Record<string, string>) => ({
    original: { url: `u:${keys.original}`, contentType: "image/webp" },
    web: { url: `u:${keys.web}`, contentType: "image/webp" },
    thumb: { url: `u:${keys.thumb}`, contentType: "image/webp" },
  }));
  verifyUploadedObjects.mockReset().mockResolvedValue([]);
  enqueueIndexFaces.mockReset().mockResolvedValue({ enqueued: true });
});

describe("prepareUpload", () => {
  const body = { eventId: EVENT, sessionId: null, photos: [{ clientId: "c1", originalBytes: 1000, webBytes: 500, thumbBytes: 100 }] };

  it("member não consegue, e nada é assinado", async () => {
    const r = await prepareUpload(ctx("member"), body);
    expect(r.ok).toBe(false);
    expect(signPhotoUploads).not.toHaveBeenCalled();
  });

  it.each(["uploader", "admin"] as const)("%s recebe URLs; photo_id e chaves nascem no servidor", async (role) => {
    const r = await prepareUpload(ctx(role), {
      ...body,
      photos: [{ ...body.photos[0], photoId: PHOTO, key: "events/x/photos/y/original.webp" }],
    });
    expect(r.ok).toBe(true);
    if (!r.ok) return;
    expect(r.photos[0]!.photoId).not.toBe(PHOTO);
    expect(r.photos[0]!.photoId).toMatch(/^[0-9a-f-]{36}$/);
    const [keys, sizes] = signPhotoUploads.mock.calls[0]!;
    expect(keys.original).toBe(`events/${EVENT}/photos/${r.photos[0]!.photoId}/original.webp`);
    expect(JSON.stringify(keys)).not.toContain("events/x/");
    expect(sizes).toEqual({ original: 1000, web: 500, thumb: 100 });
  });

  it("cada foto ganha um id diferente", async () => {
    const photos = [1, 2, 3].map((n) => ({ ...body.photos[0], clientId: `c${n}` }));
    const r = await prepareUpload(ctx(), { ...body, photos });
    if (!r.ok) throw new Error("esperava ok");
    expect(new Set(r.photos.map((p) => p.photoId)).size).toBe(3);
  });

  it("recusa evento que a RLS não devolve e sessão de outro evento", async () => {
    db.events = [];
    expect((await prepareUpload(ctx(), body)).ok).toBe(false);
    db.events = [{ id: EVENT }];
    db.sessions = [{ id: SESSION, event_id: "outro" }];
    expect((await prepareUpload(ctx(), { ...body, sessionId: SESSION })).ok).toBe(false);
    expect(signPhotoUploads).not.toHaveBeenCalled();
  });

  it("recusa mais de 20 fotos e tamanhos acima do limite", async () => {
    const many = Array.from({ length: 21 }, (_, i) => ({ ...body.photos[0], clientId: `c${i}` }));
    expect((await prepareUpload(ctx(), { ...body, photos: many })).ok).toBe(false);
    const big = { ...body.photos[0], thumbBytes: 300 * 1024 + 1 };
    expect((await prepareUpload(ctx(), { ...body, photos: [big] })).ok).toBe(false);
    expect(signPhotoUploads).not.toHaveBeenCalled();
  });
});

describe("confirmUpload", () => {
  it("member não consegue", async () => {
    expect((await confirmUpload(ctx("member"), confirmBody)).ok).toBe(false);
    expect(db.inserted).toEqual([]);
  });

  it.each([null, undefined, "false"])("rejeita contains_minors %j no servidor", async (value) => {
    const r = await confirmUpload(ctx(), { ...confirmBody, containsMinors: value });
    expect(r.ok).toBe(false);
    expect(verifyUploadedObjects).not.toHaveBeenCalled();
    expect(db.inserted).toEqual([]);
    expect(enqueueIndexFaces).not.toHaveBeenCalled();
  });

  it("sem menores: status pending, chaves derivadas no servidor e job enfileirado", async () => {
    const r = await confirmUpload(ctx(), { ...confirmBody, isPrivate: true });
    expect(r).toEqual({ ok: true, status: "pending", indexing: "queued" });
    expect(verifyUploadedObjects).toHaveBeenCalledWith(
      {
        original: `events/${EVENT}/photos/${PHOTO}/original.webp`,
        web: `events/${EVENT}/photos/${PHOTO}/web.webp`,
        thumb: `events/${EVENT}/photos/${PHOTO}/thumb.webp`,
      },
      { original: 1000, web: 500, thumb: 100 },
    );
    expect(db.inserted[0]).toMatchObject({
      id: PHOTO,
      event_id: EVENT,
      uploaded_by: USER,
      storage_key: `events/${EVENT}/photos/${PHOTO}/original.webp`,
      contains_minors: false,
      is_private: true,
      status: "pending",
      bytes: 1000,
    });
    expect(enqueueIndexFaces.mock.calls).toEqual([[PHOTO]]);
  });

  it("com menores: status skipped e nenhum job", async () => {
    const r = await confirmUpload(ctx(), { ...confirmBody, containsMinors: true });
    expect(r).toEqual({ ok: true, status: "skipped", indexing: "not_applicable" });
    expect(db.inserted[0]).toMatchObject({ contains_minors: true, status: "skipped" });
    expect(enqueueIndexFaces).not.toHaveBeenCalled();
  });

  it("arquivo ausente ou de tamanho diferente no R2: não insere nada", async () => {
    verifyUploadedObjects.mockResolvedValue(["original: tamanho diferente do declarado"]);
    const r = await confirmUpload(ctx(), confirmBody);
    expect(r.ok).toBe(false);
    expect(db.inserted).toEqual([]);
    expect(enqueueIndexFaces).not.toHaveBeenCalled();
  });

  it("idempotente: linha já existente e do próprio usuário é sucesso, sem novo insert nem HeadObject", async () => {
    db.photos = [{ id: PHOTO, uploaded_by: USER, status: "pending", contains_minors: false }];
    const r = await confirmUpload(ctx(), confirmBody);
    expect(r).toEqual({ ok: true, status: "pending", indexing: "queued" });
    expect(db.inserted).toEqual([]);
    expect(verifyUploadedObjects).not.toHaveBeenCalled();
    // o enqueue decide sozinho se já há job (ver enqueue-index-faces.test.ts)
    expect(enqueueIndexFaces.mock.calls).toEqual([[PHOTO]]);
  });

  it("idempotente com resposta divergente: vale o que está no banco (skipped não enfileira)", async () => {
    db.photos = [{ id: PHOTO, uploaded_by: USER, status: "skipped", contains_minors: true }];
    const r = await confirmUpload(ctx(), { ...confirmBody, containsMinors: false });
    expect(r).toEqual({ ok: true, status: "skipped", indexing: "not_applicable" });
    expect(enqueueIndexFaces).not.toHaveBeenCalled();
  });

  it("linha de outro usuário com esse id não é tratada como sucesso", async () => {
    db.photos = [{ id: PHOTO, uploaded_by: "outro", status: "pending", contains_minors: false }];
    const r = await confirmUpload(ctx(), confirmBody);
    expect(r.ok).toBe(false);
    expect(enqueueIndexFaces).not.toHaveBeenCalled();
  });

  it("corrida: insert com 23505 e linha própria vira sucesso", async () => {
    db.insertError = { code: "23505", message: "duplicate key" };
    const fake = fakeSupabase();
    const c = { supabase: fake as never, userId: USER, role: "uploader" as const };
    // a linha "aparece" entre a primeira leitura e o insert
    db.photos = [];
    const original = fake.from.bind(fake);
    let reads = 0;
    (fake as { from: unknown }).from = (t: "photos") => {
      const b = original(t) as { maybeSingle: () => Promise<unknown> };
      if (t === "photos") {
        const real = b.maybeSingle;
        b.maybeSingle = async () => {
          reads += 1;
          if (reads === 2) db.photos = [{ id: PHOTO, uploaded_by: USER, status: "pending", contains_minors: false }];
          return real();
        };
      }
      return b;
    };
    expect(await confirmUpload(c, confirmBody)).toEqual({ ok: true, status: "pending", indexing: "queued" });
  });

  it("insert ok e job falha: publicada, indexação pendente (não é erro fatal)", async () => {
    enqueueIndexFaces.mockRejectedValue(new Error("jobs indisponível"));
    vi.spyOn(console, "error").mockImplementation(() => {});
    expect(await confirmUpload(ctx(), confirmBody)).toEqual({ ok: true, status: "pending", indexing: "failed" });
    expect(db.inserted).toHaveLength(1);
  });
});

describe("createEvent / createSession", () => {
  it("member não cria", async () => {
    expect((await createEvent(ctx("member"), { name: "Culto", eventDate: "2026-08-23" })).ok).toBe(false);
    expect((await createSession(ctx("member"), { eventId: EVENT, name: "Manhã" })).ok).toBe(false);
  });

  it("slug vem do nome e da data; conflito vira mensagem, sem nova tentativa", async () => {
    db.inserted = [{ id: EVENT, name: "Culto de Domingo", slug: "culto-de-domingo-2026-08-23", event_date: "2026-08-23" }];
    const ok = await createEvent(ctx(), { name: "Culto de Domingo", eventDate: "2026-08-23" });
    expect(ok.ok).toBe(true);

    db.insertError = { code: "23505", message: "dup" };
    const before = db.inserted.length;
    const dup = await createEvent(ctx(), { name: "Culto de Domingo", eventDate: "2026-08-23" });
    expect(dup).toEqual({ ok: false, error: "Já existe um evento com esse nome nessa data." });
    expect(db.inserted.length).toBe(before);
    const dupSession = await createSession(ctx(), { eventId: EVENT, name: "Manhã" });
    expect(dupSession).toEqual({ ok: false, error: "Já existe uma sessão com esse nome neste evento." });
  });
});

describe("confirmUpload — crianças marcadas", () => {
  const MINOR = "77777777-7777-4777-8777-777777777777";

  it("uploader não marca crianças, e nada é inserido", async () => {
    const r = await confirmUpload(ctx("uploader"), { ...confirmBody, containsMinors: true, minorIds: [MINOR] });
    expect(r.ok).toBe(false);
    expect(db.inserted).toEqual([]);
  });

  it("nem o admin marca crianças em foto sem menores", async () => {
    const r = await confirmUpload(ctx("admin"), { ...confirmBody, containsMinors: false, minorIds: [MINOR] });
    expect(r.ok).toBe(false);
    expect(db.inserted).toEqual([]);
  });
});
