"use client";

import { Users, Activity, AlertTriangle, TrendingUp, Clock, Shield } from "lucide-react";
import Reveal from "./Reveal";

const mockPatients = [
  { name: "João Silva", status: "Em uso", hours: "21h30", adherence: 97, risk: "Baixo", statusColor: "success", updated: "Agora" },
  { name: "Maria Oliveira", status: "Fora de uso", hours: "16h10", adherence: 72, risk: "Alto", statusColor: "danger", updated: "Há 35min" },
  { name: "Pedro Santos", status: "Em uso", hours: "20h45", adherence: 91, risk: "Atenção", statusColor: "warning", updated: "Há 5min" },
  { name: "Ana Costa", status: "Fora de uso", hours: "19h20", adherence: 85, risk: "Baixo", statusColor: "danger", updated: "Há 1h" },
  { name: "Lucas Mendes", status: "Em uso", hours: "22h05", adherence: 99, risk: "Baixo", statusColor: "success", updated: "Agora" },
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
    <section id="para-clinicas" className="py-24 bg-white relative overflow-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-primary/[0.03] rounded-full blur-[120px]" />

      <div className="mx-auto max-w-6xl px-6 relative z-10">
        <Reveal>
          <div className="text-center mb-14">
            <h2 className="text-2xl md:text-4xl font-bold text-dark mb-4">
              Visibilidade para o dentista sem depender do relato do paciente
            </h2>
            <p className="text-muted max-w-2xl mx-auto leading-relaxed">
              O painel da clínica centraliza os pacientes e mostra status atual, horas
              de uso, aderência e risco de baixa utilização.
            </p>
          </div>
        </Reveal>

        <Reveal delay={0.1}>
          <div className="bg-white rounded-3xl border border-border shadow-2xl overflow-hidden max-w-5xl mx-auto">
            {/* Dashboard Header */}
            <div className="bg-dark px-6 py-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
                  <span className="text-white font-bold text-xs">OT</span>
                </div>
                <span className="text-white font-semibold text-sm">OrthoTrack — Painel da Clínica</span>
              </div>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 text-white/50 text-xs">
                  <Clock size={12} />
                  Atualizado agora
                </div>
                <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center">
                  <span className="text-white text-xs font-semibold">DR</span>
                </div>
              </div>
            </div>

            {/* Metrics Row */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-6 bg-surface/50 border-b border-border">
              {[
                { icon: Users, label: "Pacientes ativos", value: "24", color: "primary", change: "+2 esta semana" },
                { icon: Activity, label: "Em uso agora", value: "12", color: "success", change: "50% dos pacientes" },
                { icon: AlertTriangle, label: "Em alerta", value: "3", color: "danger", change: "Abaixo de 18h" },
                { icon: TrendingUp, label: "Aderência média", value: "87%", color: "primary", change: "+5% vs semana anterior" },
              ].map((m, i) => (
                <div key={i} className="bg-card rounded-xl p-4 border border-border hover:shadow-md transition-shadow">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <div className={`w-8 h-8 rounded-lg bg-${m.color}/10 flex items-center justify-center`}>
                        <m.icon size={14} className={`text-${m.color}`} />
                      </div>
                      <span className="text-[11px] text-muted font-medium">{m.label}</span>
                    </div>
                  </div>
                  <p className="text-2xl font-bold text-dark">{m.value}</p>
                  <p className="text-[10px] text-muted mt-0.5">{m.change}</p>
                </div>
              ))}
            </div>

            {/* Table */}
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-dark text-sm">Pacientes</h3>
                <span className="text-xs text-muted bg-surface px-3 py-1 rounded-full">5 de 24</span>
              </div>

              <div className="hidden md:grid grid-cols-[2fr_1fr_1fr_1fr_1fr_1fr] gap-4 pb-3 border-b border-border text-[11px] font-semibold text-muted uppercase tracking-wider">
                <span>Paciente</span>
                <span>Status</span>
                <span>Hoje</span>
                <span>Aderência</span>
                <span>Risco</span>
                <span>Atualização</span>
              </div>
              {mockPatients.map((p, i) => (
                <div
                  key={i}
                  className="grid grid-cols-1 md:grid-cols-[2fr_1fr_1fr_1fr_1fr_1fr] gap-3 md:gap-4 py-4 border-b border-border last:border-0 items-center hover:bg-surface/50 transition-colors rounded-lg"
                >
                  <div>
                    <p className="font-semibold text-dark text-sm">{p.name}</p>
                    <p className="text-[11px] text-muted md:hidden">Hoje: {p.hours} • {p.updated}</p>
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
                    <span className="text-[11px] text-muted">{p.adherence}%</span>
                  </div>
                  <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium w-fit ${riskBg[p.risk]}`}>
                    <Shield size={10} />
                    {p.risk}
                  </span>
                  <span className="text-[11px] text-muted hidden md:block">{p.updated}</span>
                </div>
              ))}
            </div>
          </div>
        </Reveal>

        {/* Feature cards */}
        <div className="grid md:grid-cols-3 gap-6 mt-12 max-w-5xl mx-auto">
          {[
            { title: "Status em tempo real", text: "Veja quais pacientes estão usando ou estão sem o alinhador, a qualquer momento.", icon: Activity },
            { title: "Pacientes em alerta", text: "Identifique rapidamente quem está abaixo da meta ideal de 22 horas diárias.", icon: AlertTriangle },
            { title: "Detalhes por paciente", text: "Acesse histórico de uso, média semanal e comportamento recente de cada paciente.", icon: Users },
          ].map((card, i) => (
            <Reveal key={i} delay={0.2 + i * 0.1}>
              <div className="flex gap-4 items-start group">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                  <card.icon size={18} className="text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-dark text-sm mb-1">{card.title}</h3>
                  <p className="text-muted text-sm leading-relaxed">{card.text}</p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
