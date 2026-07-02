"use client";

import { motion } from "framer-motion";
import { ShieldCheck } from "lucide-react";
import { clinicalTrust } from "@/content/landing";

export default function ClinicalTrustSection() {
  return (
    <section className="py-16 bg-white">
      <div className="mx-auto max-w-3xl px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="bg-surface border border-border rounded-2xl p-8 text-center"
        >
          <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-5">
            <ShieldCheck size={24} className="text-primary" />
          </div>
          <h2 className="text-xl md:text-2xl font-bold text-dark mb-3">
            {clinicalTrust.title}
          </h2>
          <p className="text-muted leading-relaxed max-w-xl mx-auto">
            {clinicalTrust.text}
          </p>
        </motion.div>
      </div>
    </section>
  );
}
