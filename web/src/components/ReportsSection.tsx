"use client";

import { motion } from "framer-motion";
import Reveal from "./Reveal";

const weeklyData = [
  { day: "Seg", hours: 18 },
  { day: "Ter", hours: 21 },
  { day: "Qua", hours: 16 },
  { day: "Qui", hours: 20 },
  { day: "Sex", hours: 22 },
  { day: "Sab", hours: 19 },
  { day: "Dom", hours: 14 },
];

const goal = 22;

function barColor(h: number) {
  if (h >= 21.5) return "bg-success";
  if (h >= 18) return "bg-warning";
  return "bg-danger";
}

export default function ReportsSection() {
  return (
    <section className="py-24 bg-surface relative overflow-hidden">
      <div className="absolute top-0 left-0 w-[300px] h-[300px] bg-primary/[0.03] rounded-full blur-[100px] pointer-events-none" />

      <div className="mx-auto max-w-6xl px-6 relative z-10">
        <Reveal>
          <div className="text-center mb-14">
            <h2 className="text-2xl md:text-4xl font-bold text-dark mb-4">
              Dados que ajudam a tomar decisões melhores
            </h2>
            <p className="text-muted max-w-2xl mx-auto leading-relaxed">
              O OrthoTrack transforma eventos simples em relatórios claros de
              aderência, permitindo acompanhar evolução diária e semanal.
            </p>
          </div>
        </Reveal>

        <Reveal delay={0.1}>
          <div className="bg-white rounded-3xl border border-border shadow-2xl p-8 max-w-5xl mx-auto">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="font-bold text-dark text-lg">Relatório Semanal</h3>
                <p className="text-muted text-sm">João Silva — 23 a 29 de junho</p>
              </div>
              <div className="flex items-center gap-2 bg-success/10 px-4 py-2 rounded-full">
                <div className="w-2.5 h-2.5 rounded-full bg-success" />
                <span className="text-success text-xs font-semibold">91% aderência</span>
              </div>
            </div>

            <div className="grid lg:grid-cols-[1.4fr_0.8fr] gap-8">
              {/* Chart — aligned bars */}
              <div>
                <p className="mb-4 text-[11px] font-semibold text-muted uppercase tracking-wider">Horas por dia</p>

                {/* Fixed height chart area */}
                <div className="h-64 border-b border-border">
                  <div className="flex items-end justify-between h-full gap-3 pt-6">
                    {weeklyData.map((d, i) => {
                      const heightPct = (d.hours / goal) * 100;
                      return (
                        <div key={i} className="flex flex-1 flex-col items-center justify-end h-full">
                          {/* Value above bar */}
                          <span className="mb-2 text-[11px] font-bold text-dark">{d.hours}h</span>
                          {/* Bar */}
                          <motion.div
                            initial={{ height: 0 }}
                            whileInView={{ height: `${heightPct}%` }}
                            viewport={{ once: true, amount: 0.3 }}
                            transition={{ duration: 0.8, delay: i * 0.08, ease: "easeOut" }}
                            className={`w-full max-w-[64px] rounded-t-xl ${barColor(d.hours)}`}
                          />
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Day labels — fixed baseline */}
                <div className="flex justify-between gap-3 mt-3">
                  {weeklyData.map((d, i) => (
                    <span key={i} className="flex-1 text-center text-[11px] text-muted font-medium">{d.day}</span>
                  ))}
                </div>

                {/* Goal line legend */}
                <div className="mt-3 flex items-center gap-2">
                  <div className="w-4 border-t-2 border-dashed border-primary/40" />
                  <span className="text-[10px] text-primary font-medium">Meta: {goal}h</span>
                </div>
              </div>

              {/* Indicators — staggered */}
              <div>
                <p className="mb-4 text-[11px] font-semibold text-muted uppercase tracking-wider">Indicadores</p>
                {[
                  { label: "Média semanal", value: "18h30", color: "text-dark" },
                  { label: "Melhor dia", value: "Sex — 22h", color: "text-success" },
                  { label: "Pior dia", value: "Dom — 14h", color: "text-danger" },
                  { label: "Maior pausa", value: "3h15min", color: "text-warning" },
                  { label: "Total da semana", value: "130h", color: "text-dark" },
                ].map((item, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: 12 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: 0.1 + i * 0.06 }}
                    className="flex items-center justify-between py-3 border-b border-border last:border-0"
                  >
                    <span className="text-sm text-muted">{item.label}</span>
                    <span className={`text-sm font-bold ${item.color}`}>{item.value}</span>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Pausas */}
            <div className="mt-6 pt-5 border-t border-border">
              <p className="mb-3 text-[11px] font-semibold text-muted uppercase tracking-wider">Pausas registradas</p>
              <div className="flex flex-wrap gap-2">
                {[
                  { time: "08:30", duration: "15min", type: "Café" },
                  { time: "12:00", duration: "45min", type: "Almoço" },
                  { time: "15:30", duration: "10min", type: "Lanche" },
                  { time: "19:00", duration: "30min", type: "Jantar" },
                ].map((pause, i) => (
                  <div key={i} className="bg-surface border border-border rounded-xl px-4 py-2 flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-warning" />
                    <span className="text-xs font-medium text-dark">{pause.time}</span>
                    <span className="text-[10px] text-muted">—</span>
                    <span className="text-xs text-muted">{pause.duration}</span>
                    <span className="text-[10px] text-muted">• {pause.type}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
