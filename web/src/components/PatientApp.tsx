"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Target, Palette, History } from "lucide-react";
import { patientApp } from "@/content/landing";

const iconMap: Record<string, React.ComponentType<{ size?: number; className?: string }>> = {
  Target,
  Palette,
  History,
};

export default function PatientApp() {
  return (
    <section className="py-20 bg-surface">
      <div className="mx-auto max-w-6xl px-6 grid md:grid-cols-2 gap-12 items-center">
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-2xl md:text-3xl font-bold text-dark mb-4">
            {patientApp.title}
          </h2>
          <p className="text-muted leading-relaxed mb-8">
            {patientApp.description}
          </p>
          <div className="space-y-5">
            {patientApp.cards.map((card, i) => {
              const Icon = iconMap[card.icon];
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 15 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.3, delay: i * 0.1 }}
                  className="flex gap-4 items-start"
                >
                  <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
                    <Icon size={18} className="text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-dark text-sm mb-0.5">{card.title}</h3>
                    <p className="text-muted text-sm leading-relaxed">{card.text}</p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.15 }}
          className="flex justify-center"
        >
          <div className="relative w-64 h-[480px] md:w-72 md:h-[540px]">
            <div className="absolute inset-0 bg-primary/5 rounded-[3rem] rotate-3" />
            <Image
              src="/images/patient-app.png"
              alt="App OrthoTrack - acompanhamento de uso pelo paciente"
              fill
              className="object-contain drop-shadow-2xl relative z-10"
            />
          </div>
        </motion.div>
      </div>
    </section>
  );
}
