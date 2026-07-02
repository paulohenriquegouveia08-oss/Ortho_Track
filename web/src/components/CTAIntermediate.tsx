"use client";

import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { ctaIntermediate } from "@/content/landing";

export default function CTAIntermediate() {
  return (
    <section className="py-16 bg-surface">
      <div className="mx-auto max-w-3xl px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-2xl md:text-3xl font-bold text-dark mb-4">
            {ctaIntermediate.title}
          </h2>
          <p className="text-muted mb-8 max-w-xl mx-auto leading-relaxed">
            {ctaIntermediate.description}
          </p>
          <a
            href="#piloto"
            className="inline-flex items-center gap-2 bg-primary text-white font-semibold px-7 py-3.5 rounded-lg hover:bg-primary-dark transition-colors shadow-lg shadow-primary/20"
          >
            {ctaIntermediate.cta}
            <ArrowRight size={18} />
          </a>
        </motion.div>
      </div>
    </section>
  );
}
