import { describe, expect, it } from "vitest";
import { safeNext } from "./safe-next";

describe("safeNext", () => {
  it("aceita um caminho interno relativo", () => {
    expect(safeNext("/busca")).toBe("/busca");
    expect(safeNext("/admin/revisao")).toBe("/admin/revisao");
  });

  it("aceita um caminho interno com query string", () => {
    expect(safeNext("/eventos?foo=bar")).toBe("/eventos?foo=bar");
  });

  it("usa o default quando vazio, nulo ou indefinido", () => {
    expect(safeNext("")).toBe("/eventos");
    expect(safeNext(null)).toBe("/eventos");
    expect(safeNext(undefined)).toBe("/eventos");
  });

  it("rejeita URL absoluta com esquema", () => {
    expect(safeNext("https://evil.com")).toBe("/eventos");
    expect(safeNext("javascript:alert(1)")).toBe("/eventos");
  });

  it("rejeita protocol-relative //", () => {
    expect(safeNext("//evil.com")).toBe("/eventos");
  });

  it("rejeita backslash usado pra confundir o navegador", () => {
    expect(safeNext("/\\evil.com")).toBe("/eventos");
    expect(safeNext("/foo\\bar")).toBe("/eventos");
  });

  it("rejeita caminho que não começa com /", () => {
    expect(safeNext("eventos")).toBe("/eventos");
    expect(safeNext("evil.com/eventos")).toBe("/eventos");
  });
});
