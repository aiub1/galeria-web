import { describe, expect, it } from "vitest";
import { decodeEventsCursor, encodeEventsCursor } from "./cursor";

const id = "3f2b8a52-6c1e-4d0b-9a7e-1b2c3d4e5f60";

describe("cursor de eventos", () => {
  it("faz ida e volta", () => {
    const encoded = encodeEventsCursor({ date: "2026-09-13", id });
    expect(decodeEventsCursor(encoded)).toEqual({ date: "2026-09-13", id });
  });

  it("ignora cursor ausente", () => {
    expect(decodeEventsCursor(undefined)).toBeNull();
    expect(decodeEventsCursor("")).toBeNull();
  });

  // O cursor vem de searchParams e entra num filtro .or() do PostgREST.
  it("rejeita qualquer coisa que não seja data + uuid", () => {
    expect(decodeEventsCursor("2026-09-13")).toBeNull();
    expect(decodeEventsCursor(`2026-09-13_${id}_x`)).toBeNull();
    expect(decodeEventsCursor(`2026-09-13),id.gt.0,and(x.eq.1_${id}`)).toBeNull();
    expect(decodeEventsCursor(`2026-09-13_${id},deleted_at.is.null`)).toBeNull();
    expect(decodeEventsCursor("2026-09-13_not-a-uuid")).toBeNull();
  });
});

describe("cursor com ids fora do padrão RFC (seed, fixtures)", () => {
  it("aceita um uuid bem formado mesmo sem bits de versão", () => {
    const seedId = "44444444-4444-4444-4444-444444444444";
    expect(decodeEventsCursor(`2026-08-23_${seedId}`)).toEqual({ date: "2026-08-23", id: seedId });
  });
});
