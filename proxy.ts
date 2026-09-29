import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { publicEnv } from "@/lib/env";

// Renova a sessão do Supabase a cada requisição. Nenhuma regra de
// visibilidade aqui — quem decide o que o usuário vê é a RLS (CONTRATO §1).
//
// Também copia o caminho da request para o header `x-pathname`: Server
// Components não recebem o pathname da request diretamente, e o layout de
// app/(app) precisa dele só para montar o `?next=` do redirect pro login.
// Isso não é uma regra de visibilidade — é o único jeito de o layout saber
// pra onde voltar depois do login.
export async function proxy(request: NextRequest) {
  request.headers.set("x-pathname", request.nextUrl.pathname + request.nextUrl.search);
  let response = NextResponse.next({ request });

  const supabase = createServerClient(
    publicEnv.NEXT_PUBLIC_SUPABASE_URL,
    publicEnv.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          for (const { name, value } of cookiesToSet) {
            request.cookies.set(name, value);
          }
          response = NextResponse.next({ request });
          for (const { name, value, options } of cookiesToSet) {
            response.cookies.set(name, value, options);
          }
        },
      },
    }
  );

  await supabase.auth.getUser();

  return response;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|webp|gif)$).*)"],
};
