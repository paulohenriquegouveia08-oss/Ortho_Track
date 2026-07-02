"use client";

import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

export default function CTAIntermediate() {
  return (
    <section className="py-20 gradient-contrast">
      <div className="mx-auto max-w-4xl px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-2xl md:text-4xl font-bold text-white mb-4">
            Quer validar o OrthoTrack na sua clínica?
          </h2>
          <p className="text-white/60 mb-8 max-w-xl mx-auto leading-relaxed text-lg">
            Estamos buscando clínicas parceiras para testar uma nova forma de
            acompanhar pacientes com alinhadores removíveis.
          </p>
          <a
            href="#piloto"
            className="inline-flex items-center gap-2 bg-primary text-white font-semibold px-8 py-4 rounded-xl hover:bg-primary-dark transition-all shadow-lg shadow-primary/30 text-base"
          >
            Quero participar do piloto
            <ArrowRight size={18} />
          </a>
        </motion.div>
      </div>
    </section>
  );
}
