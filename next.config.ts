import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "X-Frame-Options", value: "DENY" },
          // Só frame-ancestors por enquanto — a CSP completa (script-src,
          // img-src com o domínio do R2, etc.) fica para a fase 3, quando o
          // upload/exibição de fotos entrar (docs/adr/0002, seção Hardening).
          { key: "Content-Security-Policy", value: "frame-ancestors 'none'" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "X-Content-Type-Options", value: "nosniff" },
        ],
      },
    ];
  },
};

export default nextConfig;
