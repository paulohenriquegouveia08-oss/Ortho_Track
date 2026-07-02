"use client";

import { ShieldCheck, Cpu, Bluetooth, Zap } from "lucide-react";
import Reveal from "./Reveal";

export default function ClinicalTrustSection() {
  return (
    <section className="py-20 bg-white">
      <div className="mx-auto max-w-6xl px-6 grid md:grid-cols-2 gap-6">
        <Reveal>
          <div className="relative bg-gradient-to-br from-surface to-white border border-border rounded-3xl p-8 md:p-10 overflow-hidden h-full">
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-[60px]" />
            <div className="relative z-10">
              <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center mb-5">
                <ShieldCheck size={24} className="text-primary" />
              </div>
              <h2 className="text-lg md:text-xl font-bold text-dark mb-3">
                Complementa o acompanhamento clínico
              </h2>
              <p className="text-muted leading-relaxed text-sm mb-4">
                O OrthoTrack não substitui a avaliação profissional. A plataforma
                organiza dados de uso e aderência para ajudar clínicas e dentistas a
                acompanharem melhor seus pacientes entre as consultas.
              </p>
              <ul className="space-y-2 text-sm text-muted">
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary shrink-0" />
                  Dados para apoiar o acompanhamento contínuo
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary shrink-0" />
                  Avaliação profissional continua essencial
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary shrink-0" />
                  Mais clareza entre consultas
                </li>
              </ul>
            </div>
          </div>
        </Reveal>

        <Reveal delay={0.1}>
          <div className="relative bg-gradient-to-br from-surface to-white border border-border rounded-3xl p-8 md:p-10 overflow-hidden h-full">
            <div className="absolute bottom-0 right-0 w-24 h-24 bg-primary/5 rounded-full blur-[40px]" />
            <div className="relative z-10">
              <span className="inline-block bg-warning/10 text-warning text-[10px] font-bold px-3 py-1 rounded-full mb-4 uppercase tracking-wider">
                Roadmap do produto
              </span>
              <h2 className="text-lg md:text-xl font-bold text-dark mb-3">
                Monitoramento automático com hardware
              </h2>
              <p className="text-muted text-sm leading-relaxed mb-5">
                A evolução do OrthoTrack inclui uma caixa inteligente capaz de detectar
                a retirada e o armazenamento do alinhador, sincronizando eventos com
                o aplicativo via Bluetooth.
              </p>
              <div className="grid grid-cols-3 gap-3 mb-4">
                {[
                  { icon: Cpu, label: "Caixa inteligente" },
                  { icon: Bluetooth, label: "Bluetooth" },
                  { icon: Zap, label: "Luz UV" },
                ].map((item, i) => (
                  <div key={i} className="flex flex-col items-center text-center">
                    <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center mb-2">
                      <item.icon size={18} className="text-primary" />
                    </div>
                    <p className="text-[11px] font-medium text-dark">{item.label}</p>
                  </div>
                ))}
              </div>
              <p className="text-xs text-muted">
                Essa funcionalidade ainda está em desenvolvimento.
              </p>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
