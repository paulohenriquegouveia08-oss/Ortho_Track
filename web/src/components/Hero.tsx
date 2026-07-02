"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Target, Activity, Shield, Users } from "lucide-react";

export default function Hero() {
  return (
    <section className="relative gradient-hero pt-28 pb-20 md:pt-36 md:pb-28 overflow-hidden noise-overlay">
      {/* Abstract shapes */}
      <div className="abstract-shape w-[500px] h-[500px] bg-primary top-[-100px] left-[-100px] blur-[100px]" />
      <div className="abstract-shape w-[400px] h-[400px] bg-primary bottom-[-50px] right-[-80px] blur-[120px]" />
      <div className="abstract-shape w-[200px] h-[200px] bg-primary top-[40%] right-[10%] blur-[80px]" />
      <div className="absolute top-0 left-0 w-full h-full">
        <div className="absolute top-[15%] left-[5%] w-2 h-2 rounded-full bg-primary/20 animate-pulse-soft" />
        <div className="absolute top-[25%] right-[8%] w-1.5 h-1.5 rounded-full bg-primary/15 animate-pulse-soft" style={{ animationDelay: '1s' }} />
        <div className="absolute bottom-[20%] left-[15%] w-1 h-1 rounded-full bg-white/10 animate-pulse-soft" style={{ animationDelay: '2s' }} />
      </div>

      <div className="relative mx-auto max-w-7xl px-6 grid md:grid-cols-2 gap-12 items-center">
        {/* Text side */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="relative z-10"
        >
          <motion.span
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="inline-flex items-center gap-2 bg-primary/20 text-primary text-xs font-semibold px-4 py-2 rounded-full mb-6 border border-primary/30"
          >
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
            HealthTech para alinhadores removíveis
          </motion.span>

          <h1 className="text-3xl md:text-5xl lg:text-[3.25rem] font-bold text-white leading-[1.1] mb-6">
            Acompanhe o uso dos alinhadores{" "}
            <span className="bg-gradient-to-r from-primary to-emerald-400 bg-clip-text text-transparent">
              mesmo entre as consultas
            </span>
          </h1>

          <p className="text-white/55 text-base md:text-lg leading-relaxed mb-8 max-w-lg">
            O OrthoTrack ajuda clínicas odontológicas a monitorar a aderência dos
            pacientes, registrar horas de uso e identificar riscos antes que o
            tratamento atrase.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 mb-8">
            <motion.a
              href="#piloto"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="bg-primary text-white font-semibold px-8 py-4 rounded-xl text-center hover:bg-primary-dark transition-all shadow-lg shadow-primary/30 text-base"
            >
              Quero participar do piloto
            </motion.a>
            <motion.a
              href="#como-funciona"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="border border-white/20 text-white/80 font-semibold px-8 py-4 rounded-xl text-center hover:bg-white/10 hover:text-white transition-all text-base"
            >
              Ver como funciona
            </motion.a>
          </div>

          <div className="flex items-center gap-6 text-white/35 text-xs">
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
        </motion.div>

        {/* Mockup side */}
        <motion.div
          initial={{ opacity: 0, y: 30, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="relative flex justify-center z-10"
        >
          <div className="relative mockup-phone">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] bg-primary/15 rounded-full blur-[60px]" />

            <div className="relative w-64 md:w-72 lg:w-80">
              <Image
                src="/images/hero-mockup.png"
                alt="Mockup do aplicativo OrthoTrack mostrando tempo de uso do alinhador"
                width={320}
                height={640}
                className="w-full h-auto mockup-shadow rounded-3xl relative z-10"
                priority
              />
            </div>

            {/* Floating cards */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.9 }}
              className="floating-card absolute -left-8 md:-left-16 top-12 md:top-16 animate-float z-20"
            >
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-success/10 flex items-center justify-center">
                  <Target size={15} className="text-success" />
                </div>
                <div>
                  <p className="text-[9px] text-muted leading-none uppercase tracking-wider">Meta diária</p>
                  <p className="text-xs font-bold text-dark">22h</p>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 1.1 }}
              className="floating-card absolute -right-6 md:-right-12 top-24 md:top-28 animate-float-delayed z-20"
            >
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Activity size={15} className="text-primary" />
                </div>
                <div>
                  <p className="text-[9px] text-muted leading-none uppercase tracking-wider">Aderência</p>
                  <p className="text-xs font-bold text-primary">Acompanhada</p>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 1.3 }}
              className="floating-card absolute -left-6 md:-left-10 bottom-20 md:bottom-24 animate-float-slow z-20"
            >
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-warning/10 flex items-center justify-center">
                  <Shield size={15} className="text-warning" />
                </div>
                <div>
                  <p className="text-[9px] text-muted leading-none uppercase tracking-wider">Pacientes</p>
                  <p className="text-xs font-bold text-warning">Em alerta</p>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 1.5 }}
              className="floating-card absolute -right-8 md:-right-14 bottom-32 md:bottom-36 animate-float z-20"
            >
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-success/10 flex items-center justify-center">
                  <Users size={15} className="text-success" />
                </div>
                <div>
                  <p className="text-[9px] text-muted leading-none uppercase tracking-wider">Status</p>
                  <p className="text-xs font-bold text-success">Tempo real</p>
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
