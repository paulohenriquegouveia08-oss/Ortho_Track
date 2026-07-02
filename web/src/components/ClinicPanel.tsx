"use client";

import { motion } from "framer-motion";
import { Users, Activity, AlertTriangle, TrendingUp } from "lucide-react";

const mockPatients = [
  { name: "João Silva", status: "Em uso", hours: "21h30", adherence: 97, risk: "Baixo", statusColor: "success" },
  { name: "Maria Oliveira", status: "Fora de uso", hours: "16h10", adherence: 72, risk: "Alto", statusColor: "danger" },
  { name: "Pedro Santos", status: "Em uso", hours: "20h45", adherence: 91, risk: "Atenção", statusColor: "warning" },
  { name: "Ana Costa", status: "Fora de uso", hours: "19h20", adherence: 85, risk: "Baixo", statusColor: "danger" },
  { name: "Lucas Mendes", status: "Em uso", hours: "22h05", adherence: 99, risk: "Baixo", statusColor: "success" },
];

const statusBg: Record<string, string> = {
  success: "bg-success/10 text-success",
  danger: "bg-danger/10 text-danger",
  warning: "bg-warning/10 text-warning",
};

const riskBg: Record<string, string> = {
  Baixo: "bg-success/10 text-success",
  Alto: "bg-danger/10 text-danger",
  Atenção: "bg-warning/10 text-warning",
};

export default function ClinicPanel() {
  return (
    <section id="para-clinicas" className="py-24 bg-surface">
      <div className="mx-auto max-w-6xl px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-14"
        >
          <h2 className="text-2xl md:text-4xl font-bold text-dark mb-4">
            Visibilidade para o dentista sem depender do relato do paciente
          </h2>
          <p className="text-muted max-w-2xl mx-auto leading-relaxed">
            O painel da clínica centraliza os pacientes e mostra status atual, horas
            de uso, aderência e risco de baixa utilização.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="bg-white rounded-2xl border border-border shadow-xl overflow-hidden max-w-5xl mx-auto"
        >
          {/* Dashboard Header */}
          <div className="bg-dark px-6 py-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
                <span className="text-white font-bold text-xs">OT</span>
              </div>
              <span className="text-white font-semibold text-sm">OrthoTrack Painel da Clínica</span>
            </div>
            <div className="flex items-center gap-2 text-white/60 text-xs">
              <div className="w-2 h-2 rounded-full bg-success animate-pulse" />
              Atualizado agora
            </div>
          </div>

          {/* Metrics Row */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-6 bg-surface border-b border-border">
            {[
              { icon: Users, label: "Pacientes ativos", value: "24", color: "primary" },
              { icon: Activity, label: "Em uso agora", value: "12", color: "success" },
              { icon: AlertTriangle, label: "Em alerta", value: "3", color: "danger" },
              { icon: TrendingUp, label: "Aderência média", value: "87%", color: "primary" },
            ].map((m, i) => (
              <div key={i} className="bg-card rounded-xl p-4 border border-border">
                <div className="flex items-center gap-2 mb-2">
                  <m.icon size={14} className={`text-${m.color}`} />
                  <span className="text-[11px] text-muted font-medium">{m.label}</span>
                </div>
                <p className="text-xl font-bold text-dark">{m.value}</p>
              </div>
            ))}
          </div>

          {/* Table */}
          <div className="p-6">
            <div className="hidden md:grid grid-cols-[2fr_1fr_1fr_1fr_1fr] gap-4 pb-3 border-b border-border text-xs font-semibold text-muted uppercase tracking-wide">
              <span>Paciente</span>
              <span>Status</span>
              <span>Hoje</span>
              <span>Aderência</span>
              <span>Risco</span>
            </div>
            {mockPatients.map((p, i) => (
              <div
                key={i}
                className="grid grid-cols-1 md:grid-cols-[2fr_1fr_1fr_1fr_1fr] gap-3 md:gap-4 py-4 border-b border-border last:border-0 items-center"
              >
                <div>
                  <p className="font-semibold text-dark text-sm">{p.name}</p>
                  <p className="text-xs text-muted md:hidden">Hoje: {p.hours}</p>
                </div>
                <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium w-fit ${statusBg[p.statusColor]}`}>
                  {p.status}
                </span>
                <span className="text-sm font-medium text-dark hidden md:block">{p.hours}</span>
                <div className="hidden md:block">
                  <div className="w-full bg-border rounded-full h-1.5 mb-1">
                    <div
                      className={`h-1.5 rounded-full ${p.adherence >= 90 ? "bg-success" : p.adherence >= 75 ? "bg-warning" : "bg-danger"}`}
                      style={{ width: `${p.adherence}%` }}
                    />
                  </div>
                  <span className="text-xs text-muted">{p.adherence}%</span>
                </div>
                <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium w-fit ${riskBg[p.risk]}`}>
                  {p.risk}
                </span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Feature cards below dashboard */}
        <div className="grid md:grid-cols-3 gap-6 mt-12 max-w-5xl mx-auto">
          {[
            { title: "Status em tempo real", text: "Veja quais pacientes estão usando ou estão sem o alinhador.", icon: Activity },
            { title: "Pacientes em alerta", text: "Identifique rapidamente quem está abaixo da meta ideal.", icon: AlertTriangle },
            { title: "Detalhes por paciente", text: "Acesse histórico, média semanal e comportamento recente.", icon: Users },
          ].map((card, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.1 }}
              className="flex gap-4 items-start"
            >
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                <card.icon size={18} className="text-primary" />
              </div>
              <div>
                <h3 className="font-semibold text-dark text-sm mb-1">{card.title}</h3>
                <p className="text-muted text-sm leading-relaxed">{card.text}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
