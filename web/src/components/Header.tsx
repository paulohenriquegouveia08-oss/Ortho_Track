"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { motion, AnimatePresence, useScroll, useTransform, useSpring, useMotionValueEvent } from "framer-motion";

const navLinks = [
  { label: "Problema", href: "#problema" },
  { label: "Solução", href: "#solucao" },
  { label: "Como funciona", href: "#como-funciona" },
  { label: "Para clínicas", href: "#para-clinicas" },
  { label: "Piloto", href: "#piloto" },
];

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { scrollY } = useScroll();

  // Smooth progress (0→1) based on scroll
  const rawProgress = useTransform(scrollY, [0, 160], [0, 1]);
  const progress = useSpring(rawProgress, {
    stiffness: 120,
    damping: 24,
    mass: 0.4,
  });

  useMotionValueEvent(progress, "change", (v) => {
    setScrolled(v > 0.5);
  });

  // Outer header transforms
  const headerWidth = useTransform(progress, [0, 1], ["100%", "min(1180px, calc(100% - 32px))"]);
  const headerTop = useTransform(progress, [0, 1], [0, 16]);
  const headerHeight = useTransform(progress, [0, 1], [84, 68]);
  const headerRadius = useTransform(progress, [0, 1], [0, 999]);
  const headerBg = useTransform(progress, [0, 1], ["rgba(255,255,255,0.92)", "rgba(255,255,255,0.68)"]);
  const headerShadow = useTransform(progress, [0, 1], [
    "0 0 0 rgba(15,23,42,0)",
    "0 24px 70px rgba(15,23,42,0.14)",
  ]);

  // Inner layout transforms
  const innerPaddingX = useTransform(progress, [0, 1], [32, 18]);
  const innerGap = useTransform(progress, [0, 1], [36, 20]);
  const navGap = useTransform(progress, [0, 1], [32, 18]);
  const logoScale = useTransform(progress, [0, 1], [1, 0.9]);
  const ctaScale = useTransform(progress, [0, 1], [1, 0.9]);
  const fontSize = useTransform(progress, [0, 1], [14, 12]);

  return (
    <>
      <div className="h-[84px]" />

      <motion.header
        style={{
          width: headerWidth,
          top: headerTop,
          height: headerHeight,
          borderRadius: headerRadius,
          backgroundColor: headerBg,
          boxShadow: headerShadow,
          backdropFilter: "blur(22px) saturate(160%)",
          WebkitBackdropFilter: "blur(22px) saturate(160%)",
        }}
        className="fixed left-1/2 z-50 -translate-x-1/2 border border-white/50 ring-1 ring-slate-900/5"
      >
        <motion.div
          style={{ paddingLeft: innerPaddingX, paddingRight: innerPaddingX, gap: innerGap }}
          className="mx-auto flex h-full items-center justify-center"
        >
          {/* Logo + Nome */}
          <motion.div
            style={{ scale: logoScale }}
            className="flex items-center gap-3 origin-left shrink-0"
          >
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center shadow-md shadow-primary/20">
              <span className="text-white font-bold text-xs">OT</span>
            </div>
            <span className="font-bold text-base text-dark tracking-tight whitespace-nowrap">
              OrthoTrack
            </span>
          </motion.div>

          {/* Nav links */}
          <motion.nav
            style={{ gap: navGap }}
            className="hidden items-center lg:flex"
          >
            {navLinks.map((link) => (
              <motion.a
                key={link.href}
                href={link.href}
                style={{ fontSize }}
                className="text-muted hover:text-primary transition-colors whitespace-nowrap font-medium"
              >
                {link.label}
              </motion.a>
            ))}
          </motion.nav>

          {/* CTA — always same element, just scaled */}
          <motion.a
            href="#piloto"
            style={{ scale: ctaScale }}
            className="hidden lg:inline-flex items-center bg-primary text-white font-semibold px-5 py-2 rounded-xl shadow-md shadow-primary/20 whitespace-nowrap hover:bg-primary-dark transition-colors origin-center shrink-0"
          >
            Quero participar do piloto
          </motion.a>

          {/* Mobile menu button */}
          <button
            className="lg:hidden p-2 rounded-lg hover:bg-dark/5 transition-colors ml-auto"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Menu"
          >
            {mobileOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </motion.div>

        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="lg:hidden bg-white/90 backdrop-blur-xl border-t border-border/50 overflow-hidden"
            >
              <div className="px-6 py-4 flex flex-col gap-1">
                {navLinks.map((link) => (
                  <a
                    key={link.href}
                    href={link.href}
                    onClick={() => setMobileOpen(false)}
                    className="text-sm font-medium text-muted hover:text-primary hover:bg-primary/5 py-3 px-3 rounded-lg transition-colors"
                  >
                    {link.label}
                  </a>
                ))}
                <a
                  href="#piloto"
                  onClick={() => setMobileOpen(false)}
                  className="bg-primary text-white text-sm font-semibold px-5 py-3 rounded-xl text-center mt-2 shadow-md shadow-primary/20"
                >
                  Quero participar do piloto
                </a>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.header>
    </>
  );
}
