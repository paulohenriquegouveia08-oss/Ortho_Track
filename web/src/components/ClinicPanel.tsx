"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Radio, Bell, FileText } from "lucide-react";
import { clinicPanel } from "@/content/landing";

const iconMap: Record<string, React.ComponentType<{ size?: number; className?: string }>> = {
  Radio,
  Bell,
  FileText,
};

export default function ClinicPanel() {
  return (
    <section id="para-clinicas" className="py-20 bg-white">
      <div className="mx-auto max-w-6xl px-6 grid md:grid-cols-2 gap-12 items-center">
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="order-2 md:order-1 flex justify-center"
        >
          <div className="relative w-80 h-[400px] md:w-96 md:h-[480px]">
            <div className="absolute inset-0 bg-primary/5 rounded-2xl -rotate-2" />
            <Image
              src="/images/clinic-panel.png"
              alt="Painel da clínica OrthoTrack - lista de pacientes com status"
              fill
              className="object-contain drop-shadow-2xl relative z-10"
            />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.15 }}
          className="order-1 md:order-2"
        >
          <h2 className="text-2xl md:text-3xl font-bold text-dark mb-4">
            {clinicPanel.title}
          </h2>
          <p className="text-muted leading-relaxed mb-8">
            {clinicPanel.description}
          </p>
          <div className="space-y-5">
            {clinicPanel.cards.map((card, i) => {
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
      </div>
    </section>
  );
}
