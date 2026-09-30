import { describe, expect, it } from "vitest";
import { buildCsp } from "./csp";

const base = {
  nonce: "abc123",
  isDev: false,
  supabaseUrl: "https://proj.supabase.co",
  r2ObjectHost: "bucket.acct.r2.cloudflarestorage.com",
};

describe("buildCsp", () => {
  const csp = buildCsp(base);
  const directive = (name: string) => csp.split("; ").find((d) => d.startsWith(`${name} `));

  it("script-src usa nonce e nunca unsafe-inline", () => {
    expect(directive("script-src")).toBe("script-src 'self' 'nonce-abc123' 'strict-dynamic'");
    expect(csp).not.toContain("script-src 'self' 'unsafe-inline'");
    expect(directive("script-src")).not.toContain("unsafe-inline");
    expect(directive("script-src")).not.toContain("unsafe-eval");
  });

  it("wasm-unsafe-eval só quando pedido (tela de upload), sem liberar unsafe-eval", () => {
    expect(directive("script-src")).not.toContain("wasm-unsafe-eval");
    const withWasm = buildCsp({ ...base, allowWasm: true });
    expect(withWasm).toContain("script-src 'self' 'nonce-abc123' 'strict-dynamic' 'wasm-unsafe-eval';");
    expect(withWasm).not.toMatch(/'unsafe-eval'/);
  });

  it("unsafe-eval só em desenvolvimento", () => {
    expect(directive("script-src")).not.toContain("unsafe-eval");
    expect(buildCsp({ ...base, isDev: true })).toContain("'unsafe-eval'");
  });

  it("style-src usa nonce em produção e unsafe-inline só em desenvolvimento", () => {
    expect(directive("style-src")).toBe("style-src 'self' 'nonce-abc123'");
    const dev = buildCsp({ ...base, isDev: true });
    expect(dev).toContain("style-src 'self' 'unsafe-inline'");
    expect(dev).not.toContain("style-src 'self' 'nonce");
  });

  it("img-src libera o host exato do bucket, não http", () => {
    expect(directive("img-src")).toBe("img-src 'self' data: blob: https://bucket.acct.r2.cloudflarestorage.com");
  });

  it("connect-src cobre Supabase (https e wss) e o mesmo host exato do bucket (PUT do upload)", () => {
    expect(directive("connect-src")).toBe(
      "connect-src 'self' https://proj.supabase.co wss://proj.supabase.co https://bucket.acct.r2.cloudflarestorage.com",
    );
  });

  it("Supabase local em http usa ws", () => {
    const local = buildCsp({ ...base, supabaseUrl: "http://127.0.0.1:54321" });
    expect(local).toContain("connect-src 'self' http://127.0.0.1:54321 ws://127.0.0.1:54321 https://bucket.acct");
  });

  it("fecha o resto", () => {
    expect(csp).toContain("default-src 'self'");
    expect(csp).toContain("frame-ancestors 'none'");
    expect(csp).toContain("base-uri 'self'");
    expect(csp).toContain("form-action 'self'");
    expect(csp).toContain("object-src 'none'");
  });
});
