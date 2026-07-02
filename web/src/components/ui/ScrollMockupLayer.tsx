"use client";

import Image from "next/image";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

type ScrollMockupLayerProps = {
  src: string;
  alt: string;
  side?: "left" | "right";
  className?: string;
  imageClassName?: string;
  opacity?: number;
};

export function ScrollMockupLayer({
  src,
  alt,
  side = "right",
  className = "",
  imageClassName = "",
  opacity = 0.08,
}: ScrollMockupLayerProps) {
  const ref = useRef<HTMLDivElement | null>(null);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const animatedOpacity = useTransform(
    scrollYProgress,
    [0, 0.22, 0.72, 1],
    [0, opacity, opacity, 0]
  );

  const x = useTransform(
    scrollYProgress,
    [0, 0.5, 1],
    side === "right" ? [120, 0, -80] : [-120, 0, 80]
  );

  const scale = useTransform(
    scrollYProgress,
    [0, 0.5, 1],
    [0.94, 1.06, 0.96]
  );

  const rotate = useTransform(
    scrollYProgress,
    [0, 0.5, 1],
    side === "right" ? [4, 0, -3] : [-4, 0, 3]
  );

  return (
    <div
      ref={ref}
      className={`pointer-events-none absolute inset-0 z-0 overflow-hidden ${className}`}
      aria-hidden="true"
    >
      <motion.div
        style={{ opacity: animatedOpacity, x, scale, rotate }}
        className={`absolute top-1/2 hidden -translate-y-1/2 lg:block ${
          side === "right" ? "-right-24" : "-left-24"
        }`}
      >
        <Image
          src={src}
          alt={alt}
          width={900}
          height={900}
          className={`w-[560px] select-none blur-[2px] drop-shadow-2xl ${imageClassName}`}
        />
      </motion.div>
    </div>
  );
}
