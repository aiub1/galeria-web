import "server-only";
import { headers } from "next/headers";
import { notFound, redirect } from "next/navigation";
import { getSessionProfile, type SessionProfile } from "@/lib/auth/session";
import { safeNext } from "@/lib/auth/safe-next";

// Checagem própria de cada página/action que assina URL do R2 ou lê o acervo.
//
// O layout de app/(app) já mostra "Aguardando liberação" para perfil inativo,
// mas isso não protege a página por baixo: no App Router, layout e página são
// avaliados em paralelo, então a página pode rodar (e assinar URLs) mesmo
// quando o layout decidiu não renderizá-la. Cada ponto de entrada repete a
// checagem — não se apoia no layout.
//
// Perfil inativo → notFound(), não redirect: o layout já está exibindo a tela
// de espera nessa mesma URL, e um redirect para /eventos entraria em laço.
export async function requireActiveProfile(): Promise<SessionProfile> {
  const session = await getSessionProfile();

  if (!session) {
    const currentPath = (await headers()).get("x-pathname");
    redirect(`/login?next=${encodeURIComponent(safeNext(currentPath))}`);
  }

  if (!session.profile.is_active) notFound();

  return session;
}
