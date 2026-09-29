import { describe, expect, it } from "vitest";
import { neighborsOf } from "./neighbors";

const ids = ["a", "b", "c", "d"];

describe("neighborsOf", () => {
  it("meio da lista tem anterior e próxima", () => {
    expect(neighborsOf(ids, "b")).toEqual({ prevId: "a", nextId: "c", position: 2, total: 4 });
  });

  it("primeira não tem anterior; última não tem próxima", () => {
    expect(neighborsOf(ids, "a")).toEqual({ prevId: null, nextId: "b", position: 1, total: 4 });
    expect(neighborsOf(ids, "d")).toEqual({ prevId: "c", nextId: null, position: 4, total: 4 });
  });

  it("foto única não tem vizinhas", () => {
    expect(neighborsOf(["a"], "a")).toEqual({ prevId: null, nextId: null, position: 1, total: 1 });
  });

  it("foto fora da lista (a RLS não a liberou nesse recorte) não tem vizinhas", () => {
    expect(neighborsOf(ids, "z")).toBeNull();
    expect(neighborsOf([], "a")).toBeNull();
  });
});
