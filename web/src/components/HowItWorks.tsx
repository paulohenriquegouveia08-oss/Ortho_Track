"use client";

import { UserPlus, ToggleRight, Activity, LayoutDashboard } from "lucide-react";
import Reveal from "./Reveal";

const steps = [
  { number: 1, icon: UserPlus, title: "A clínica adiciona o paciente", text: "A clínica ou dentista gera um convite e vincula o paciente ao tratamento." },
  { number: 2, icon: ToggleRight, title: "O paciente registra o uso", text: "Ao retirar ou recolocar o alinhador, o paciente atualiza seu status no app." },
  { number: 3, icon: Activity, title: "O sistema calcula a aderência", text: "O OrthoTrack transforma eventos de uso em horas, médias, pausas e indicadores." },
  { number: 4, icon: LayoutDashboard, title: "O dentista acompanha", text: "A clínica visualiza quais pacientes estão em boa aderência, em alerta ou em risco." },
];

export default function HowItWorks() {
  return (
    <section id="como-funciona" className="py-24 bg-surface relative">
      <div className="mx-auto max-w-5xl px-6">
        <Reveal>
          <div className="text-center mb-16">
            <h2 className="text-2xl md:text-4xl font-bold text-dark">
              Simples para o paciente. Valioso para a clínica.
            </h2>
          </div>
        </Reveal>

        <div className="grid md:grid-cols-4 gap-6">
          {steps.map((step, i) => (
            <Reveal key={i} delay={0.1 + i * 0.1}>
              <div className="relative flex md:flex-col gap-5 md:gap-0 items-start">
                <div className="w-14 h-14 rounded-2xl bg-primary text-white font-bold text-lg flex items-center justify-center shrink-0 shadow-lg shadow-primary/20">
                  {step.number}
                </div>
                <div className="bg-white rounded-2xl p-5 border border-border flex-1 shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex items-center gap-2 mb-2">
                    <step.icon size={16} className="text-primary" />
                    <h3 className="font-semibold text-dark text-sm">{step.title}</h3>
                  </div>
                  <p className="text-muted text-sm leading-relaxed">{step.text}</p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
