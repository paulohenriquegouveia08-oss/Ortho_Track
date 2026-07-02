"use client";

import { motion } from "framer-motion";
import { feedbackColors } from "@/content/landing";

const colorMap: Record<string, { bg: string; border: string; text: string; dot: string }> = {
  success: { bg: "bg-success/5", border: "border-success/20", text: "text-success", dot: "bg-success" },
  warning: { bg: "bg-warning/5", border: "border-warning/20", text: "text-warning", dot: "bg-warning" },
  danger: { bg: "bg-danger/5", border: "border-danger/20", text: "text-danger", dot: "bg-danger" },
};

export default function FeedbackColors() {
  return (
    <section className="py-20 bg-white">
      <div className="mx-auto max-w-4xl px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h2 className="text-2xl md:text-3xl font-bold text-dark">
            {feedbackColors.title}
          </h2>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6">
          {feedbackColors.items.map((item, i) => {
            const colors = colorMap[item.color];
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.1 }}
                className={`${colors.bg} border ${colors.border} rounded-xl p-6 text-center`}
              >
                <div className={`w-3 h-3 rounded-full ${colors.dot} mx-auto mb-3`} />
                <h3 className={`font-bold text-lg ${colors.text} mb-1`}>{item.label}</h3>
                <p className="text-dark text-sm font-semibold mb-2">{item.range}</p>
                <p className="text-muted text-sm leading-relaxed">{item.text}</p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
