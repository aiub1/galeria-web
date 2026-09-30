export type Neighbors = {
  prevId: string | null;
  nextId: string | null;
  /** posição (base 1) da foto na lista */
  position: number;
  total: number;
};

// `ids` é a lista de fotos que a consulta com JWT devolveu para o mesmo
// evento e a mesma sessão, já na ordem da galeria. Foto fora da lista (RLS
// não a liberou nesse recorte) não tem vizinhos — nunca inventamos um.
export function neighborsOf(ids: readonly string[], currentId: string): Neighbors | null {
  const index = ids.indexOf(currentId);
  if (index === -1) return null;
  return {
    prevId: ids[index - 1] ?? null,
    nextId: ids[index + 1] ?? null,
    position: index + 1,
    total: ids.length,
  };
}
