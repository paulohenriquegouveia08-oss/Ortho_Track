"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Target, Activity, Shield, Users } from "lucide-react";

export default function Hero() {
  return (
    <section className="relative gradient-hero pt-28 pb-20 md:pt-36 md:pb-28 overflow-hidden">
      {/* Background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/10 rounded-full blur-[120px]" />
      <div className="absolute top-20 right-0 w-[300px] h-[300px] bg-primary/5 rounded-full blur-[100px]" />

      <div className="relative mx-auto max-w-7xl px-6 grid md:grid-cols-2 gap-12 items-center">
        {/* Text side */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="relative z-10"
        >
          <span className="inline-flex items-center gap-2 bg-primary/20 text-primary text-xs font-semibold px-4 py-2 rounded-full mb-6 border border-primary/30">
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
            HealthTech para alinhadores removíveis
          </span>

          <h1 className="text-3xl md:text-5xl lg:text-[3.25rem] font-bold text-white leading-[1.1] mb-6">
            Acompanhe o uso dos alinhadores{" "}
            <span className="text-primary">mesmo entre as consultas</span>
          </h1>

          <p className="text-white/60 text-base md:text-lg leading-relaxed mb-8 max-w-lg">
            O OrthoTrack ajuda clínicas odontológicas a monitorar a aderência dos
            pacientes, registrar horas de uso e identificar riscos antes que o
            tratamento atrase.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 mb-8">
            <a
              href="#piloto"
              className="bg-primary text-white font-semibold px-7 py-4 rounded-xl text-center hover:bg-primary-dark transition-all shadow-lg shadow-primary/30 text-base"
            >
              Quero participar do piloto
            </a>
            <a
              href="#como-funciona"
              className="border border-white/20 text-white font-semibold px-7 py-4 rounded-xl text-center hover:bg-white/10 transition-all text-base"
            >
              Ver como funciona
            </a>
          </div>

          <p className="text-white/40 text-sm">
            Criado para tratamentos com alinhadores removíveis que exigem uso diário de 20 a 22 horas.
          </p>
        </motion.div>

        {/* Mockup side */}
        <motion.div
          initial={{ opacity: 0, y: 30, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="relative flex justify-center z-10"
        >
          {/* Glow behind phone */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] h-[350px] bg-primary/20 rounded-full blur-[80px] glow-teal" />

          <div className="relative w-72 md:w-80">
            <Image
              src="/images/hero-mockup.png"
              alt="Mockup do aplicativo OrthoTrack mostrando tempo de uso do alinhador"
              width={320}
              height={640}
              className="w-full h-auto mockup-shadow rounded-3xl"
              style={{ mixBlendMode: 'multiply' }}
              priority
            />

            {/* Floating cards */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.8 }}
              className="floating-card absolute -left-16 top-16 animate-float hidden md:flex items-center gap-2"
            >
              <div className="w-8 h-8 rounded-lg bg-success/10 flex items-center justify-center">
                <Target size={16} className="text-success" />
              </div>
              <div>
                <p className="text-[10px] text-muted leading-none">Meta diária</p>
                <p className="text-xs font-bold text-dark">22h</p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 1 }}
              className="floating-card absolute -right-12 top-28 animate-float-delayed hidden md:flex items-center gap-2"
            >
              <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                <Activity size={16} className="text-primary" />
              </div>
              <div>
                <p className="text-[10px] text-muted leading-none">Aderência</p>
                <p className="text-xs font-bold text-primary">Acompanhada</p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 1.2 }}
              className="floating-card absolute -left-10 bottom-24 animate-float-slow hidden md:flex items-center gap-2"
            >
              <div className="w-8 h-8 rounded-lg bg-warning/10 flex items-center justify-center">
                <Shield size={16} className="text-warning" />
              </div>
              <div>
                <p className="text-[10px] text-muted leading-none">Pacientes</p>
                <p className="text-xs font-bold text-dark">Em alerta</p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 1.4 }}
              className="floating-card absolute -right-14 bottom-36 animate-float hidden md:flex items-center gap-2"
            >
              <div className="w-8 h-8 rounded-lg bg-success/10 flex items-center justify-center">
                <Users size={16} className="text-success" />
              </div>
              <div>
                <p className="text-[10px] text-muted leading-none">Status</p>
                <p className="text-xs font-bold text-success">Tempo real</p>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
