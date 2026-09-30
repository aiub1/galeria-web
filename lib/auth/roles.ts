import type { Enums } from "@/lib/database.types";

export type UserRole = Enums<"user_role">;

// Espelha can_upload() do core (docs/ARQUITETURA.md §5.1) só para decidir o
// que MOSTRAR no menu. Isto é UX, não controle de acesso — quem decide o
// que cada papel pode de fato ler ou escrever é a RLS (CONTRATO §1). Uma
// rota "restrita" aqui existe só para não confundir o usuário com uma
// galeria vazia; nunca é a barreira real.
export function canUpload(role: UserRole): boolean {
  return role === "admin" || role === "uploader";
}

export function isAdmin(role: UserRole): boolean {
  return role === "admin";
}

export type NavItem = { href: string; label: string };

export function navDefsForRole(role: UserRole): NavItem[] {
  if (role === "admin") {
    return [
      { href: "/eventos", label: "Eventos" },
      { href: "/admin/revisao", label: "Fila de revisão" },
      { href: "/enviar", label: "Enviar" },
      { href: "/privacidade", label: "Privacidade" },
    ];
  }

  if (role === "uploader") {
    return [
      { href: "/eventos", label: "Eventos" },
      { href: "/enviar", label: "Enviar" },
      { href: "/busca", label: "Buscar meu rosto" },
      { href: "/privacidade", label: "Privacidade" },
    ];
  }

  return [
    { href: "/eventos", label: "Eventos" },
    { href: "/busca", label: "Buscar meu rosto" },
    { href: "/privacidade", label: "Privacidade" },
  ];
}
