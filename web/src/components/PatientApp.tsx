"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Target, Clock, Shield, BarChart3 } from "lucide-react";
import Reveal from "./Reveal";

export default function PatientApp() {
  return (
    <section className="py-24 bg-white relative overflow-hidden">
      <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-primary/[0.03] rounded-full blur-[100px] -translate-y-1/2 translate-x-1/3" />
      <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-primary/[0.03] rounded-full blur-[80px] translate-y-1/2 -translate-x-1/3" />

      <div className="mx-auto max-w-6xl px-6 grid md:grid-cols-2 gap-12 items-center relative z-10">
        {/* Mockup — larger */}
        <Reveal direction="left">
          <div className="flex justify-center">
            <div className="relative">
              <div className="mockup-container w-64 md:w-80 lg:w-[340px]">
                <Image
                  src="/images/patient-app.png"
                  alt="App OrthoTrack mostrando acompanhamento de uso pelo paciente com tempo, meta de 22h e status"
                  width={360}
                  height={720}
                  className="w-full h-auto relative z-10 rounded-2xl"
                  style={{ filter: "drop-shadow(0 20px 40px rgba(0,0,0,0.15)) drop-shadow(0 5px 15px rgba(0,155,143,0.1))" }}
                />
              </div>
            </div>
          </div>
        </Reveal>

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
