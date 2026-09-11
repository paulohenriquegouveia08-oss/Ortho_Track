"use client";

/**
 * AndroidDownload — Seção dedicada de download do APK para pacientes.
 *
 * Estratégia de download: O arquivo /public/orthotrack-v1.0.18.apk é servido
 * diretamente pelo Next.js em HTTPS, evitando o bloqueio de mixed-content
 * (HTTP VPS → HTTPS site) que afeta a rota de reescrita /baixar-app.
 *
 * Esta seção vive na página principal e é referenciada pela âncora #baixar,
 * incluindo o Header e o Footer. Posicionada após o FAQ e antes do Footer.
 */

const VERSION = "1.0.18";
const APK_URL = "/baixar-app";
const APK_SIZE = "78 MB";

const steps = [
  {
    number: "01",
    title: "Baixe o arquivo",
    description:
      "Clique no botão abaixo para baixar o OrthoTrack diretamente no seu Android.",
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="h-5 w-5"
        aria-hidden="true"
      >
        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
        <polyline points="7 10 12 15 17 10" />
        <line x1="12" y1="15" x2="12" y2="3" />
      </svg>
    ),
  },
  {
    number: "02",
    title: "Permita a instalação",
    description:
      'O Android pedirá permissão para instalar de "fontes desconhecidas". Toque em "Permitir" para continuar.',
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="h-5 w-5"
        aria-hidden="true"
      >
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10" />
        <polyline points="9 12 11 14 15 10" />
      </svg>
    ),
  },
  {
    number: "03",
    title: "Abra o app e entre",
    description:
      "Use o código de convite que sua clínica enviou para criar sua conta e começar a registrar o uso dos alinhadores.",
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="h-5 w-5"
        aria-hidden="true"
      >
        <rect x="5" y="2" width="14" height="20" rx="2" ry="2" />
        <line x1="12" y1="18" x2="12.01" y2="18" />
      </svg>
    ),
  },
];

export default function AndroidDownload() {
  return (
    <section
      id="baixar"
      aria-labelledby="download-heading"
      className="relative overflow-hidden bg-gradient-to-br from-[#061E1B] via-[#082E2A] to-[#061E1B] py-20 sm:py-28"
    >
      {/* Background decoration */}
      <div
        className="pointer-events-none absolute inset-0"
        aria-hidden="true"
      >
        <div className="absolute -left-32 -top-32 h-96 w-96 rounded-full bg-primary/10 blur-3xl" />
        <div className="absolute -bottom-32 -right-32 h-96 w-96 rounded-full bg-primary/8 blur-3xl" />
        <div className="absolute left-1/2 top-1/2 h-64 w-64 -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/5 blur-2xl" />
      </div>

      <div className="relative mx-auto max-w-5xl px-6">
        {/* Header */}
        <div className="text-center">
          {/* Android badge */}
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-primary">
            <svg
              viewBox="0 0 24 24"
              fill="currentColor"
              className="h-3.5 w-3.5"
              aria-hidden="true"
            >
              <path d="M17.523 15.3414c-.5511 0-.9993-.4486-.9993-.9997s.4483-.9993.9993-.9993c.5511 0 .9993.4483.9993.9993.0001.5511-.4482.9997-.9993.9997m-11.046 0c-.5511 0-.9993-.4486-.9993-.9997s.4482-.9993.9993-.9993c.5512 0 .9993.4483.9993.9993 0 .5511-.4481.9997-.9993.9997m11.4044-6.0252L19.2 7.2l-1.7319 3.0004C16.3 9.123 14.3 8.4 12 8.4s-4.3.723-5.4681 1.8004L4.8 7.2 2.118 9.3162C1.4163 10.3413 1 11.5652 1 12.9 1 16.7673 6.0294 20 12 20s11-3.2327 11-7.1c0-1.3348-.4163-2.5587-1.118-3.5838z" />
            </svg>
            Exclusivo para Android
          </div>

          <h2
            id="download-heading"
            className="text-3xl font-bold tracking-tight text-white sm:text-4xl"
          >
            Baixe o aplicativo{" "}
            <span className="text-primary">OrthoTrack</span>
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-base text-white/50">
            O app do paciente para registrar o uso dos alinhadores, acompanhar
            a aderência e ver o progresso dia a dia.
          </p>
        </div>

        {/* Download CTA card */}
        <div className="mt-12 flex flex-col items-center">
          <div className="w-full max-w-md overflow-hidden rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm">
            {/* Card header */}
            <div className="flex items-center justify-between border-b border-white/10 px-6 py-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary shadow-lg shadow-primary/30">
                  <span className="text-xs font-bold text-white">OT</span>
                </div>
                <div>
                  <p className="text-sm font-semibold text-white">OrthoTrack</p>
                  <p className="text-xs text-white/40">Aplicativo do paciente</p>
                </div>
              </div>
              {/* Version badge */}
              <span className="rounded-full bg-primary/20 px-3 py-1 text-xs font-semibold text-primary">
                v{VERSION}
              </span>
            </div>

            {/* Card body */}
            <div className="px-6 py-5">
              <div className="flex items-center justify-between text-sm text-white/40 mb-5">
                <span className="flex items-center gap-1.5">
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-4 w-4"
                    aria-hidden="true"
                  >
                    <path d="M5 17H3a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11a2 2 0 0 1 2 2v3" />
                    <rect x="9" y="11" width="14" height="10" rx="1" />
                    <line x1="12" y1="17" x2="12.01" y2="17" />
                  </svg>
                  Android 8.0+
                </span>
                <span className="flex items-center gap-1.5">
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-4 w-4"
                    aria-hidden="true"
                  >
                    <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
                  </svg>
                  {APK_SIZE} · APK
                </span>
              </div>

              {/* Download button */}
              <a
                href={APK_URL}
                download={`OrthoTrack-v${VERSION}.apk`}
                className="group flex w-full items-center justify-center gap-3 rounded-xl bg-primary px-6 py-3.5 text-sm font-semibold text-white shadow-lg shadow-primary/30 transition-all hover:bg-primary-dark hover:shadow-primary/40 hover:-translate-y-0.5 active:translate-y-0"
              >
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-4 w-4 transition-transform group-hover:translate-y-0.5"
                  aria-hidden="true"
                >
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                  <polyline points="7 10 12 15 17 10" />
                  <line x1="12" y1="15" x2="12" y2="3" />
                </svg>
                Baixar OrthoTrack v{VERSION}
              </a>

              <p className="mt-3 text-center text-xs text-white/30">
                Arquivo APK · Instalação fora da Play Store · Confirme a permissão quando solicitado
              </p>
            </div>
          </div>
        </div>

        {/* Installation steps */}
        <div className="mt-16">
          <p className="mb-8 text-center text-sm font-semibold uppercase tracking-wider text-white/40">
            Como instalar
          </p>
          <div className="grid gap-6 sm:grid-cols-3">
            {steps.map((step) => (
              <div
                key={step.number}
                className="relative rounded-2xl border border-white/8 bg-white/4 p-6 backdrop-blur-sm"
              >
                {/* Number */}
                <div className="mb-4 flex items-center gap-3">
                  <span className="text-3xl font-black text-primary/20 leading-none">
                    {step.number}
                  </span>
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/15 text-primary">
                    {step.icon}
                  </div>
                </div>
                <h3 className="mb-2 text-sm font-semibold text-white">
                  {step.title}
                </h3>
                <p className="text-xs leading-relaxed text-white/40">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Disclaimer */}
        <div className="mt-10 flex items-start gap-3 rounded-xl border border-amber-400/20 bg-amber-400/5 p-4">
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="mt-0.5 h-4 w-4 shrink-0 text-amber-400"
            aria-hidden="true"
          >
            <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3" />
            <line x1="12" y1="9" x2="12" y2="13" />
            <line x1="12" y1="17" x2="12.01" y2="17" />
          </svg>
          <p className="text-xs leading-relaxed text-amber-400/70">
            <strong className="font-semibold text-amber-400">
              Instalação fora da Play Store:
            </strong>{" "}
            Este app ainda não está disponível na Google Play. O Android irá
            alertar sobre a instalação de um arquivo externo — isso é normal.
            Nas configurações do aparelho, permita a instalação a partir do
            navegador ou gerenciador de arquivos.
          </p>
        </div>
      </div>
    </section>
  );
}
