"use client";

import { motion } from "framer-motion";
import { Smartphone, Calculator, Stethoscope } from "lucide-react";
import { solution } from "@/content/landing";

const iconMap: Record<string, React.ComponentType<{ size?: number; className?: string }>> = {
  Smartphone,
  Calculator,
  Stethoscope,
};

export default function SolutionSection() {
  return (
    <section id="solucao" className="py-20 bg-white">
      <div className="mx-auto max-w-6xl px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h2 className="text-2xl md:text-3xl font-bold text-dark mb-4">
            {solution.title}
          </h2>
          <p className="text-muted max-w-2xl mx-auto leading-relaxed">
            {solution.description}
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6">
          {solution.cards.map((card, i) => {
            const Icon = iconMap[card.icon];
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.1 }}
                className="bg-surface rounded-xl p-6 border border-border"
              >
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <Icon size={20} className="text-primary" />
                </div>
                <h3 className="font-semibold text-dark mb-2">{card.title}</h3>
                <p className="text-muted text-sm leading-relaxed">{card.text}</p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
