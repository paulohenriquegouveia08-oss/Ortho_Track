"use client";

import { motion } from "framer-motion";
import { origin } from "@/content/landing";

export default function OriginSection() {
  return (
    <section className="py-20 bg-surface">
      <div className="mx-auto max-w-4xl px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h2 className="text-2xl md:text-3xl font-bold text-dark mb-4">
            {origin.title}
          </h2>
        </motion.div>

        <div className="space-y-5 mb-16">
          {origin.paragraphs.map((p, i) => (
            <motion.p
              key={i}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.1 }}
              className="text-muted leading-relaxed text-base"
            >
              {p}
            </motion.p>
          ))}
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {origin.steps.map((step, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.15 }}
              className="relative bg-white rounded-xl p-6 border border-border text-center"
            >
              <div className="w-10 h-10 rounded-full bg-primary text-white font-bold text-sm flex items-center justify-center mx-auto mb-3">
                {i + 1}
              </div>
              <h3 className="font-semibold text-dark mb-1">{step.label}</h3>
              <p className="text-muted text-sm">{step.description}</p>
              {i < origin.steps.length - 1 && (
                <div className="hidden md:block absolute top-10 -right-3 w-6 h-0.5 bg-border" />
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
