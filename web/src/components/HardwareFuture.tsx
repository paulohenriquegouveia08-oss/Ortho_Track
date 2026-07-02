"use client";

import { Cpu, Bluetooth, Zap } from "lucide-react";
import Reveal from "./Reveal";

export default function HardwareFuture() {
  return (
    <section className="py-24 bg-white">
      <div className="mx-auto max-w-4xl px-6">
        <Reveal>
          <div className="bg-gradient-to-br from-surface to-white rounded-3xl border border-border p-10 md:p-14">
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
                <div key={i} className="flex flex-col items-center text-center">
                  <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mb-3">
                    <item.icon size={24} className="text-primary" />
                  </div>
                  <p className="text-sm font-semibold text-dark">{item.label}</p>
                  <p className="text-xs text-muted mt-0.5">{item.desc}</p>
                </div>
              ))}
            </div>

            <div className="grid sm:grid-cols-2 gap-3">
              {["Quando o alinhador sai da caixa, o app poderá iniciar o monitoramento automaticamente.", "Quando o alinhador volta para a caixa, o app poderá pausar o monitoramento.", "A luz UV faz parte da proposta futura de higienização.", "Essa funcionalidade ainda está em desenvolvimento."].map((f, i) => (
                <div key={i} className="flex items-start gap-2.5 text-sm text-muted bg-white rounded-lg p-3 border border-border/50">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 shrink-0" />
                  {f}
                </div>
              ))}
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
