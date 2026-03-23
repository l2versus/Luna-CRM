"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Calendar } from "lucide-react";
import Image from "next/image";
import { NAV_LINKS, SITE } from "@/lib/constants";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [mobileOpen]);

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-700 ${
          scrolled
            ? "bg-[#0a0a0b]/70 backdrop-blur-2xl border-b border-white/[0.04] shadow-[0_1px_40px_rgba(0,0,0,0.3)]"
            : "bg-transparent"
        }`}
      >
        <div className="mx-auto max-w-[1200px] px-6">
          <div className="flex h-[72px] items-center justify-between">
            <a href="/" className="flex items-center gap-3 group">
              <div className="relative">
                <Image
                  src="/imagens/logos/logo.png"
                  alt="Luna CRM"
                  width={48}
                  height={48}
                  className="h-12 w-12 object-contain logo-glow transition-transform duration-500 group-hover:scale-110"
                  priority
                />
                {/* Ambient glow behind logo */}
                <div className="absolute inset-0 -m-2 rounded-full bg-[var(--color-gold)]/[0.06] blur-xl opacity-70 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
              </div>
              <div className="flex flex-col">
                <span className="font-heading text-2xl font-bold text-gradient-gold tracking-wide leading-none">
                  Luna
                </span>
                <span className="text-[9px] font-semibold tracking-[0.2em] uppercase text-[var(--color-gold)]/50 leading-none mt-0.5">
                  CRM
                </span>
              </div>
            </a>

            <div className="hidden md:flex items-center gap-1">
              {NAV_LINKS.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  className="relative px-4 py-2 text-[13px] font-medium text-[var(--color-text-muted)] transition-colors duration-300 hover:text-[var(--color-text)] rounded-lg hover:bg-white/[0.03]"
                >
                  {link.label}
                </a>
              ))}
            </div>

            <motion.a
              href={SITE.whatsapp}
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="hidden md:inline-flex btn-gold !py-2.5 !px-5 !text-[13px]"
            >
              <Calendar className="h-3.5 w-3.5" />
              Agendar Demo
            </motion.a>

            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="md:hidden relative z-50 p-2 text-[var(--color-text)] rounded-lg hover:bg-white/[0.04] transition-colors"
              aria-label={mobileOpen ? "Fechar menu" : "Abrir menu"}
            >
              {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>
      </nav>

      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="fixed inset-0 z-40 bg-black/70 backdrop-blur-sm md:hidden"
              onClick={() => setMobileOpen(false)}
            />
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
              className="fixed right-0 top-0 bottom-0 z-40 w-[280px] bg-[var(--color-bg-surface)] border-l border-white/[0.04] md:hidden"
            >
              {/* Mobile drawer logo */}
              <div className="flex items-center gap-3 px-5 pt-8">
                <Image
                  src="/imagens/logos/logo.png"
                  alt="Luna CRM"
                  width={40}
                  height={40}
                  className="h-10 w-10 object-contain logo-glow"
                />
                <div className="flex flex-col">
                  <span className="font-heading text-xl font-bold text-gradient-gold leading-none">Luna</span>
                  <span className="text-[9px] font-semibold tracking-[0.2em] uppercase text-[var(--color-gold)]/50 leading-none mt-0.5">CRM</span>
                </div>
              </div>

              <div className="flex flex-col gap-1 px-5 pt-8">
                {NAV_LINKS.map((link, i) => (
                  <motion.a
                    key={link.href}
                    href={link.href}
                    onClick={() => setMobileOpen(false)}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 + i * 0.05 }}
                    className="block rounded-xl px-4 py-3.5 text-[15px] font-medium text-[var(--color-text-muted)] transition-colors hover:bg-white/[0.04] hover:text-[var(--color-text)]"
                  >
                    {link.label}
                  </motion.a>
                ))}
                <motion.a
                  href={SITE.whatsapp}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => setMobileOpen(false)}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.35 }}
                  className="mt-4 btn-gold justify-center !py-3"
                >
                  <Calendar className="h-4 w-4" />
                  Agendar Demo
                </motion.a>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
