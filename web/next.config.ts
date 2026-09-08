import type { NextConfig } from "next";

/**
 * O download do app passa por aqui, e não por link direto.
 *
 * O APK é servido pela API na VPS, em HTTP puro. Este site é HTTPS, e o
 * navegador BLOQUEIA download inseguro a partir de página segura —
 * conferido: um `fetch` daqui para lá falha antes de sair. Um link
 * direto simplesmente não baixaria, sem explicação para quem clicou.
 *
 * A reescrita resolve pelo lado do servidor: o navegador vê um endereço
 * HTTPS deste mesmo site, e a Vercel busca na origem. Sem tocar no nginx
 * da VPS, que é compartilhado com o site de outro cliente.
 */
const API_ORTHOTRACK = process.env.NEXT_PUBLIC_API_URL ?? "http://137.131.233.254:3004";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      { source: "/baixar-app", destination: `${API_ORTHOTRACK}/api/app/download` },
      { source: "/api/versao-app", destination: `${API_ORTHOTRACK}/api/app/version` },
    ];
  },
};

export default nextConfig;
