"use client";

import { Search, Lightbulb, AlertTriangle, Award, ClipboardList, Link } from "lucide-react";
import Reveal from "./Reveal";

const items = [
  { icon: Search, title: "Menos achismo", text: "A clínica passa a acompanhar dados reais de uso em vez de depender do relato do paciente.", featured: true },
  { icon: Lightbulb, title: "Pacientes mais conscientes", text: "O app ajuda o paciente a visualizar sua própria rotina de uso.", featured: false },
  { icon: AlertTriangle, title: "Identificação de risco", text: "Pacientes com baixa aderência ficam mais fáceis de acompanhar.", featured: false },
  { icon: Award, title: "Diferencial competitivo", text: "A clínica oferece uma experiência mais moderna para pacientes com alinhadores.", featured: false },
  { icon: ClipboardList, title: "Relatórios organizados", text: "Informações claras para discutir evolução e comportamento.", featured: false },
  { icon: Link, title: "Acompanhamento contínuo", text: "O sistema cria uma ponte entre paciente e clínica durante o tratamento.", featured: false },
];

export default function Benefits() {
  return (
    <section className="py-24 bg-surface">
      <div className="mx-auto max-w-6xl px-6">
        <Reveal>
          <div className="text-center mb-14">
            <h2 className="text-2xl md:text-4xl font-bold text-dark mb-4">
              Mais clareza no acompanhamento, sem aumentar a carga da equipe
            </h2>
          </div>
        </Reveal>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map((item, i) => (
            <Reveal key={i} delay={0.08 + i * 0.08}>
              <div className={`rounded-2xl p-6 border transition-all group hover:-translate-y-1 hover:shadow-lg ${
                item.featured
                  ? "bg-primary/[0.05] border-primary/20"
                  : "bg-white border-border"
              }`}>
                <div className={`w-11 h-11 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform ${
                  item.featured ? "bg-primary/15" : "bg-primary/10"
                }`}>
                  <item.icon size={20} className="text-primary" />
                </div>
                <h3 className="font-bold text-dark mb-2">{item.title}</h3>
                <p className="text-muted text-sm leading-relaxed">{item.text}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
