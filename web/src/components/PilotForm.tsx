"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Send, CheckCircle, AlertCircle, Loader2 } from "lucide-react";
import { pilotForm } from "@/content/landing";

type FormState = "idle" | "sending" | "success" | "error";

export default function PilotForm() {
  const [formState, setFormState] = useState<FormState>("idle");
  const [formData, setFormData] = useState({
    nome: "",
    clinica: "",
    whatsapp: "",
    cidade: "",
    qtdPacientes: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  function validate(): boolean {
    const newErrors: Record<string, string> = {};
    if (!formData.nome.trim()) newErrors.nome = "Preencha seu nome";
    if (!formData.clinica.trim()) newErrors.clinica = "Preencha o nome da clínica";
    if (!formData.whatsapp.trim()) newErrors.whatsapp = "Preencha o WhatsApp";
    if (!formData.cidade.trim()) newErrors.cidade = "Preencha a cidade";
    if (!formData.qtdPacientes.trim()) newErrors.qtdPacientes = "Preencha a quantidade";
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
        body: JSON.stringify({
          nome: formData.nome,
          clinica: formData.clinica,
          whatsapp: formData.whatsapp,
          cidade: formData.cidade,
          qtdPacientes: formData.qtdPacientes,
          _subject: "Novo interesse - Piloto OrthoTrack",
        }),
      });
      if (response.ok) {
        setFormState("success");
      } else {
        setFormState("error");
      }
    } catch {
      setFormState("error");
    }
  }

  function handleChange(field: string, value: string) {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: "" }));
  }

  if (formState === "success") {
    return (
      <section id="piloto" className="py-20 bg-surface">
        <div className="mx-auto max-w-lg px-6 text-center">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white rounded-2xl p-10 border border-border shadow-lg"
          >
            <CheckCircle size={48} className="text-success mx-auto mb-4" />
            <h3 className="text-xl font-bold text-dark mb-2">Obrigado!</h3>
            <p className="text-muted">{pilotForm.successMessage}</p>
          </motion.div>
        </div>
      </section>
    );
  }

  return (
    <section id="piloto" className="py-20 bg-surface">
      <div className="mx-auto max-w-xl px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-10"
        >
          <h2 className="text-2xl md:text-3xl font-bold text-dark mb-3">
            {pilotForm.title}
          </h2>
          <p className="text-muted leading-relaxed">
            {pilotForm.description}
          </p>
        </motion.div>

        <motion.form
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
          onSubmit={handleSubmit}
          className="bg-white rounded-2xl p-8 border border-border shadow-lg"
        >
          {formState === "error" && (
            <div className="flex items-center gap-2 bg-danger/10 text-danger text-sm p-3 rounded-lg mb-6">
              <AlertCircle size={16} />
              {pilotForm.errorMessage}
            </div>
          )}

          <div className="space-y-5">
            {pilotForm.fields.map((field) => (
              <div key={field.name}>
                <label className="block text-sm font-medium text-dark mb-1.5">
                  {field.label}
                </label>
                <input
                  type="text"
                  placeholder={field.placeholder}
                  value={formData[field.name as keyof typeof formData]}
                  onChange={(e) => handleChange(field.name, e.target.value)}
                  className={`w-full px-4 py-3 rounded-lg border text-sm text-dark placeholder:text-muted/60 focus:outline-none focus:ring-2 focus:ring-primary/30 transition-colors ${
                    errors[field.name] ? "border-danger" : "border-border"
                  }`}
                />
                {errors[field.name] && (
                  <p className="text-danger text-xs mt-1">{errors[field.name]}</p>
                )}
              </div>
            ))}
          </div>

          <button
            type="submit"
            disabled={formState === "sending"}
            className="mt-6 w-full flex items-center justify-center gap-2 bg-primary text-white font-semibold py-3.5 rounded-lg hover:bg-primary-dark transition-colors disabled:opacity-60 shadow-lg shadow-primary/20"
          >
            {formState === "sending" ? (
              <>
                <Loader2 size={18} className="animate-spin" />
                {pilotForm.submittingText}
              </>
            ) : (
              <>
                <Send size={18} />
                {pilotForm.submitText}
              </>
            )}
          </button>
        </motion.form>
      </div>
    </section>
  );
}
