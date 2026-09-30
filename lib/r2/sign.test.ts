import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("server-only", () => ({}));
vi.mock("@/lib/env.server", () => ({
  serverEnv: {
    R2_ACCOUNT_ID: "acct123",
    R2_ACCESS_KEY_ID: "AKIATEST",
    R2_SECRET_ACCESS_KEY: "secret-test",
    R2_BUCKET: "galeria",
  },
}));

const { signEventCovers, signPhotoUrls, signingWindowStart } = await import("./sign");
const { r2ObjectHost } = await import("./host");

const photo = (id: string, overrides: Partial<{ thumb_key: string; web_key: string }> = {}) => ({
  id,
  thumb_key: `events/e1/photos/${id}/thumb.webp`,
  web_key: `events/e1/photos/${id}/web.webp`,
  ...overrides,
});

const at = (iso: string) => new Date(iso).getTime();

describe("signPhotoUrls", () => {
  beforeEach(() => vi.useRealTimers());

  it("assina a chave certa de cada variante", async () => {
    const [thumb, web] = await Promise.all([
      signPhotoUrls([photo("p1")], "thumb", at("2026-09-29T12:03:00Z")),
      signPhotoUrls([photo("p1")], "web", at("2026-09-29T12:03:00Z")),
    ]);
    expect(new URL(thumb.get("p1")!).pathname).toBe("/events/e1/photos/p1/thumb.webp");
    expect(new URL(web.get("p1")!).pathname).toBe("/events/e1/photos/p1/web.webp");
  });

  it("nunca assina o original, mesmo que a linha o traga", async () => {
    const row = { ...photo("p1"), storage_key: "events/e1/photos/p1/original.webp" };
    for (const variant of ["thumb", "web"] as const) {
      const url = (await signPhotoUrls([row], variant)).get("p1")!;
      expect(url).not.toContain("original");
    }
  });

  it("emite GET para o host virtual-hosted do bucket, o mesmo da CSP", async () => {
    const url = new URL((await signPhotoUrls([photo("p1")], "thumb")).get("p1")!);
    expect(url.protocol).toBe("https:");
    expect(url.host).toBe(r2ObjectHost("acct123", "galeria"));
    expect(url.searchParams.get("X-Amz-Expires")).toBe("1800");
    expect(url.searchParams.get("X-Amz-SignedHeaders")).toBe("host");
  });

  it("gera a mesma URL para a mesma foto dentro da janela de 10 min", async () => {
    const a = await signPhotoUrls([photo("p1")], "thumb", at("2026-09-29T12:00:01Z"));
    const b = await signPhotoUrls([photo("p1")], "thumb", at("2026-09-29T12:09:59Z"));
    expect(a.get("p1")).toBe(b.get("p1"));
    expect(new URL(a.get("p1")!).searchParams.get("X-Amz-Date")).toBe("20260929T120000Z");
  });

  it("muda a URL ao virar a janela", async () => {
    const a = await signPhotoUrls([photo("p1")], "thumb", at("2026-09-29T12:09:59Z"));
    const b = await signPhotoUrls([photo("p1")], "thumb", at("2026-09-29T12:10:00Z"));
    expect(a.get("p1")).not.toBe(b.get("p1"));
    expect(new URL(b.get("p1")!).searchParams.get("X-Amz-Date")).toBe("20260929T121000Z");
  });

  it("recusa linha sem a chave da variante, sem assinar nenhuma das outras", async () => {
    await expect(
      signPhotoUrls([photo("p1"), photo("p2", { thumb_key: "" })], "thumb"),
    ).rejects.toThrow(/p2/);
    await expect(
      signPhotoUrls([{ id: "p3", web_key: "k" } as never], "thumb"),
    ).rejects.toThrow(/p3/);
  });

  it("lista vazia não assina nada", async () => {
    expect((await signPhotoUrls([], "thumb")).size).toBe(0);
  });
});

describe("signEventCovers", () => {
  it("assina só eventos com cover_key", async () => {
    const covers = await signEventCovers([
      { id: "e1", cover_key: "events/e1/cover.webp" },
      { id: "e2", cover_key: null },
      { id: "e3", cover_key: "" },
    ]);
    expect([...covers.keys()]).toEqual(["e1"]);
    expect(new URL(covers.get("e1")!).pathname).toBe("/events/e1/cover.webp");
  });
});

describe("signingWindowStart", () => {
  it("arredonda para o início do bloco de 10 min", () => {
    expect(signingWindowStart(at("2026-09-29T12:07:31.500Z")).toISOString()).toBe("2026-09-29T12:00:00.000Z");
    expect(signingWindowStart(at("2026-09-29T12:10:00Z")).toISOString()).toBe("2026-09-29T12:10:00.000Z");
  });
});
