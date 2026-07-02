"use client";

import { motion } from "framer-motion";

interface RevealProps {
  children: React.ReactNode;
  delay?: number;
  className?: string;
  direction?: "up" | "left" | "right" | "none";
}

export default function Reveal({ children, delay = 0, className = "", direction = "up" }: RevealProps) {
  const offset = direction === "up" ? 40 : direction === "left" ? -40 : direction === "right" ? 40 : 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: direction === "up" || direction === "none" ? 0 : 0, x: direction === "none" ? 0 : offset }}
      whileInView={{ opacity: 1, y: 0, x: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.6, delay, ease: [0.25, 0.46, 0.45, 0.94] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
