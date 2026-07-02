"use client";

import { ShieldCheck } from "lucide-react";
import Reveal from "./Reveal";

export default function ClinicalTrustSection() {
  return (
    <section className="py-16 bg-white">
      <div className="mx-auto max-w-4xl px-6">
        <Reveal>
          <div className="relative bg-gradient-to-br from-surface to-white border border-border rounded-3xl p-10 md:p-14 text-center overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-[60px]" />
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-primary/5 rounded-full blur-[40px]" />
            <div className="relative z-10">
              <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-6">
                <ShieldCheck size={28} className="text-primary" />
              </div>
              <h2 className="text-xl md:text-2xl font-bold text-dark mb-4">
                Complementa o acompanhamento clínico, sem substituir o dentista
              </h2>
              <p className="text-muted leading-relaxed max-w-xl mx-auto text-sm md:text-base">
                O OrthoTrack não substitui a avaliação profissional. A plataforma
                organiza dados de uso e aderência para ajudar clínicas e dentistas a
                acompanharem melhor seus pacientes entre as consultas.
              </p>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
