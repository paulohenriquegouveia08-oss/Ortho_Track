"use client";

import { motion } from "framer-motion";
import { Search, Lightbulb, AlertTriangle, Award, ClipboardList, Link } from "lucide-react";

const items = [
  { icon: Search, title: "Menos achismo", text: "A clínica passa a acompanhar dados reais de uso." },
  { icon: Lightbulb, title: "Pacientes mais conscientes", text: "O app ajuda o paciente a visualizar sua própria rotina." },
  { icon: AlertTriangle, title: "Identificação de risco", text: "Pacientes com baixa aderência ficam mais fáceis de acompanhar." },
  { icon: Award, title: "Diferencial competitivo", text: "A clínica oferece uma experiência mais moderna para pacientes com alinhadores." },
  { icon: ClipboardList, title: "Relatórios organizados", text: "Informações claras para discutir evolução e comportamento." },
  { icon: Link, title: "Acompanhamento contínuo", text: "O sistema cria uma ponte entre paciente e clínica durante o tratamento." },
];

export default function Benefits() {
  return (
    <section className="py-24 bg-surface">
      <div className="mx-auto max-w-6xl px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-14"
        >
          <h2 className="text-2xl md:text-4xl font-bold text-dark mb-4">
            Mais clareza no acompanhamento, sem aumentar a carga da equipe
          </h2>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.08 }}
              className="bg-white rounded-2xl p-6 border border-border hover:shadow-lg hover:border-primary/20 transition-all"
            >
              <div className="w-11 h-11 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                <item.icon size={20} className="text-primary" />
              </div>
              <h3 className="font-bold text-dark mb-2">{item.title}</h3>
              <p className="text-muted text-sm leading-relaxed">{item.text}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
