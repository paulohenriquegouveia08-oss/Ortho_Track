"use client";

import { motion } from "framer-motion";

const weeklyData = [
  { day: "Seg", hours: 18 },
  { day: "Ter", hours: 21 },
  { day: "Qua", hours: 16 },
  { day: "Qui", hours: 20 },
  { day: "Sex", hours: 22 },
  { day: "Sab", hours: 19 },
  { day: "Dom", hours: 14 },
];

const maxHours = 24;

export default function ReportsSection() {
  return (
    <section className="py-24 bg-white relative overflow-hidden">
      <div className="absolute top-0 left-0 w-[300px] h-[300px] bg-primary/[0.02] rounded-full blur-[100px]" />

      <div className="mx-auto max-w-6xl px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-14"
        >
          <h2 className="text-2xl md:text-4xl font-bold text-dark mb-4">
            Dados que ajudam a tomar decisões melhores
          </h2>
          <p className="text-muted max-w-2xl mx-auto leading-relaxed">
            O OrthoTrack transforma eventos simples em relatórios claros de
            aderência, permitindo acompanhar evolução diária e semanal.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="bg-white rounded-3xl border border-border shadow-2xl p-8 max-w-5xl mx-auto"
        >
          {/* Dashboard Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h3 className="font-bold text-dark text-lg">Relatório Semanal</h3>
              <p className="text-muted text-sm">João Silva — 23 a 29 de junho</p>
            </div>
            <div className="flex items-center gap-2 bg-success/10 px-4 py-2 rounded-full">
              <div className="w-2.5 h-2.5 rounded-full bg-success" />
              <span className="text-success text-xs font-semibold">91% aderência</span>
            </div>
          </div>

          <div className="grid md:grid-cols-[2fr_1fr] gap-8">
            {/* Chart */}
            <div>
              <p className="text-[11px] font-semibold text-muted mb-4 uppercase tracking-wider">Horas por dia</p>
              <div className="flex items-end gap-3 h-52 border-b border-border pb-3">
                {weeklyData.map((d, i) => {
                  const height = (d.hours / maxHours) * 100;
                  const isGood = d.hours >= 21;
                  const isWarning = d.hours >= 18 && d.hours < 21;
                  const barColor = isGood ? "bg-success" : isWarning ? "bg-warning" : "bg-danger";
                  return (
                    <motion.div
                      key={i}
                      initial={{ height: 0 }}
                      whileInView={{ height: `${height}%` }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.6, delay: i * 0.08, ease: "easeOut" }}
                      className="flex-1 flex flex-col items-center gap-1.5"
                    >
                      <span className="text-[11px] font-bold text-dark">{d.hours}h</span>
                      <div className={`w-full ${barColor} rounded-t-lg`} style={{ height: `${height}%` }} />
                      <span className="text-[10px] text-muted font-medium">{d.day}</span>
                    </motion.div>
                  );
                })}
              </div>
              {/* Meta line indicator */}
              <div className="relative mt-3">
                <div className="flex items-center gap-2">
                  <div className="w-4 border-t-2 border-dashed border-primary/40" />
                  <span className="text-[10px] text-primary font-medium">Meta: 22h</span>
                </div>
              </div>
            </div>

            {/* Metrics */}
            <div className="space-y-0">
              <p className="text-[11px] font-semibold text-muted mb-4 uppercase tracking-wider">Indicadores</p>
              {[
                { label: "Média semanal", value: "18h30", color: "text-dark" },
                { label: "Melhor dia", value: "Sex — 22h", color: "text-success" },
                { label: "Pior dia", value: "Dom — 14h", color: "text-danger" },
                { label: "Maior pausa", value: "3h15min", color: "text-warning" },
                { label: "Total da semana", value: "130h", color: "text-dark" },
              ].map((item, i) => (
                <div key={i} className="flex items-center justify-between py-3 border-b border-border last:border-0">
                  <span className="text-sm text-muted">{item.label}</span>
                  <span className={`text-sm font-bold ${item.color}`}>{item.value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Pause history */}
          <div className="mt-8 pt-6 border-t border-border">
            <p className="text-[11px] font-semibold text-muted mb-3 uppercase tracking-wider">Pausas registradas</p>
            <div className="flex flex-wrap gap-2">
              {[
                { time: "08:30", duration: "15min", type: "Café" },
                { time: "12:00", duration: "45min", type: "Almoço" },
                { time: "15:30", duration: "10min", type: "Lanche" },
                { time: "19:00", duration: "30min", type: "Jantar" },
              ].map((pause, i) => (
                <div key={i} className="bg-surface border border-border rounded-xl px-4 py-2.5 flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-warning" />
                  <span className="text-xs font-medium text-dark">{pause.time}</span>
                  <span className="text-[10px] text-muted">—</span>
                  <span className="text-xs text-muted">{pause.duration}</span>
                  <span className="text-[10px] text-muted">• {pause.type}</span>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
