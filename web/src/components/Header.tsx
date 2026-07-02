"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

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

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 90);
    handleScroll();
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      {/* Spacer to prevent content jumping behind fixed header */}
      <div className="h-16" />

      <header
        className={`fixed z-50 transition-all duration-500 ease-out ${
          scrolled
            ? "top-3 left-1/2 w-[calc(100%-1.5rem)] max-w-5xl -translate-x-1/2 rounded-full border border-white/60 bg-white/90 shadow-xl backdrop-blur-xl"
            : "top-0 left-0 w-full bg-white/80 backdrop-blur-lg border-b border-border/50"
        }`}
      >
        <div className="mx-auto max-w-7xl flex items-center justify-between h-14 px-6">
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
            className="md:hidden p-2 rounded-lg hover:bg-surface transition-colors"
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
              className="md:hidden bg-white border-t border-border overflow-hidden"
            >
              <div className="px-6 py-4 flex flex-col gap-1">
                {navLinks.map((link) => (
                  <a
                    key={link.href}
                    href={link.href}
                    onClick={() => setMobileOpen(false)}
                    className="text-sm font-medium text-muted hover:text-primary hover:bg-surface py-3 px-3 rounded-lg transition-colors"
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
      </header>
    </>
  );
}
