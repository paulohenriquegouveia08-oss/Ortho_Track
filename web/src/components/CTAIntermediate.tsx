"use client";

import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import Reveal from "./Reveal";

export default function CTAIntermediate() {
  return (
    <section className="py-20 gradient-contrast relative overflow-hidden">
      <div className="absolute top-0 left-0 w-[300px] h-[200px] bg-primary/[0.08] rounded-full blur-[100px] -translate-x-1/3 pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-[250px] h-[250px] bg-primary/[0.06] rounded-full blur-[80px] translate-x-1/3 pointer-events-none" />

      <div className="mx-auto max-w-4xl px-6 text-center relative z-10">
        <Reveal>
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">
            Quer validar o OrthoTrack na sua clínica?
          </h2>
          <p className="text-white/50 mb-8 max-w-xl mx-auto leading-relaxed text-lg">
            Estamos buscando clínicas parceiras para testar uma nova forma de
            acompanhar pacientes com alinhadores removíveis.
          </p>
          <motion.a
            href="#piloto"
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            className="inline-flex items-center gap-2 bg-primary text-white font-semibold px-8 py-4 rounded-xl transition-all shadow-lg shadow-primary/30 text-base"
          >
            Quero participar do piloto
            <ArrowRight size={18} />
          </motion.a>
        </Reveal>
      </div>
    </section>
  );
}
