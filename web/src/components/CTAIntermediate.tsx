"use client";

import { ArrowRight } from "lucide-react";
import Reveal from "./Reveal";

export default function CTAIntermediate() {
  return (
    <section className="py-20 gradient-contrast relative noise-overlay">
      <div className="absolute top-0 left-0 w-[300px] h-[200px] bg-primary/[0.08] rounded-full blur-[100px] -translate-x-1/3" />
      <div className="mx-auto max-w-4xl px-6 text-center relative z-10">
        <Reveal>
          <h2 className="text-2xl md:text-4xl font-bold text-white mb-4">
            Quer validar o OrthoTrack na sua clínica?
          </h2>
          <p className="text-white/60 mb-8 max-w-xl mx-auto leading-relaxed text-lg">
            Estamos buscando clínicas parceiras para testar uma nova forma de
            acompanhar pacientes com alinhadores removíveis.
          </p>
          <a
            href="#piloto"
            className="inline-flex items-center gap-2 bg-primary text-white font-semibold px-8 py-4 rounded-xl hover:bg-primary-dark transition-all shadow-lg shadow-primary/30 text-base"
          >
            Quero participar do piloto
            <ArrowRight size={18} />
          </a>
        </Reveal>
      </div>
    </section>
  );
}
