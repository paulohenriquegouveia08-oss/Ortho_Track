"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Target, Clock, Shield, BarChart3 } from "lucide-react";

export default function PatientApp() {
  return (
    <section className="py-24 bg-white">
      <div className="mx-auto max-w-6xl px-6 grid md:grid-cols-2 gap-16 items-center">
        {/* Mockup */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="flex justify-center"
        >
          <div className="relative">
            <div className="mockup-container w-72 md:w-80">
              <Image
                src="/images/patient-app.png"
                alt="App OrthoTrack mostrando acompanhamento de uso pelo paciente com tempo e meta"
                width={320}
                height={640}
                className="w-full h-auto relative z-10 rounded-3xl mockup-shadow"
                style={{ mixBlendMode: 'multiply' }}
              />
            </div>
          </div>
        </motion.div>

        {/* Content */}
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.15 }}
        >
          <h2 className="text-2xl md:text-3xl font-bold text-dark mb-4">
            Um app pensado para criar rotina
          </h2>
          <p className="text-muted leading-relaxed mb-8">
            O paciente acompanha seu próprio progresso, entende quanto tempo usou o
            alinhador e recebe feedback visual sobre sua aderência.
          </p>

          <div className="space-y-6">
            {[
              { icon: Target, title: "Meta diária clara", text: "O paciente sabe exatamente quanto falta para atingir a meta de 22 horas.", color: "primary" },
              { icon: BarChart3, title: "Feedback visual", text: "Verde, amarelo e vermelho ajudam o paciente a entender seu desempenho rapidamente.", color: "success" },
              { icon: Clock, title: "Tempo de uso visível", text: "O cronômetro conta em tempo real, mostrando exatamente quanto já usou hoje.", color: "warning" },
              { icon: Shield, title: "Risco identificado", text: "O sistema avisa quando o paciente está abaixo do mínimo recomendado.", color: "danger" },
            ].map((card, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: i * 0.08 }}
                className="flex gap-4 items-start"
              >
                <div className={`w-10 h-10 rounded-xl bg-${card.color}/10 flex items-center justify-center shrink-0`}>
                  <card.icon size={18} className={`text-${card.color}`} />
                </div>
                <div>
                  <h3 className="font-semibold text-dark text-sm mb-0.5">{card.title}</h3>
                  <p className="text-muted text-sm leading-relaxed">{card.text}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
