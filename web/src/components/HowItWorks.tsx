"use client";

import { motion } from "framer-motion";
import { UserPlus, ToggleRight, Activity, LayoutDashboard } from "lucide-react";
import { howItWorks } from "@/content/landing";

const iconMap: Record<string, React.ComponentType<{ size?: number; className?: string }>> = {
  UserPlus,
  ToggleRight,
  Activity,
  LayoutDashboard,
};

export default function HowItWorks() {
  return (
    <section id="como-funciona" className="py-20 bg-surface">
      <div className="mx-auto max-w-4xl px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-14"
        >
          <h2 className="text-2xl md:text-3xl font-bold text-dark">
            {howItWorks.title}
          </h2>
        </motion.div>

        <div className="relative space-y-8">
          <div className="absolute left-5 top-10 bottom-10 w-0.5 bg-border hidden md:block" />

          {howItWorks.steps.map((step, i) => {
            const Icon = iconMap[step.icon];
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.1 }}
                className="relative flex gap-5 items-start"
              >
                <div className="relative z-10 w-10 h-10 rounded-full bg-primary text-white font-bold text-sm flex items-center justify-center shrink-0">
                  {step.number}
                </div>
                <div className="bg-white rounded-xl p-5 border border-border flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <Icon size={18} className="text-primary" />
                    <h3 className="font-semibold text-dark">{step.title}</h3>
                  </div>
                  <p className="text-muted text-sm leading-relaxed">{step.text}</p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
