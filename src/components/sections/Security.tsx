"use client";

import { motion } from "framer-motion";
import { blurIn, stagger, rotateIn, viewportConfig } from "@/lib/animations";
import { SECURITY_CARDS } from "@/lib/constants";
import DecorativeLogo from "@/components/ui/DecorativeLogo";

export default function Security() {
  return (
    <section id="seguranca" className="relative py-32 px-6 overflow-hidden">
      {/* Subtle green ambient glow */}
      <div className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[var(--color-success)]/[0.015] rounded-full blur-[120px]" />

      {/* Decorative logo */}
      <DecorativeLogo size={130} className="absolute bottom-16 -right-10" opacity={0.03} spin />

      <div className="relative mx-auto max-w-[1000px]">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={viewportConfig}
          variants={blurIn}
          className="mb-16 text-center"
        >
          <span className="section-badge">Segurança</span>
          <h2
            className="mt-6 font-heading font-bold text-[var(--color-text)]"
            style={{ fontSize: "clamp(2rem, 4vw, 3rem)" }}
          >
            Proteção de Nível Militar{" "}
            <br className="hidden md:block" />
            <span className="text-gradient-gold">Para Dados Sensíveis</span>
          </h2>
        </motion.div>

        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="visible"
          viewport={viewportConfig}
          className="grid grid-cols-1 gap-4 sm:grid-cols-2"
          style={{ perspective: "800px" }}
        >
          {SECURITY_CARDS.map((card) => (
            <motion.div
              key={card.title}
              variants={rotateIn}
              whileHover={{ y: -5, rotateX: -2, transition: { duration: 0.35, ease: [0.22, 1, 0.36, 1] } }}
              className="group relative overflow-hidden rounded-2xl border border-white/[0.04] bg-gradient-to-b from-[var(--color-bg-surface)] to-[var(--color-bg-primary)] p-7 transition-all duration-500 hover:border-[var(--color-success)]/15 hover:shadow-[0_8px_40px_rgba(46,204,138,0.06)]"
            >
              {/* Top shine line */}
              <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/[0.06] to-transparent" />

              {/* Corner glow */}
              <div className="absolute -top-16 -right-16 h-32 w-32 rounded-full bg-[var(--color-success)]/[0.03] blur-3xl opacity-0 transition-opacity duration-700 group-hover:opacity-100" />

              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-[var(--color-success)]/[0.07] border border-[var(--color-success)]/10 text-[var(--color-success)] transition-all duration-500 group-hover:bg-[var(--color-success)]/[0.14] group-hover:shadow-[0_0_24px_rgba(46,204,138,0.12)] group-hover:scale-110">
                <card.icon className="h-5 w-5" />
              </div>
              <h3 className="mb-2 text-[16px] font-semibold text-[var(--color-text)]">
                {card.title}
              </h3>
              <p className="text-[13px] leading-[1.7] text-[var(--color-text-muted)]">
                {card.desc}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
