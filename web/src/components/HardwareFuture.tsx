"use client";

import { motion } from "framer-motion";
import { Cpu, Bluetooth, Zap } from "lucide-react";
import { hardwareFuture } from "@/content/landing";

export default function HardwareFuture() {
  return (
    <section className="py-20 bg-surface">
      <div className="mx-auto max-w-4xl px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="bg-white rounded-2xl border border-border p-8 md:p-12"
        >
          <div className="text-center mb-8">
            <span className="inline-block bg-warning/10 text-warning text-xs font-semibold px-3 py-1.5 rounded-full mb-4">
              {hardwareFuture.badge}
            </span>
            <h2 className="text-2xl md:text-3xl font-bold text-dark mb-4">
              {hardwareFuture.title}
            </h2>
            <p className="text-muted max-w-xl mx-auto leading-relaxed">
              {hardwareFuture.text}
            </p>
          </div>

          <div className="flex justify-center gap-8 mb-8">
            <div className="flex flex-col items-center gap-2">
              <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center">
                <Cpu size={24} className="text-primary" />
              </div>
              <span className="text-xs font-medium text-muted text-center">Caixa<br />inteligente</span>
            </div>
            <div className="flex flex-col items-center gap-2">
              <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center">
                <Bluetooth size={24} className="text-primary" />
              </div>
              <span className="text-xs font-medium text-muted text-center">Bluetooth<br />sincronização</span>
            </div>
            <div className="flex flex-col items-center gap-2">
              <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center">
                <Zap size={24} className="text-primary" />
              </div>
              <span className="text-xs font-medium text-muted text-center">Luz UV<br />higienização</span>
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-3">
            {hardwareFuture.features.map((feature, i) => (
              <div key={i} className="flex items-start gap-2.5 text-sm text-muted">
                <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2 shrink-0" />
                {feature}
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
