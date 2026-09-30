import "server-only";
import { createClient } from "@/lib/supabase/server";
import type { Tables } from "@/lib/database.types";

export type SessionProfile = {
  userId: string;
  profile: Pick<Tables<"profiles">, "id" | "full_name" | "role" | "is_active" | "avatar_key" | "created_at">;
};

// Lê a própria sessão e o próprio perfil. A policy "read profiles" permite
// o dono ler a própria linha mesmo com is_active=false — é assim que a web
// sabe mostrar "aguardando liberação" em vez de uma galeria vazia.
export async function getSessionProfile(): Promise<SessionProfile | null> {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  const { data: profile } = await supabase
    .from("profiles")
    .select("id, full_name, role, is_active, avatar_key, created_at")
    .eq("id", user.id)
    .single();

  if (!profile) return null;

  return { userId: user.id, profile };
}
