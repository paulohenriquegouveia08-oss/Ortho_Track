"use client";

import { motion } from "framer-motion";
import { Smartphone, Calculator, Stethoscope } from "lucide-react";

const steps = [
  {
    icon: Smartphone,
    number: "01",
    title: "Paciente registra",
    text: "O paciente informa quando retira ou recoloca o alinhador no app.",
  },
  {
    icon: Calculator,
    number: "02",
    title: "Sistema calcula",
    text: "O OrthoTrack transforma eventos em horas usadas, pausas, média e aderência.",
  },
  {
    icon: Stethoscope,
    number: "03",
    title: "Clínica acompanha",
    text: "O dentista vê status, risco e histórico de cada paciente em um painel único.",
  },
];

export default function SolutionSection() {
  return (
    <section id="solucao" className="py-24 bg-white">
      <div className="mx-auto max-w-5xl px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h2 className="text-2xl md:text-4xl font-bold text-dark mb-4">
            O OrthoTrack transforma uso diário em acompanhamento clínico
          </h2>
          <p className="text-muted max-w-2xl mx-auto leading-relaxed">
            Com o app, o paciente registra quando remove e recoloca o alinhador.
            O sistema calcula automaticamente tempo de uso, pausas e aderência.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8">
          {steps.map((step, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.12 }}
              className="text-center"
            >
              <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-5">
                <step.icon size={28} className="text-primary" />
              </div>
              <span className="text-xs font-bold text-primary mb-2 block">Etapa {step.number}</span>
              <h3 className="font-bold text-dark text-lg mb-2">{step.title}</h3>
              <p className="text-muted text-sm leading-relaxed max-w-xs mx-auto">{step.text}</p>
              {i < steps.length - 1 && (
                <div className="hidden md:block absolute top-8 right-0 w-12 h-0.5 bg-border" />
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
