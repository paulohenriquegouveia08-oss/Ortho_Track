"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { motion, AnimatePresence, useScroll, useTransform, useMotionValueEvent } from "framer-motion";

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

  useMotionValueEvent(scrollY, "change", (latest) => {
    setScrolled(latest > 80);
  });

  const top = useTransform(scrollY, [0, 100], [0, 16]);
  const height = useTransform(scrollY, [0, 100], [72, 56]);
  const borderRadius = useTransform(scrollY, [0, 100], [20, 999]);
  const backgroundColor = useTransform(scrollY, [0, 100], ["rgba(255,255,255,0.92)", "rgba(255,255,255,0.78)"]);
  const boxShadow = useTransform(scrollY, [0, 100], [
    "0 1px 3px rgba(0,0,0,0.04)",
    "0 12px 40px rgba(15,23,42,0.12), 0 2px 8px rgba(0,0,0,0.05)",
  ]);
  const gap = useTransform(scrollY, [0, 100], [24, 6]);
  const logoScale = useTransform(scrollY, [0, 100], [1, 0.85]);

  return (
    <>
      <div className="h-[72px]" />

      <motion.header
        style={{
          top,
          height,
          borderRadius,
          backgroundColor,
          boxShadow,
          backdropFilter: "blur(22px) saturate(180%)",
          WebkitBackdropFilter: "blur(22px) saturate(180%)",
        }}
        className="fixed z-50 left-1/2 -translate-x-1/2 w-full max-w-7xl border border-white/60"
      >
        <div className="absolute inset-0 rounded-[inherit] ring-1 ring-slate-900/5 pointer-events-none" />

        <motion.div
          style={{ gap }}
          className="mx-auto flex items-center justify-between h-full px-6"
        >
          <motion.div style={{ scale: logoScale }} className="flex items-center gap-2.5 origin-left">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center shadow-md shadow-primary/20">
              <span className="text-white font-bold text-xs">OT</span>
            </div>
            <span className="font-bold text-base text-dark tracking-tight whitespace-nowrap">OrthoTrack</span>
          </motion.div>

          <nav className="hidden md:flex items-center" style={{ gap: scrolled ? 16 : 24 }}>
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="text-sm font-medium text-muted hover:text-primary transition-colors"
              >
                {link.label}
              </a>
            ))}
            <a
              href="#piloto"
              className="bg-primary text-white text-sm font-semibold px-5 py-2 rounded-xl hover:bg-primary-dark transition-all shadow-md shadow-primary/20"
            >
              Quero participar do piloto
            </a>
          </nav>

          <button
            className="md:hidden p-2 rounded-lg hover:bg-dark/5 transition-colors"
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
              className="md:hidden bg-white/90 backdrop-blur-xl border-t border-border/50 overflow-hidden"
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
