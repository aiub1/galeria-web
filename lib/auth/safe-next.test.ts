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

  it("rejeita caractere de controle que o navegador remove ao normalizar a URL", () => {
    // "/\t/evil.com" perde o tab na normalização do navegador e vira
    // "//evil.com" → o browser interpreta como "https://evil.com/".
    expect(safeNext("/\t/evil.com")).toBe("/eventos");
    expect(safeNext("/\n/evil.com")).toBe("/eventos");
    expect(safeNext("/\r/evil.com")).toBe("/eventos");
    expect(safeNext("/\u0000/evil.com")).toBe("/eventos");
  });

  it("rejeita espaço literal no caminho", () => {
    expect(safeNext("/ /evil.com")).toBe("/eventos");
  });

  it("aceita %09 percent-encoded, porque continua sendo caminho interno literal", () => {
    // Isto NÃO é o caso perigoso: "%09" são três caracteres imprimíveis
    // (%, 0, 9), não um tab de verdade. O navegador não colapsa "%09" na
    // hora de montar a URL de redirect, então não vira "//evil.com". O caso
    // perigoso é o valor JÁ decodificado chegando em safeNext — coberto
    // no teste abaixo, que é o caminho real percorrido pelo login.
    expect(safeNext("/%09/evil.com")).toBe("/%09/evil.com");
  });

  it("aceita caminho interno legítimo com query", () => {
    expect(safeNext("/eventos?x=1")).toBe("/eventos?x=1");
  });

  it("rejeita o valor já decodificado que chega via searchParams do login", () => {
    // app/(public)/login/page.tsx lê `next` de `searchParams`, que o Next.js
    // já entrega decodificado (como o navegador faria com `URLSearchParams`).
    // Simula exatamente esse caminho: "%09" na URL vira um tab real antes
    // de chegar em safeNext.
    const rawQuery = "next=%2F%09%2Fevil.com";
    const decoded = new URLSearchParams(rawQuery).get("next");
    expect(decoded).toBe("/\t/evil.com");
    expect(safeNext(decoded)).toBe("/eventos");
  });
});
