"use client";

import { motion } from "framer-motion";

const weeklyData = [
  { day: "Seg", hours: 18, target: 22 },
  { day: "Ter", hours: 21, target: 22 },
  { day: "Qua", hours: 16, target: 22 },
  { day: "Qui", hours: 20, target: 22 },
  { day: "Sex", hours: 22, target: 22 },
  { day: "Sab", hours: 19, target: 22 },
  { day: "Dom", hours: 14, target: 22 },
];

const maxHours = 24;

export default function ReportsSection() {
  return (
    <section className="py-24 bg-surface">
      <div className="mx-auto max-w-6xl px-6">
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
            O OrthoTrack organiza os registros de uso em relatórios claros,
            permitindo acompanhar evolução diária e semanal.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="bg-white rounded-2xl border border-border shadow-xl p-8 max-w-5xl mx-auto"
        >
          {/* Dashboard Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h3 className="font-bold text-dark text-lg">Relatório Semanal</h3>
              <p className="text-muted text-sm">João Silva — 23 a 29 de junho</p>
            </div>
            <div className="flex items-center gap-2 bg-success/10 px-3 py-1.5 rounded-full">
              <div className="w-2 h-2 rounded-full bg-success" />
              <span className="text-success text-xs font-semibold">91% aderência</span>
            </div>
          </div>

          <div className="grid md:grid-cols-[2fr_1fr] gap-8">
            {/* Chart */}
            <div>
              <p className="text-xs font-semibold text-muted mb-4 uppercase tracking-wide">Horas por dia</p>
              <div className="flex items-end gap-3 h-48">
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
                      transition={{ duration: 0.5, delay: i * 0.08 }}
                      className="flex-1 flex flex-col items-center gap-1"
                    >
                      <span className="text-[10px] font-semibold text-dark">{d.hours}h</span>
                      <div className={`w-full ${barColor} rounded-t-md transition-colors`} style={{ height: `${height}%` }} />
                      <span className="text-[10px] text-muted">{d.day}</span>
                    </motion.div>
                  );
                })}
              </div>
              {/* Meta line */}
              <div className="relative mt-2">
                <div className="absolute left-0 right-0 border-t-2 border-dashed border-primary/30" style={{ bottom: `${(22 / maxHours) * 100}%` }} />
              </div>
            </div>

            {/* Metrics */}
            <div className="space-y-4">
              <p className="text-xs font-semibold text-muted uppercase tracking-wide">Indicadores</p>
              {[
                { label: "Média semanal", value: "18h30", color: "text-dark" },
                { label: "Melhor dia", value: "Sex — 22h", color: "text-success" },
                { label: "Pior dia", value: "Dom — 14h", color: "text-danger" },
                { label: "Maior pausa", value: "3h15min", color: "text-warning" },
                { label: "Total da semana", value: "130h", color: "text-dark" },
              ].map((item, i) => (
                <div key={i} className="flex items-center justify-between py-2 border-b border-border last:border-0">
                  <span className="text-sm text-muted">{item.label}</span>
                  <span className={`text-sm font-bold ${item.color}`}>{item.value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Pause history */}
          <div className="mt-8 pt-6 border-t border-border">
            <p className="text-xs font-semibold text-muted mb-3 uppercase tracking-wide">Pausas registradas</p>
            <div className="flex flex-wrap gap-2">
              {["08:30 — 15min", "12:00 — 45min", "15:30 — 10min", "19:00 — 30min"].map((pause, i) => (
                <span key={i} className="bg-surface border border-border rounded-lg px-3 py-1.5 text-xs text-muted">
                  {pause}
                </span>
              ))}
            </div>
          </div>
        </motion.div>

        <p className="text-center text-muted text-sm mt-6 italic">
          O OrthoTrack transforma eventos simples em relatórios de acompanhamento.
        </p>
      </div>
    </section>
  );
}
