"use client";

import { useEffect, useState } from "react";

/**
 * Faixa discreta de download do app, no fim da página.
 *
 * Discreta de propósito: o site vende o OrthoTrack para clínicas, e o app
 * é do paciente. Um botão grande de "baixe o APK" no meio da conversa
 * comercial competiria com o formulário de piloto, que é a conversão que
 * importa aqui.
 *
 * O download passa pela reescrita `/baixar-app` (ver next.config.ts), e
 * não por link direto para a VPS: a API é HTTP, este site é HTTPS, e o
 * navegador bloqueia download inseguro a partir de página segura.
 */

interface Versao {
  latestVersion: string;
  apkSize: number;
}

function emMegabytes(bytes: number): string {
  return `${Math.round(bytes / 1024 / 1024)} MB`;
}

export default function DownloadApp() {
  const [versao, setVersao] = useState<Versao | null>(null);

  useEffect(() => {
    // Falha em silêncio: sem a versão o botão continua funcionando, só
    // não mostra o número. Uma faixa de erro aqui seria ruído sobre algo
    // que ninguém veio buscar.
    fetch("/api/versao-app")
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => {
        if (d?.latestVersion) setVersao(d);
      })
      .catch(() => {});
  }, []);

  return (
    <section aria-labelledby="baixar-app" className="border-t border-black/5 bg-white">
      <div className="mx-auto max-w-6xl px-6 py-10">
        <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 id="baixar-app" className="text-sm font-semibold text-dark">
              Aplicativo do paciente
            </h2>
            <p className="mt-1 text-sm text-subtext">
              Android, instalação direta.
              {versao && (
                <>
                  {" "}
                  <span className="text-subtext/70">
                    Versão {versao.latestVersion}
                    {versao.apkSize > 0 && ` · ${emMegabytes(versao.apkSize)}`}
                  </span>
                </>
              )}
            </p>
          </div>

          <a
            href="/baixar-app"
            className="inline-flex shrink-0 items-center gap-2 rounded-lg border border-primary/25 px-4 py-2.5 text-sm font-medium text-primary transition-colors hover:bg-primary/5"
          >
            <svg
              aria-hidden="true"
              viewBox="0 0 20 20"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.6"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-4 w-4"
            >
              <path d="M10 3v9m0 0 3.5-3.5M10 12 6.5 8.5" />
              <path d="M4 14v1.5A1.5 1.5 0 0 0 5.5 17h9a1.5 1.5 0 0 0 1.5-1.5V14" />
            </svg>
            Baixar o app
          </a>
        </div>

        <p className="mt-3 text-xs text-subtext/70">
          O arquivo vem de fora da Play Store: no Android, confirme a instalação quando o
          aparelho perguntar.
        </p>
      </div>
    </section>
  );
}
