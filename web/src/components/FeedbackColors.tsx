"use client";

import { motion } from "framer-motion";
import { CheckCircle, AlertCircle, XCircle } from "lucide-react";

const items = [
  {
    label: "Boa aderência",
    range: "21h30 ou mais",
    text: "Paciente próximo ou acima da meta diária.",
    color: "success",
    bg: "bg-success/5",
    border: "border-success/20",
    textClass: "text-success",
    Icon: CheckCircle,
  },
  {
    label: "Atenção",
    range: "Entre 18h e 21h29",
    text: "Uso abaixo do ideal, mas ainda recuperável.",
    color: "warning",
    bg: "bg-warning/5",
    border: "border-warning/20",
    textClass: "text-warning",
    Icon: AlertCircle,
  },
  {
    label: "Risco",
    range: "Abaixo de 18h",
    text: "Uso muito abaixo do recomendado.",
    color: "danger",
    bg: "bg-danger/5",
    border: "border-danger/20",
    textClass: "text-danger",
    Icon: XCircle,
  },
];

export default function FeedbackColors() {
  return (
    <section className="py-24 bg-white">
      <div className="mx-auto max-w-5xl px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-14"
        >
          <h2 className="text-2xl md:text-4xl font-bold text-dark mb-3">
            Feedback visual para entender aderência rapidamente
          </h2>
          <p className="text-muted max-w-xl mx-auto">
            Cores ajudam a clínica priorizar rapidamente quem precisa de atenção.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6">
          {items.map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.1 }}
              className={`${item.bg} border ${item.border} rounded-2xl p-8 text-center`}
            >
              <item.Icon size={32} className={`${item.textClass} mx-auto mb-4`} />
              <h3 className={`font-bold text-xl ${item.textClass} mb-1`}>{item.label}</h3>
              <p className="text-2xl font-bold text-dark mb-3">{item.range}</p>
              <p className="text-muted text-sm leading-relaxed">{item.text}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
