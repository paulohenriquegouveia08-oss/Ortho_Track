"use client";

import { motion } from "framer-motion";
import { Cpu, Bluetooth, Zap } from "lucide-react";

export default function HardwareFuture() {
  return (
    <section className="py-24 bg-white">
      <div className="mx-auto max-w-4xl px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="bg-gradient-to-br from-surface to-white rounded-3xl border border-border p-10 md:p-14"
        >
          <div className="text-center mb-10">
            <span className="inline-block bg-warning/10 text-warning text-xs font-bold px-4 py-1.5 rounded-full mb-4 uppercase tracking-wider">
              Roadmap do produto
            </span>
            <h2 className="text-2xl md:text-3xl font-bold text-dark mb-4">
              Preparado para monitoramento automático com hardware
            </h2>
            <p className="text-muted max-w-xl mx-auto leading-relaxed">
              A evolução do OrthoTrack inclui uma caixa inteligente capaz de detectar
              a retirada e o armazenamento do alinhador, sincronizando eventos com
              o aplicativo via Bluetooth.
            </p>
          </div>

          <div className="flex justify-center gap-10 mb-10">
            {[
              { icon: Cpu, label: "Caixa inteligente", desc: "Detecta retirada e armazenamento" },
              { icon: Bluetooth, label: "Bluetooth", desc: "Sincronização automática" },
              { icon: Zap, label: "Luz UV", desc: "Proposta futura de higienização" },
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: i * 0.1 }}
                className="flex flex-col items-center text-center"
              >
                <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mb-3">
                  <item.icon size={24} className="text-primary" />
                </div>
                <p className="text-sm font-semibold text-dark">{item.label}</p>
                <p className="text-xs text-muted mt-0.5">{item.desc}</p>
              </motion.div>
            ))}
          </div>

          <div className="grid sm:grid-cols-2 gap-3">
            {[
              "Quando o alinhador sai da caixa, o app poderá iniciar o monitoramento automaticamente.",
              "Quando o alinhador volta para a caixa, o app poderá pausar o monitoramento.",
              "A luz UV faz parte da proposta futura de higienização.",
              "Essa funcionalidade ainda está em desenvolvimento.",
            ].map((feature, i) => (
              <div key={i} className="flex items-start gap-2.5 text-sm text-muted bg-surface rounded-lg p-3">
                <div className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 shrink-0" />
                {feature}
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
