"use client";

import { Clock, EyeOff, AlertTriangle, BarChart3 } from "lucide-react";
import Reveal from "./Reveal";

const painPoints = [
  { icon: Clock, title: "Paciente esquece de recolocar", text: "Pausas rápidas durante refeições viram horas sem uso do alinhador.", color: "warning" },
  { icon: EyeOff, title: "Clínica perde visibilidade", text: "O dentista depende do relato do paciente para entender o que aconteceu entre as consultas.", color: "danger" },
  { icon: AlertTriangle, title: "Tratamento pode atrasar", text: "Baixa aderência compromete a previsibilidade e pode prolongar o tratamento.", color: "danger" },
  { icon: BarChart3, title: "Faltam dados objetivos", text: "Sem registros diários, é difícil saber quais pacientes precisam de atenção antes da próxima consulta.", color: "primary" },
];

export default function ProblemSection() {
  return (
    <section id="problema" className="py-24 bg-white relative overflow-hidden">
      <div className="absolute top-20 left-0 w-[200px] h-[200px] bg-danger/[0.03] rounded-full blur-[80px]" />
      <div className="absolute bottom-10 right-0 w-[250px] h-[250px] bg-warning/[0.03] rounded-full blur-[80px]" />

      <div className="mx-auto max-w-6xl px-6 relative z-10">
        <Reveal>
          <div className="text-center mb-16">
            <h2 className="text-2xl md:text-4xl font-bold text-dark mb-4">
              Entre uma consulta e outra, a clínica perde visibilidade
            </h2>
            <p className="text-muted max-w-2xl mx-auto leading-relaxed text-base md:text-lg">
              Em tratamentos com alinhadores removíveis, semanas podem passar sem
              que a clínica saiba se o paciente está realmente usando o aparelho
              pelo tempo recomendado.
            </p>
          </div>
        </Reveal>

        <Reveal delay={0.1}>
          <div className="relative mb-16 max-w-md mx-auto">
            <div className="absolute inset-0 bg-danger/10 rounded-3xl blur-xl" />
            <div className="relative bg-danger/5 border border-danger/15 rounded-3xl p-8 text-center">
              <p className="text-4xl md:text-5xl font-bold text-danger mb-2">6 a 8 semanas</p>
              <p className="text-muted text-sm">sem dados claros de uso entre consultas</p>
            </div>
          </div>
        </Reveal>

        <div className="grid md:grid-cols-2 gap-8 mb-16">
          <Reveal direction="left" delay={0.15}>
            <div className="bg-surface border border-border rounded-3xl p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-11 h-11 rounded-xl bg-danger/10 flex items-center justify-center">
                  <AlertTriangle size={20} className="text-danger" />
                </div>
                <h3 className="font-bold text-dark text-lg">Hoje</h3>
              </div>
              <ul className="space-y-4">
                {["Relato verbal do paciente", "Clínica só descobre problemas na consulta", "Baixa aderência percebida tarde demais", "Decisões baseadas em memória"].map((item, i) => (
                  <li key={i} className="flex items-start gap-3 text-sm text-muted">
                    <div className="w-1.5 h-1.5 rounded-full bg-danger mt-1.5 shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>

          <Reveal direction="right" delay={0.2}>
            <div className="bg-primary-light border border-primary/20 rounded-3xl p-8 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-[100px] h-[100px] bg-primary/[0.05] rounded-full blur-[40px]" />
              <div className="flex items-center gap-3 mb-6 relative z-10">
                <div className="w-11 h-11 rounded-xl bg-primary/10 flex items-center justify-center">
                  <BarChart3 size={20} className="text-primary" />
                </div>
                <h3 className="font-bold text-dark text-lg">Com OrthoTrack</h3>
              </div>
              <ul className="space-y-4 relative z-10">
                {["Registros diários de uso", "Tempo sem uso visível", "Aderência calculada automaticamente", "Pacientes em risco identificados antes"].map((item, i) => (
                  <li key={i} className="flex items-start gap-3 text-sm text-muted">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {painPoints.map((card, i) => (
            <Reveal key={i} delay={0.1 + i * 0.08}>
              <div className="bg-surface rounded-2xl p-5 border border-border hover:shadow-md hover:border-primary/10 transition-all group">
                <div className={`w-10 h-10 rounded-xl bg-${card.color}/10 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform`}>
                  <card.icon size={18} className={`text-${card.color}`} />
                </div>
                <h3 className="font-semibold text-dark text-sm mb-1.5">{card.title}</h3>
                <p className="text-muted text-sm leading-relaxed">{card.text}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
