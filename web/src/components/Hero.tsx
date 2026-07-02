"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { hero } from "@/content/landing";

export default function Hero() {
  return (
    <section className="pt-28 pb-16 md:pt-36 md:pb-24 bg-surface">
      <div className="mx-auto max-w-6xl px-6 grid md:grid-cols-2 gap-12 items-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <span className="inline-block bg-primary/10 text-primary text-xs font-semibold px-3 py-1.5 rounded-full mb-4">
            {hero.badge}
          </span>
          <h1 className="text-3xl md:text-5xl font-bold text-dark leading-tight mb-5">
            {hero.title}
          </h1>
          <p className="text-muted text-base md:text-lg leading-relaxed mb-6">
            {hero.subtitle}
          </p>
          <p className="text-muted text-sm mb-8">{hero.context}</p>
          <div className="flex flex-col sm:flex-row gap-3">
            <a
              href="#piloto"
              className="bg-primary text-white font-semibold px-6 py-3.5 rounded-lg text-center hover:bg-primary-dark transition-colors shadow-lg shadow-primary/20"
            >
              {hero.ctaPrimary}
            </a>
            <a
              href="#como-funciona"
              className="border border-border text-dark font-semibold px-6 py-3.5 rounded-lg text-center hover:bg-white transition-colors"
            >
              {hero.ctaSecondary}
            </a>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="relative flex justify-center"
        >
          <div className="relative w-72 h-[520px] md:w-80 md:h-[580px]">
            <div className="absolute inset-0 bg-primary/5 rounded-[3rem] -rotate-3" />
            <Image
              src="/images/hero-mockup.png"
              alt="App OrthoTrack - cronômetro de uso do alinhador"
              fill
              className="object-contain drop-shadow-2xl relative z-10"
              priority
            />
          </div>
        </motion.div>
      </div>
    </section>
  );
}
