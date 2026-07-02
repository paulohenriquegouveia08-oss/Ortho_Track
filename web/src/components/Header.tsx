"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";

const navLinks = [
  { label: "Problema", href: "#problema" },
  { label: "Solução", href: "#solucao" },
  { label: "Como funciona", href: "#como-funciona" },
  { label: "Para clínicas", href: "#para-clinicas" },
  { label: "Piloto", href: "#piloto" },
];

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { scrollY } = useScroll();

  const top = useTransform(scrollY, [0, 120], [0, 14]);
  const height = useTransform(scrollY, [0, 120], [72, 62]);
  const paddingLeft = useTransform(scrollY, [0, 120], [24, 20]);
  const paddingRight = useTransform(scrollY, [0, 120], [24, 20]);
  const borderRadius = useTransform(scrollY, [0, 120], [28, 999]);
  const backgroundColor = useTransform(scrollY, [0, 120], ["rgba(255,255,255,0.85)", "rgba(255,255,255,0.72)"]);
  const boxShadow = useTransform(scrollY, [0, 120], [
    "0 1px 3px rgba(0,0,0,0.04)",
    "0 20px 60px rgba(15,23,42,0.14), 0 4px 12px rgba(0,0,0,0.06)",
  ]);
  const borderOpacity = useTransform(scrollY, [0, 120], [0.5, 0.35]);

  return (
    <>
      <div className="h-[72px]" />

      <motion.header
        style={{
          top,
          height,
          paddingLeft,
          paddingRight,
          borderRadius,
          backgroundColor,
          boxShadow,
        }}
        className="fixed left-1/2 w-full max-w-7xl z-50 -translate-x-1/2"
      >
        {/* Border ring for glassmorphism */}
        <motion.div
          style={{ opacity: borderOpacity }}
          className="absolute inset-0 rounded-[inherit] border border-white pointer-events-none"
        />
        <div className="absolute inset-0 rounded-[inherit] ring-1 ring-slate-900/5 pointer-events-none" />

        <div className="mx-auto max-w-7xl flex items-center justify-between h-full px-6">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center shadow-md shadow-primary/20">
              <span className="text-white font-bold text-xs">OT</span>
            </div>
            <span className="font-bold text-base text-dark tracking-tight">OrthoTrack</span>
          </Link>

          <nav className="hidden md:flex items-center gap-6">
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
        </div>

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
