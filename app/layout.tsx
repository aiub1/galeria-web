import type { Metadata } from "next";
import { Archivo, Bebas_Neue, Spectral } from "next/font/google";
import { connection } from "next/server";
import "./globals.css";

// Variable names are the font-specific loader output, not the design tokens
// themselves — app/globals.css composes --font-ui/--font-display/--font-scripture
// from these plus the mockup's own fallback chains (see tokens.css).
const archivo = Archivo({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-archivo",
  display: "swap",
});

const bebasNeue = Bebas_Neue({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-bebas-neue",
  display: "swap",
});

const spectral = Spectral({
  subsets: ["latin"],
  weight: ["400", "600"],
  style: ["normal", "italic"],
  variable: "--font-spectral",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Galeria Poiema CWB",
  description: "Galeria interna de fotos da igreja Poiema CWB.",
};

export default async function RootLayout({ children }: LayoutProps<"/">) {
  // A CSP usa um nonce por requisição (proxy.ts). O Next só injeta o nonce em
  // páginas renderizadas por requisição — página estática ficaria sem nonce e
  // seus scripts seriam bloqueados. Como o app é fechado e toda tela depende
  // de sessão, nada aqui perde por ser dinâmico.
  await connection();

  return (
    <html
      lang="pt-BR"
      className={`${archivo.variable} ${bebasNeue.variable} ${spectral.variable}`}
    >
      <body>{children}</body>
    </html>
  );
}
