"use client";

import Image from "next/image";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

type FloatingMockupProps = {
  src: string;
  alt: string;
  className?: string;
  priority?: boolean;
  side?: "left" | "right";
};

export function FloatingMockup({
  src,
  alt,
  className = "",
  priority = false,
  side = "right",
}: FloatingMockupProps) {
  const ref = useRef<HTMLDivElement | null>(null);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  // Much more pronounced entrance/exit
  const opacity = useTransform(scrollYProgress, [0, 0.18, 0.82, 1], [0, 1, 1, 0]);
  const y = useTransform(scrollYProgress, [0, 0.25, 0.75, 1], [120, 0, 0, -80]);
  const scale = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0.85, 1.02, 1.02, 0.88]);
  const x = useTransform(
    scrollYProgress,
    [0, 0.25, 0.75, 1],
    side === "right" ? [100, 0, 0, -80] : [-100, 0, 0, 80]
  );
  const rotate = useTransform(
    scrollYProgress,
    [0, 0.25, 0.75, 1],
    side === "right" ? [6, 0, 0, -4] : [-6, 0, 0, 4]
  );

  return (
    <div ref={ref} className={`relative ${className}`}>
      {/* Glow behind phone — fades with scroll */}
      <motion.div
        style={{ opacity, scale }}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90%] h-[90%] bg-primary/20 rounded-full blur-[100px] pointer-events-none"
      />

      {/* Main image — animated by scroll */}
      <motion.div
        style={{ opacity, y, scale, x, rotate }}
        className="relative z-10"
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
    </div>
  );
}
