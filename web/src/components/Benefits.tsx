"use client";

import { motion } from "framer-motion";
import { Search, Lightbulb, AlertTriangle, Award, ClipboardList, Link } from "lucide-react";
import { benefits } from "@/content/landing";

const iconMap: Record<string, React.ComponentType<{ size?: number; className?: string }>> = {
  Search,
  Lightbulb,
  AlertTriangle,
  Award,
  ClipboardList,
  Link,
};

export default function Benefits() {
  return (
    <section className="py-20 bg-white">
      <div className="mx-auto max-w-6xl px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h2 className="text-2xl md:text-3xl font-bold text-dark">
            {benefits.title}
          </h2>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {benefits.items.map((item, i) => {
            const Icon = iconMap[item.icon];
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.08 }}
                className="bg-surface rounded-xl p-6 border border-border hover:shadow-md transition-shadow"
              >
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <Icon size={20} className="text-primary" />
                </div>
                <h3 className="font-semibold text-dark mb-2">{item.title}</h3>
                <p className="text-muted text-sm leading-relaxed">{item.text}</p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
