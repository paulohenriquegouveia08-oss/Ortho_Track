"use client";

import { Target, Clock, Shield, BarChart3 } from "lucide-react";
import Reveal from "./Reveal";
import { ScrollMockupLayer } from "./ui/ScrollMockupLayer";
import { FloatingMockup } from "./ui/FloatingMockup";

export default function PatientApp() {
  return (
    <section className="py-24 bg-surface relative overflow-hidden">
      <ScrollMockupLayer
        src="/images/patient-app.png"
        alt="Mockup do app como fundo visual"
        side="left"
        opacity={0.06}
      />

      <div className="mx-auto max-w-6xl px-6 grid md:grid-cols-2 gap-12 items-center relative z-10">
        {/* Mockup — free, larger, floating */}
        <FloatingMockup
          src="/images/patient-app.png"
          alt="Aplicativo do paciente mostrando rotina de uso, tempo e meta de 22 horas"
          className="mx-auto w-[300px] md:w-[420px] lg:w-[520px]"
        />

        {/* Content */}
        <div>
          <Reveal direction="right" delay={0.1}>
            <h2 className="text-2xl md:text-3xl font-bold text-dark mb-4">
              Um app pensado para criar rotina
            </h2>
            <p className="text-muted leading-relaxed mb-8">
              O paciente acompanha seu próprio progresso, entende quanto tempo usou o
              alinhador e recebe feedback visual sobre sua aderência.
            </p>
          </Reveal>

          <div className="space-y-5">
            {[
              { icon: Target, title: "Meta diária clara", text: "O paciente sabe exatamente quanto falta para atingir a meta de 22 horas.", color: "primary" },
              { icon: BarChart3, title: "Feedback visual", text: "Verde, amarelo e vermelho ajudam o paciente a entender seu desempenho rapidamente.", color: "success" },
              { icon: Clock, title: "Tempo de uso visível", text: "O cronômetro conta em tempo real, mostrando exatamente quanto já usou hoje.", color: "warning" },
              { icon: Shield, title: "Risco identificado", text: "O sistema avisa quando o paciente está abaixo do mínimo recomendado.", color: "danger" },
            ].map((card, i) => (
              <Reveal key={i} delay={0.15 + i * 0.08} direction="right">
                <div className="flex gap-4 items-start group">
                  <div className={`w-10 h-10 rounded-xl bg-${card.color}/10 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform`}>
                    <card.icon size={18} className={`text-${card.color}`} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-dark text-sm mb-0.5">{card.title}</h3>
                    <p className="text-muted text-sm leading-relaxed">{card.text}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
