import { describe, expect, it } from "vitest";
import { eventSlug } from "./slug";

describe("eventSlug", () => {
  it("tira acento e símbolos e acrescenta a data", () => {
    expect(eventSlug("Culto de Páscoa — Sessão dupla!", "2026-04-05")).toBe("culto-de-pascoa-sessao-dupla-2026-04-05");
  });
  it("nome sem letras usa só a data", () => {
    expect(eventSlug("???", "2026-04-05")).toBe("2026-04-05");
  });
});
