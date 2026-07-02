"use client";

import { motion } from "framer-motion";
import { Clock, EyeOff, AlertTriangle, BarChart3 } from "lucide-react";

export default function ProblemSection() {
  return (
    <section id="problema" className="py-24 bg-white">
      <div className="mx-auto max-w-6xl px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h2 className="text-2xl md:text-4xl font-bold text-dark mb-4">
            Entre uma consulta e outra, a clínica perde visibilidade
          </h2>
          <p className="text-muted max-w-2xl mx-auto leading-relaxed text-base md:text-lg">
            Em tratamentos com alinhadores removíveis, semanas podem passar sem
            que a clínica saiba se o paciente está realmente usando o aparelho
            pelo tempo recomendado.
          </p>
        </motion.div>

        {/* Highlight stat */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="bg-danger/5 border border-danger/10 rounded-2xl p-8 text-center mb-16 max-w-md mx-auto"
        >
          <p className="text-4xl md:text-5xl font-bold text-danger mb-2">6 a 8 semanas</p>
          <p className="text-muted text-sm">sem dados claros de uso entre consultas</p>
        </motion.div>

        {/* Before / After comparison */}
        <div className="grid md:grid-cols-2 gap-8 mb-12">
          {/* Before */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="bg-surface border border-border rounded-2xl p-8"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-danger/10 flex items-center justify-center">
                <AlertTriangle size={20} className="text-danger" />
              </div>
              <h3 className="font-bold text-dark text-lg">Antes</h3>
            </div>
            <ul className="space-y-4">
              <li className="flex items-start gap-3 text-sm text-muted">
                <div className="w-1.5 h-1.5 rounded-full bg-danger mt-1.5 shrink-0" />
                Paciente relata o uso de memória
              </li>
              <li className="flex items-start gap-3 text-sm text-muted">
                <div className="w-1.5 h-1.5 rounded-full bg-danger mt-1.5 shrink-0" />
                Clínica só descobre problemas na consulta
              </li>
              <li className="flex items-start gap-3 text-sm text-muted">
                <div className="w-1.5 h-1.5 rounded-full bg-danger mt-1.5 shrink-0" />
                Difícil identificar baixa aderência
              </li>
              <li className="flex items-start gap-3 text-sm text-muted">
                <div className="w-1.5 h-1.5 rounded-full bg-danger mt-1.5 shrink-0" />
                Poucos dados entre consultas
              </li>
            </ul>
          </motion.div>

          {/* After */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="bg-primary-light border border-primary/10 rounded-2xl p-8"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                <BarChart3 size={20} className="text-primary" />
              </div>
              <h3 className="font-bold text-dark text-lg">Com OrthoTrack</h3>
            </div>
            <ul className="space-y-4">
              <li className="flex items-start gap-3 text-sm text-muted">
                <div className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 shrink-0" />
                Registros diários de uso
              </li>
              <li className="flex items-start gap-3 text-sm text-muted">
                <div className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 shrink-0" />
                Tempo sem uso visível
              </li>
              <li className="flex items-start gap-3 text-sm text-muted">
                <div className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 shrink-0" />
                Aderência calculada automaticamente
              </li>
              <li className="flex items-start gap-3 text-sm text-muted">
                <div className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 shrink-0" />
                Pacientes em risco identificados antes
              </li>
            </ul>
          </motion.div>
        </div>

        {/* Pain points cards */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {[
            { icon: Clock, title: "Paciente esquece de recolocar", text: "Pausas rápidas durante refeições viram horas sem uso.", color: "warning" },
            { icon: EyeOff, title: "Clínica perde visibilidade", text: "O dentista depende do relato do paciente para entender o que aconteceu.", color: "danger" },
            { icon: AlertTriangle, title: "Tratamento pode atrasar", text: "Baixa aderência compromete a previsibilidade do tratamento.", color: "danger" },
            { icon: BarChart3, title: "Faltam dados objetivos", text: "Sem registros, é difícil saber quem precisa de atenção.", color: "primary" },
          ].map((card, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.08 }}
              className="bg-surface rounded-xl p-5 border border-border hover:shadow-md transition-shadow"
            >
              <div className={`w-10 h-10 rounded-xl bg-${card.color}/10 flex items-center justify-center mb-3`}>
                <card.icon size={18} className={`text-${card.color}`} />
              </div>
              <h3 className="font-semibold text-dark text-sm mb-1.5">{card.title}</h3>
              <p className="text-muted text-sm leading-relaxed">{card.text}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
