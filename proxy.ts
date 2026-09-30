import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { buildCsp } from "@/lib/csp";
import { publicEnv } from "@/lib/env";
import { r2ObjectHost } from "@/lib/r2/host";

// Renova a sessão do Supabase a cada requisição. Nenhuma regra de
// visibilidade aqui — quem decide o que o usuário vê é a RLS (CONTRATO §1).
//
// Também copia o caminho da request para o header `x-pathname`: Server
// Components não recebem o pathname da request diretamente, e o layout de
// app/(app) precisa dele só para montar o `?next=` do redirect pro login.
// Isso não é uma regra de visibilidade — é o único jeito de o layout saber
// pra onde voltar depois do login.
//
// A CSP também nasce aqui, porque o nonce de `script-src` é por requisição
// (docs/adr/0003). O Next lê o nonce do header da REQUEST e o aplica nos
// scripts que ele mesmo injeta; o mesmo valor vai na resposta ao navegador.
// Isso exige renderização dinâmica em todas as rotas (ver app/layout.tsx).
export async function proxy(request: NextRequest) {
  request.headers.set("x-pathname", request.nextUrl.pathname + request.nextUrl.search);

  const nonce = btoa(crypto.randomUUID());
  // R2_* são de servidor; aqui só derivam um host público para o `img-src`.
  // Se faltarem (build de CI usa valores fictícios), a CSP fica sem host de
  // imagem e o app acusa o erro de env no primeiro uso do R2, não aqui.
  const csp = buildCsp({
    nonce,
    isDev: process.env.NODE_ENV === "development",
    supabaseUrl: publicEnv.NEXT_PUBLIC_SUPABASE_URL,
    r2ObjectHost: r2ObjectHost(process.env.R2_ACCOUNT_ID ?? "", process.env.R2_BUCKET ?? ""),
    // Encoder WebP em WASM só na tela de upload (docs/adr/0004).
    allowWasm: request.nextUrl.pathname === "/enviar",
  });
  request.headers.set("x-nonce", nonce);
  request.headers.set("content-security-policy", csp);

  let response = NextResponse.next({ request });
  response.headers.set("content-security-policy", csp);

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
          response.headers.set("content-security-policy", csp);
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
