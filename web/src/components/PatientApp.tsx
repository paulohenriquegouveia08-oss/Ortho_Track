"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Target, Clock, Shield, BarChart3 } from "lucide-react";
import Reveal from "./Reveal";

export default function PatientApp() {
  return (
    <section className="py-24 bg-surface relative overflow-hidden">
      {/* Subtle background glow */}
      <div className="absolute top-1/2 left-[30%] -translate-y-1/2 w-[400px] h-[400px] bg-primary/[0.04] rounded-full blur-[120px] pointer-events-none" />

      <div className="mx-auto max-w-6xl px-6 grid md:grid-cols-2 gap-12 items-center relative z-10">
        {/* Mockup — free, larger, with float */}
        <Reveal direction="left">
          <div className="flex justify-center relative">
            {/* Glow behind phone */}
            <div className="absolute inset-0 bg-primary/[0.06] blur-[80px] rounded-full scale-110 pointer-events-none" />

            <motion.div
              animate={{ y: [0, -8, 0] }}
              transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
              className="relative"
            >
              <Image
                src="/images/patient-app.png"
                alt="App OrthoTrack mostrando acompanhamento de uso pelo paciente com tempo, meta de 22h e status"
                width={520}
                height={720}
                className="w-[300px] md:w-[420px] lg:w-[520px] h-auto relative z-10 rounded-3xl"
                style={{ filter: "drop-shadow(0 25px 50px rgba(0,0,0,0.15)) drop-shadow(0 8px 20px rgba(0,155,143,0.1))" }}
              />
            </motion.div>
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
