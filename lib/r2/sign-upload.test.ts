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

const send = vi.fn();
vi.mock("./client", async () => {
  const { S3Client } = await import("@aws-sdk/client-s3");
  const real = new S3Client({
    region: "auto",
    endpoint: "https://acct123.r2.cloudflarestorage.com",
    credentials: { accessKeyId: "AKIATEST", secretAccessKey: "secret-test" },
    requestChecksumCalculation: "WHEN_REQUIRED",
  });
  real.send = send as never;
  return { getR2Client: () => real };
});

const { signPhotoUploads, verifyUploadedObjects, UploadLimitError } = await import("./sign-upload");
const { photoKeys } = await import("@/lib/upload/keys");
const { r2ObjectHost } = await import("./host");

const keys = photoKeys("e1", "p1");
const sizes = { original: 1000, web: 500, thumb: 100 };

describe("signPhotoUploads", () => {
  it("assina PUT das três chaves do CONTRATO §7, no host do bucket, por 10 min", async () => {
    const signed = await signPhotoUploads(keys, sizes);
    for (const variant of ["original", "web", "thumb"] as const) {
      const url = new URL(signed[variant].url);
      expect(url.host).toBe(r2ObjectHost("acct123", "galeria"));
      expect(url.pathname).toBe(`/${keys[variant]}`);
      expect(url.searchParams.get("X-Amz-Expires")).toBe("600");
    }
  });

  it("content-length e content-type entram na assinatura; sem checksum de corpo vazio", async () => {
    const { original } = await signPhotoUploads(keys, sizes);
    const url = new URL(original.url);
    expect(url.searchParams.get("X-Amz-SignedHeaders")).toBe("content-length;content-type;host");
    expect([...url.searchParams.keys()].some((k) => k.toLowerCase().includes("checksum"))).toBe(false);
    expect(original.contentType).toBe("image/webp");
  });

  it("URLs de tamanhos diferentes têm assinaturas diferentes", async () => {
    const a = await signPhotoUploads(keys, sizes);
    const b = await signPhotoUploads(keys, { ...sizes, original: 1001 });
    expect(new URL(a.original.url).searchParams.get("X-Amz-Signature")).not.toBe(
      new URL(b.original.url).searchParams.get("X-Amz-Signature"),
    );
  });

  it.each([
    ["original", 15 * 1024 * 1024 + 1],
    ["web", 3 * 1024 * 1024 + 1],
    ["thumb", 300 * 1024 + 1],
    ["thumb", 0],
    ["web", 1.5],
  ] as const)("recusa %s com %s bytes antes de assinar", async (variant, size) => {
    await expect(signPhotoUploads(keys, { ...sizes, [variant]: size })).rejects.toBeInstanceOf(UploadLimitError);
  });

  it("aceita exatamente o limite", async () => {
    await expect(
      signPhotoUploads(keys, { original: 15 * 1024 * 1024, web: 3 * 1024 * 1024, thumb: 300 * 1024 }),
    ).resolves.toBeDefined();
  });
});

describe("verifyUploadedObjects", () => {
  beforeEach(() => {
    send.mockReset();
  });

  const head = (size: number, type = "image/webp") => ({ ContentLength: size, ContentType: type });

  it("sem problemas quando tamanho e tipo conferem", async () => {
    send.mockImplementation(async (cmd: { input: { Key: string } }) =>
      head(cmd.input.Key.endsWith("/original.webp") ? 1000 : cmd.input.Key.endsWith("/web.webp") ? 500 : 100),
    );
    expect(await verifyUploadedObjects(keys, sizes)).toEqual([]);
  });

  it("acusa tamanho adulterado e tipo errado", async () => {
    send.mockImplementation(async (cmd: { input: { Key: string } }) =>
      cmd.input.Key.endsWith("/original.webp") ? head(999) : cmd.input.Key.endsWith("/web.webp") ? head(500, "image/png") : head(100),
    );
    const problems = await verifyUploadedObjects(keys, sizes);
    expect(problems).toHaveLength(2);
    expect(problems[0]).toMatch(/original.*tamanho/);
    expect(problems[1]).toMatch(/web.*tipo/);
  });

  it("acusa objeto ausente (404) mas propaga outros erros", async () => {
    send.mockRejectedValue(Object.assign(new Error("nf"), { $metadata: { httpStatusCode: 404 } }));
    expect(await verifyUploadedObjects(keys, sizes)).toHaveLength(3);
    send.mockRejectedValue(Object.assign(new Error("boom"), { $metadata: { httpStatusCode: 500 } }));
    await expect(verifyUploadedObjects(keys, sizes)).rejects.toThrow("boom");
  });
});
