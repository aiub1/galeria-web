import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("server-only", () => ({}));

type Photo = { id: string; contains_minors: boolean | null; deleted_at: string | null };
const state = { photo: null as Photo | null, jobs: [] as { id: number }[], inserted: [] as unknown[], insertError: null as null | { code: string } };

vi.mock("@/lib/supabase/admin", () => ({
  createAdminClient: () => ({
    from: (table: string) => {
      if (table === "photos") {
        return { select: () => ({ eq: () => ({ maybeSingle: async () => ({ data: state.photo, error: null }) }) }) };
      }
      return {
        select: () => ({
          eq: () => ({ eq: () => ({ limit: async () => ({ data: state.jobs, error: null }) }) }),
        }),
        insert: async (row: unknown) => {
          if (state.insertError) return { error: state.insertError };
          state.inserted.push(row);
          return { error: null };
        },
      };
    },
  }),
}));

const { enqueueIndexFaces } = await import("./enqueue-index-faces");

const photo = (over: Partial<Photo> = {}): Photo => ({ id: "p1", contains_minors: false, deleted_at: null, ...over });

beforeEach(() => {
  state.photo = photo();
  state.jobs = [];
  state.inserted = [];
  state.insertError = null;
});

describe("enqueueIndexFaces", () => {
  it("com contains_minors=false lido do banco, insere exatamente { type, payload }", async () => {
    await expect(enqueueIndexFaces("p1")).resolves.toEqual({ enqueued: true });
    expect(state.inserted).toEqual([{ type: "index_faces", payload: { photo_id: "p1" } }]);
  });

  it.each([
    ["verdadeiro", true],
    ["nulo (não respondido)", null],
  ])("nunca enfileira com contains_minors %s", async (_label, value) => {
    state.photo = photo({ contains_minors: value });
    await expect(enqueueIndexFaces("p1")).resolves.toEqual({ enqueued: false, reason: "not_indexable" });
    expect(state.inserted).toEqual([]);
  });

  it("não enfileira foto excluída nem inexistente", async () => {
    state.photo = photo({ deleted_at: "2026-09-30T00:00:00Z" });
    expect(await enqueueIndexFaces("p1")).toEqual({ enqueued: false, reason: "not_indexable" });
    state.photo = null;
    expect(await enqueueIndexFaces("p1")).toEqual({ enqueued: false, reason: "not_found" });
    expect(state.inserted).toEqual([]);
  });

  it("não duplica job para a mesma foto", async () => {
    state.jobs = [{ id: 7 }];
    expect(await enqueueIndexFaces("p1")).toEqual({ enqueued: false, reason: "already_queued" });
    expect(state.inserted).toEqual([]);
  });

  it("falha do insert propaga (o chamador mostra 'indexação pendente')", async () => {
    state.insertError = { code: "XX000" };
    await expect(enqueueIndexFaces("p1")).rejects.toThrow(/inserir job/);
  });
});
