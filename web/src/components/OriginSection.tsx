"use client";

import { Search, Lightbulb, Users } from "lucide-react";
import Reveal from "./Reveal";

export default function OriginSection() {
  return (
    <section className="py-24 bg-white relative overflow-hidden">
      <div className="absolute bottom-0 right-0 w-[300px] h-[300px] bg-primary/[0.03] rounded-full blur-[100px] translate-x-1/3 translate-y-1/3" />

      <div className="mx-auto max-w-6xl px-6 grid md:grid-cols-2 gap-16 items-center relative z-10">
        <Reveal direction="left">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-dark mb-6">
              Uma ideia nascida de uma dor real da ortodontia
            </h2>

            <p className="text-muted leading-relaxed mb-4">
              O OrthoTrack surgiu a partir da observação de um problema comum em
              tratamentos com alinhadores removíveis: o paciente recebe a orientação
              de usar o aparelho por quase todo o dia, mas a clínica não consegue
              acompanhar esse comportamento de forma contínua.
            </p>

            <p className="text-muted leading-relaxed mb-6">
              A cada consulta, o dentista precisa confiar no relato do paciente.
              Mas esquecimentos, pausas longas e baixa aderência podem acontecer
              durante semanas sem gerar nenhum sinal claro para a clínica.
            </p>

            <div className="bg-primary-light border border-primary/10 rounded-xl p-5 mb-6">
              <p className="text-dark font-medium text-sm leading-relaxed">
                &ldquo;O problema não era falta de tratamento. Era falta de visibilidade entre as consultas.&rdquo;
              </p>
            </div>

            <p className="text-muted leading-relaxed text-sm">
              A proposta do OrthoTrack é simples: transformar a rotina de uso dos
              alinhadores em dados visíveis, organizados e fáceis de acompanhar.
            </p>
          </div>
        </Reveal>

        <div className="space-y-6">
          {[
            { icon: Search, step: "01", title: "Dor identificada", text: "Observação de um problema real: entre consultas, a clínica não tem dados de uso dos alinhadores." },
            { icon: Lightbulb, step: "02", title: "Protótipo do app", text: "Primeira versão para validação com pacientes reais, testando se o registro diário é viável." },
            { icon: Users, step: "03", title: "Validação com clínicas", text: "Teste com clínicas parceiras para validar a utilidade dos dados para o acompanhamento clínico." },
          ].map((item, i) => (
            <Reveal key={i} delay={0.1 + i * 0.12} direction="right">
              <div className="flex gap-5 items-start">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                  <item.icon size={20} className="text-primary" />
                </div>
                <div>
                  <span className="text-xs font-bold text-primary">Passo {item.step}</span>
                  <h3 className="font-semibold text-dark mt-0.5 mb-1">{item.title}</h3>
                  <p className="text-muted text-sm leading-relaxed">{item.text}</p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
