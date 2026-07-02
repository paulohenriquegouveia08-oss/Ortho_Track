"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Target, Activity, Shield, Users } from "lucide-react";
import Reveal from "./Reveal";

export default function Hero() {
  return (
    <section className="relative gradient-hero pt-28 pb-20 md:pt-36 md:pb-32 overflow-hidden">
      {/* Subtle teal radial glow behind mockup area */}
      <div className="absolute top-1/2 left-[55%] -translate-y-1/2 w-[500px] h-[500px] bg-primary/[0.08] rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute top-[20%] right-[5%] w-[300px] h-[300px] bg-primary/[0.05] rounded-full blur-[100px] pointer-events-none" />

      {/* Subtle dots */}
      <div className="absolute top-[15%] left-[5%] w-2 h-2 rounded-full bg-primary/20 animate-pulse-soft" />
      <div className="absolute top-[25%] right-[8%] w-1.5 h-1.5 rounded-full bg-primary/15 animate-pulse-soft" style={{ animationDelay: '1s' }} />
      <div className="absolute bottom-[20%] left-[15%] w-1 h-1 rounded-full bg-dark/5 animate-pulse-soft" style={{ animationDelay: '2s' }} />

      <div className="relative mx-auto max-w-7xl px-6 grid md:grid-cols-[42%_58%] gap-8 items-center">
        {/* Text side */}
        <div className="relative z-10">
          <Reveal delay={0.1}>
            <span className="inline-flex items-center gap-2 bg-primary/10 text-primary text-xs font-semibold px-4 py-2 rounded-full mb-6 border border-primary/20">
              <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
              HealthTech para alinhadores removíveis
            </span>
          </Reveal>

          <Reveal delay={0.2}>
            <h1 className="text-3xl md:text-4xl lg:text-[3rem] font-bold text-dark leading-[1.1] mb-6">
              Acompanhe o uso dos alinhadores{" "}
              <span className="text-primary">
                mesmo entre as consultas
              </span>
            </h1>
          </Reveal>

          <Reveal delay={0.3}>
            <p className="text-muted text-base md:text-lg leading-relaxed mb-8 max-w-lg">
              O OrthoTrack ajuda clínicas odontológicas a monitorar a aderência dos
              pacientes, registrar horas de uso e identificar riscos antes que o
              tratamento atrase.
            </p>
          </Reveal>

          <Reveal delay={0.4}>
            <div className="flex flex-col sm:flex-row gap-3 mb-8">
              <motion.a
                href="#piloto"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="bg-primary text-white font-semibold px-8 py-4 rounded-xl text-center hover:bg-primary-dark transition-all shadow-lg shadow-primary/25 text-base"
              >
                Quero participar do piloto
              </motion.a>
              <motion.a
                href="#como-funciona"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="border border-border text-dark font-semibold px-8 py-4 rounded-xl text-center hover:bg-dark/5 transition-all text-base"
              >
                Ver como funciona
              </motion.a>
            </div>
          </Reveal>

          <Reveal delay={0.5}>
            <div className="flex items-center gap-6 text-muted text-xs">
              <span className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-success" />
                Usado por clínicas
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                Meta de 22h
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-warning" />
                Risco visível
              </span>
            </div>
          </Reveal>
        </div>

        {/* Mockup side — larger */}
        <motion.div
          initial={{ opacity: 0, x: 40, scale: 0.95 }}
          animate={{ opacity: 1, x: 0, scale: 1 }}
          transition={{ duration: 0.9, delay: 0.2, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="relative flex justify-center z-10"
        >
          <div className="relative">
            {/* Glow behind phone */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[380px] h-[380px] md:w-[450px] md:h-[450px] bg-primary/10 rounded-full blur-[80px]" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[220px] h-[220px] bg-primary/15 rounded-full blur-[40px]" />

            {/* Phone mockup */}
            <div className="relative w-56 md:w-72 lg:w-80">
              <Image
                src="/images/hero-mockup.png"
                alt="Mockup do aplicativo OrthoTrack mostrando tempo de uso do alinhador"
                width={360}
                height={720}
                className="w-full h-auto relative z-10"
                style={{ filter: "drop-shadow(0 30px 60px rgba(0,0,0,0.2)) drop-shadow(0 10px 20px rgba(0,155,143,0.15))" }}
                priority
              />
            </div>

            {/* Floating cards */}
            <Reveal delay={0.8} direction="left" className="floating-card absolute -left-6 md:-left-20 top-10 md:top-16 animate-float z-20">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-success/10 flex items-center justify-center">
                  <Target size={15} className="text-success" />
                </div>
                <div>
                  <p className="text-[9px] text-muted leading-none uppercase tracking-wider">Meta diária</p>
                  <p className="text-xs font-bold text-dark">22h</p>
                </div>
              </div>
            </Reveal>

            <Reveal delay={0.9} direction="right" className="floating-card absolute -right-4 md:-right-16 top-20 md:top-28 animate-float-delayed z-20">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Activity size={15} className="text-primary" />
                </div>
                <div>
                  <p className="text-[9px] text-muted leading-none uppercase tracking-wider">Aderência</p>
                  <p className="text-xs font-bold text-primary">Acompanhada</p>
                </div>
              </div>
            </Reveal>

            <Reveal delay={1.0} direction="left" className="floating-card absolute -left-4 md:-left-14 bottom-16 md:bottom-24 animate-float-slow z-20">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-warning/10 flex items-center justify-center">
                  <Shield size={15} className="text-warning" />
                </div>
                <div>
                  <p className="text-[9px] text-muted leading-none uppercase tracking-wider">Pacientes</p>
                  <p className="text-xs font-bold text-warning">Em alerta</p>
                </div>
              </div>
            </Reveal>

            <Reveal delay={1.1} direction="right" className="floating-card absolute -right-6 md:-right-16 bottom-28 md:bottom-36 animate-float z-20">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-success/10 flex items-center justify-center">
                  <Users size={15} className="text-success" />
                </div>
                <div>
                  <p className="text-[9px] text-muted leading-none uppercase tracking-wider">Status</p>
                  <p className="text-xs font-bold text-success">Tempo real</p>
                </div>
              </div>
            </Reveal>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
