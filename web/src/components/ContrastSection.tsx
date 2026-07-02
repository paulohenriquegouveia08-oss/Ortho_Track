"use client";

import { motion } from "framer-motion";
import { X, Check } from "lucide-react";
import Reveal from "./Reveal";

const before = [
  "O paciente relata o uso de memória",
  "A clínica só descobre problemas semanas depois",
  "É difícil saber quem está em risco",
  "A aderência fica invisível entre consultas",
  "Decisões baseadas em achismo",
];

const after = [
  "O uso diário fica registrado automaticamente",
  "O tempo sem uso é calculado em tempo real",
  "A aderência aparece em relatórios claros",
  "Pacientes em alerta são identificados antes",
  "Decisões baseadas em dados objetivos",
];

export default function ContrastSection() {
  return (
    <section className="py-24 gradient-contrast overflow-hidden relative noise-overlay">
      <div className="absolute top-0 left-0 w-[400px] h-[400px] bg-primary/[0.08] rounded-full blur-[120px] -translate-x-1/3 -translate-y-1/3" />
      <div className="absolute bottom-0 right-0 w-[300px] h-[300px] bg-primary/[0.06] rounded-full blur-[100px] translate-x-1/3 translate-y-1/3" />

      <div className="mx-auto max-w-5xl px-6 relative z-10">
        <Reveal>
          <div className="text-center mb-16">
            <h2 className="text-2xl md:text-4xl font-bold text-white mb-4">
              Do achismo ao acompanhamento por dados
            </h2>
            <p className="text-white/50 max-w-xl mx-auto leading-relaxed text-lg">
              Transforme a forma como sua clínica acompanha pacientes com alinhadores.
            </p>
          </div>
        </Reveal>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Before */}
          <Reveal direction="left" delay={0.1}>
            <div className="bg-white/[0.04] backdrop-blur-sm border border-white/10 rounded-3xl p-8 md:p-10">
              <h3 className="text-lg font-bold text-white/70 mb-8 flex items-center gap-3">
                <span className="w-10 h-10 rounded-xl bg-danger/20 flex items-center justify-center">
                  <X size={20} className="text-danger" />
                </span>
                Sem OrthoTrack
              </h3>
              <ul className="space-y-5">
                {before.map((item, i) => (
                  <li key={i} className="flex items-start gap-3 text-sm text-white/50">
                    <X size={16} className="text-danger/50 mt-0.5 shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>

          {/* After */}
          <Reveal direction="right" delay={0.2}>
            <div className="bg-primary/10 backdrop-blur-sm border border-primary/20 rounded-3xl p-8 md:p-10 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-[100px] h-[100px] bg-primary/10 rounded-full blur-[40px]" />
              <h3 className="text-lg font-bold text-white mb-8 flex items-center gap-3 relative z-10">
                <span className="w-10 h-10 rounded-xl bg-success/20 flex items-center justify-center">
                  <Check size={20} className="text-success" />
                </span>
                Com OrthoTrack
              </h3>
              <ul className="space-y-5 relative z-10">
                {after.map((item, i) => (
                  <li key={i} className="flex items-start gap-3 text-sm text-white/80">
                    <Check size={16} className="text-success mt-0.5 shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
