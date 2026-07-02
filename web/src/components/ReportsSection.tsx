"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Clock, Pause, TrendingUp, AlertCircle, CheckCircle, Shield } from "lucide-react";
import { reports } from "@/content/landing";

const iconMap: Record<string, React.ComponentType<{ size?: number; className?: string }>> = {
  Clock,
  Pause,
  TrendingUp,
  AlertCircle,
  CheckCircle,
  Shield,
};

export default function ReportsSection() {
  return (
    <section className="py-20 bg-surface">
      <div className="mx-auto max-w-6xl px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h2 className="text-2xl md:text-3xl font-bold text-dark mb-4">
            {reports.title}
          </h2>
          <p className="text-muted max-w-2xl mx-auto leading-relaxed">
            {reports.description}
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8 items-center">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="relative w-full aspect-[4/3] rounded-2xl overflow-hidden bg-card border border-border shadow-lg"
          >
            <Image
              src="/images/reports.png"
              alt="Relatórios OrthoTrack - indicadores de aderência e uso"
              fill
              className="object-cover"
            />
          </motion.div>

          <div className="grid grid-cols-2 gap-4">
            {reports.indicators.map((ind, i) => {
              const Icon = iconMap[ind.icon];
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 15 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.3, delay: i * 0.08 }}
                  className="bg-card rounded-xl p-4 border border-border"
                >
                  <Icon size={18} className="text-primary mb-2" />
                  <p className="text-sm font-medium text-dark">{ind.label}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
