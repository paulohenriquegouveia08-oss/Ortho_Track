"use client";

import { motion } from "framer-motion";
import { X, Check } from "lucide-react";

const before = [
  "Paciente relata o uso de memória",
  "Clínica só descobre problemas na consulta",
  "Difícil identificar baixa aderência",
  "Poucos dados entre consultas",
  "Acompanhamento baseado em achismo",
];

const after = [
  "Registros diários de uso",
  "Tempo sem uso visível em tempo real",
  "Aderência calculada automaticamente",
  "Pacientes em risco identificados antes",
  "Decisões baseadas em dados claros",
];

export default function ContrastSection() {
  return (
    <section className="py-24 gradient-contrast overflow-hidden">
      <div className="mx-auto max-w-5xl px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-14"
        >
          <h2 className="text-2xl md:text-4xl font-bold text-white mb-4">
            Do achismo ao acompanhamento por dados
          </h2>
          <p className="text-white/50 max-w-xl mx-auto leading-relaxed">
            Transforme a forma como sua clínica acompanha pacientes com alinhadores.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Before */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8"
          >
            <h3 className="text-lg font-bold text-white/80 mb-6 flex items-center gap-2">
              <span className="text-danger">✕</span> Sem OrthoTrack
            </h3>
            <ul className="space-y-4">
              {before.map((item, i) => (
                <li key={i} className="flex items-start gap-3 text-sm text-white/50">
                  <X size={16} className="text-danger/60 mt-0.5 shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
          </motion.div>

          {/* After */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="bg-primary/10 backdrop-blur-sm border border-primary/20 rounded-2xl p-8"
          >
            <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
              <span className="text-success">✓</span> Com OrthoTrack
            </h3>
            <ul className="space-y-4">
              {after.map((item, i) => (
                <li key={i} className="flex items-start gap-3 text-sm text-white/80">
                  <Check size={16} className="text-success mt-0.5 shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
