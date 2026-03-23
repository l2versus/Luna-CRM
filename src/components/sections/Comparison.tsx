"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Check, X } from "lucide-react";
import { blurIn, staggerFast, clipReveal, viewportConfig } from "@/lib/animations";
import { COMPARISON_ROWS } from "@/lib/constants";
import DecorativeLogo from "@/components/ui/DecorativeLogo";

export default function Comparison() {
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  const lineScale = useTransform(scrollYProgress, [0.1, 0.4], [0, 1]);

  return (
    <section ref={sectionRef} className="relative py-32 px-6 overflow-hidden">
      {/* Parallax accent line */}
      <motion.div
        style={{ scaleX: lineScale }}
        className="absolute top-0 left-[10%] right-[10%] h-px bg-gradient-to-r from-transparent via-[var(--color-gold)]/10 to-transparent origin-left"
      />

      {/* Decorative logos */}
      <DecorativeLogo size={120} className="absolute top-16 -right-8" opacity={0.035} spin />
      <DecorativeLogo size={100} className="absolute bottom-20 -left-6" opacity={0.03} float />

      <div className="mx-auto max-w-[900px]">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={viewportConfig}
          variants={blurIn}
          className="mb-16 text-center"
        >
          <span className="section-badge">Diferencial</span>
          <h2
            className="mt-6 font-heading font-bold text-[var(--color-text)]"
            style={{ fontSize: "clamp(2rem, 4vw, 3rem)" }}
          >
            Por Que Clínicas Premium{" "}
            <br className="hidden md:block" />
            <span className="text-gradient-gold">Escolhem o Luna</span>
          </h2>
        </motion.div>

        {/* Table Header */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={viewportConfig}
          variants={clipReveal}
          className="mb-3 hidden md:grid grid-cols-[1fr_1fr_1fr] gap-3 px-6 text-[11px] font-semibold uppercase tracking-[0.15em] text-[var(--color-text-muted)]"
        >
          <span>Recurso</span>
          <span className="text-center">Kommo / Outros</span>
          <span className="text-center text-[var(--color-gold)]">Luna CRM</span>
        </motion.div>

        {/* Rows */}
        <motion.div
          variants={staggerFast}
          initial="hidden"
          whileInView="visible"
          viewport={viewportConfig}
          className="space-y-2"
        >
          {COMPARISON_ROWS.map((row) => (
            <motion.div
              key={row.feature}
              variants={clipReveal}
              whileHover={{ scale: 1.008, x: 4, transition: { duration: 0.25, ease: [0.22, 1, 0.36, 1] } }}
              className="group grid grid-cols-1 md:grid-cols-[1fr_1fr_1fr] gap-0 md:gap-3 items-stretch rounded-xl border border-white/[0.04] bg-[var(--color-bg-surface)]/60 overflow-hidden transition-all duration-300 hover:border-[var(--color-gold)]/10 hover:shadow-[0_4px_24px_rgba(0,0,0,0.2)]"
            >
              {/* Feature name */}
              <div className="px-6 py-4 flex items-center">
                <span className="text-[13px] font-semibold text-[var(--color-text)] transition-colors duration-300 group-hover:text-[var(--color-gold)]">
                  {row.feature}
                </span>
              </div>

              {/* Competitor */}
              <div className="flex items-center gap-2.5 px-6 py-3 md:justify-center border-t md:border-t-0 border-white/[0.03]">
                <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[var(--color-hot)]/10">
                  <X className="h-3 w-3 text-[var(--color-hot)]/60" />
                </div>
                <span className="text-[13px] text-[var(--color-text-muted)]">
                  {row.competitor}
                </span>
              </div>

              {/* Luna */}
              <div className="flex items-center gap-2.5 bg-[var(--color-gold)]/[0.04] px-6 py-3 md:justify-center border-t md:border-t-0 md:border-l border-[var(--color-gold)]/10 md:rounded-r-xl transition-colors duration-300 group-hover:bg-[var(--color-gold)]/[0.08]">
                <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[var(--color-success)]/15">
                  <Check className="h-3 w-3 text-[var(--color-success)]" />
                </div>
                <span className="text-[13px] font-medium text-[var(--color-text)]">
                  {row.luna}
                </span>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
