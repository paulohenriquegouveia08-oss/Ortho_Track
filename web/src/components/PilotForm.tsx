"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Send, CheckCircle, AlertCircle, Loader2, ArrowRight } from "lucide-react";
import Reveal from "./Reveal";

type FormState = "idle" | "sending" | "success" | "error";

const fields = [
  { name: "nome", label: "Seu nome", placeholder: "Nome completo", required: true },
  { name: "clinica", label: "Nome da clínica", placeholder: "Nome da clínica", required: true },
  { name: "whatsapp", label: "WhatsApp", placeholder: "(00) 00000-0000", required: true },
  { name: "cidade", label: "Cidade", placeholder: "Cidade e estado", required: true },
  { name: "qtdPacientes", label: "Quantidade de pacientes com alinhadores", placeholder: "Ex: 20", required: true },
];

export default function PilotForm() {
  const [formState, setFormState] = useState<FormState>("idle");
  const [formData, setFormData] = useState<Record<string, string>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});

  function validate(): boolean {
    const newErrors: Record<string, string> = {};
    for (const field of fields) {
      if (field.required && !formData[field.name]?.trim()) {
        newErrors[field.name] = `Preencha ${field.label.toLowerCase()}`;
      }
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;
    setFormState("sending");
    try {
      const response = await fetch("https://formspree.io/f/xldnopkn", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formData, _subject: "Novo interesse - Piloto OrthoTrack" }),
      });
      setFormState(response.ok ? "success" : "error");
    } catch {
      setFormState("error");
    }
  }

  function handleChange(field: string, value: string) {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: "" }));
  }

  return (
    <section id="piloto" className="py-24 gradient-contrast relative overflow-hidden scroll-mt-32">
      <div className="absolute top-0 left-0 w-[400px] h-[300px] bg-primary/[0.06] rounded-full blur-[120px] -translate-x-1/3 -translate-y-1/3 pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-[300px] h-[300px] bg-primary/[0.04] rounded-full blur-[100px] translate-x-1/3 translate-y-1/3 pointer-events-none" />

      <div className="mx-auto max-w-6xl px-6 grid md:grid-cols-2 gap-16 items-center relative z-10">
        <Reveal direction="left">
          <div>
            <h2 className="text-2xl md:text-4xl font-bold text-white mb-4">
              Faça parte das primeiras clínicas a testar o OrthoTrack
            </h2>
            <p className="text-white/50 leading-relaxed mb-6">
              Estamos selecionando clínicas parceiras para validar o acompanhamento
              digital de pacientes com alinhadores removíveis.
            </p>
            <div className="space-y-4 mb-8">
              {["Acesso antecipado à plataforma", "Suporte direto durante o piloto", "Relatórios personalizados para sua clínica", "Sem custo durante a fase de validação"].map((item, i) => (
                <div key={i} className="flex items-center gap-3">
                  <CheckCircle size={18} className="text-primary shrink-0" />
                  <span className="text-sm text-white/80">{item}</span>
                </div>
              ))}
            </div>
          </div>
        </Reveal>

        <Reveal direction="right" delay={0.1}>
          {formState === "success" ? (
            <div className="bg-white rounded-3xl p-10 border border-border shadow-2xl text-center">
              <CheckCircle size={48} className="text-success mx-auto mb-4" />
              <h3 className="text-xl font-bold text-dark mb-2">Obrigado!</h3>
              <p className="text-muted">Recebemos seu interesse e entraremos em contato para apresentar o OrthoTrack.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="bg-white rounded-3xl p-8 border border-white/10 shadow-2xl">
              <h3 className="font-bold text-dark text-lg mb-6">Preencha seus dados</h3>
              {formState === "error" && (
                <div className="flex items-center gap-2 bg-danger/10 text-danger text-sm p-3 rounded-xl mb-5">
                  <AlertCircle size={16} />
                  Não foi possível enviar agora. Verifique os dados e tente novamente.
                </div>
              )}
              <div className="space-y-4">
                {fields.map((field) => (
                  <div key={field.name}>
                    <label className="block text-sm font-medium text-dark mb-1.5">{field.label}</label>
                    <input
                      type="text"
                      placeholder={field.placeholder}
                      value={formData[field.name] || ""}
                      onChange={(e) => handleChange(field.name, e.target.value)}
                      className={`w-full px-4 py-3 rounded-xl border text-sm text-dark placeholder:text-muted/50 focus:outline-none focus:ring-2 focus:ring-primary/30 transition-colors ${errors[field.name] ? "border-danger" : "border-border"}`}
                    />
                    {errors[field.name] && <p className="text-danger text-xs mt-1">{errors[field.name]}</p>}
                  </div>
                ))}
              </div>
              <button
                type="submit"
                disabled={formState === "sending"}
                className="mt-6 w-full flex items-center justify-center gap-2 bg-primary text-white font-semibold py-3.5 rounded-xl hover:bg-primary-dark transition-all disabled:opacity-60 shadow-lg shadow-primary/25"
              >
                {formState === "sending" ? <><Loader2 size={18} className="animate-spin" /> Enviando...</> : <>Quero participar do piloto <ArrowRight size={18} /></>}
              </button>
            </form>
          )}
        </Reveal>
      </div>
    </section>
  );
}
