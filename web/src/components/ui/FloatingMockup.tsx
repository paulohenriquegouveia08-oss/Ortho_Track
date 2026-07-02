"use client";

import Image from "next/image";
import { motion } from "framer-motion";

type FloatingMockupProps = {
  src: string;
  alt: string;
  className?: string;
  priority?: boolean;
};

export function FloatingMockup({
  src,
  alt,
  className = "",
  priority = false,
}: FloatingMockupProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 36, scale: 0.96 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, amount: 0.35 }}
      transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
      className={`relative ${className}`}
    >
      <div className="absolute inset-0 -z-10 scale-110 rounded-full bg-primary/20 blur-[90px]" />
      <motion.div
        animate={{ y: [0, -8, 0] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
      >
        <Image
          src={src}
          alt={alt}
          width={900}
          height={900}
          priority={priority}
          className="h-auto w-full drop-shadow-2xl"
        />
      </motion.div>
    </motion.div>
  );
}
