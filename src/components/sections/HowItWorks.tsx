"use client";

import { motion } from "framer-motion";
import { blurIn, stagger, scaleIn, drawLine, viewportConfig } from "@/lib/animations";
import { STEPS } from "@/lib/constants";
import DecorativeLogo from "@/components/ui/DecorativeLogo";

export default function HowItWorks() {
  return (
    <section id="como-funciona" className="py-32 px-6 overflow-hidden relative">
      {/* Decorative logo */}
      <DecorativeLogo size={110} className="absolute top-12 -right-8" opacity={0.03} float />
      <div className="mx-auto max-w-[1000px]">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={viewportConfig}
          variants={blurIn}
          className="mb-16 text-center"
        >
          <span className="section-badge">Processo</span>
          <h2
            className="mt-6 font-heading font-bold text-[var(--color-text)]"
            style={{ fontSize: "clamp(2rem, 4vw, 3rem)" }}
          >
            Comece Em 3 Passos{" "}
            <span className="text-gradient-gold">Simples</span>
          </h2>
        </motion.div>

        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="visible"
          viewport={viewportConfig}
          className="relative grid grid-cols-1 gap-10 md:grid-cols-3 md:gap-8"
        >
          {/* Animated connector line */}
          <motion.div
            variants={drawLine}
            className="pointer-events-none absolute top-[72px] left-[20%] right-[20%] hidden md:block origin-left"
          >
            <div className="h-px w-full bg-gradient-to-r from-[var(--color-gold)]/30 via-[var(--color-gold)]/15 to-[var(--color-gold)]/30" />
          </motion.div>

          {STEPS.map((step, i) => {
            const Icon = step.icon;
            return (
              <motion.div
                key={step.number}
                variants={scaleIn}
                whileHover={{ y: -6, transition: { duration: 0.35, ease: [0.22, 1, 0.36, 1] } }}
                className="relative text-center group"
              >
                {/* Watermark number */}
                <motion.span
                  initial={{ opacity: 0, scale: 0.5 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8, delay: 0.2 + i * 0.15, ease: [0.22, 1, 0.36, 1] }}
                  className="pointer-events-none absolute -top-3 left-1/2 -translate-x-1/2 select-none font-heading text-[72px] font-bold text-[var(--color-gold)]/[0.06]"
                >
                  {step.number}
                </motion.span>

                {/* Icon */}
                <div className="relative mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-[var(--color-gold)]/[0.06] border border-[var(--color-gold)]/10 transition-all duration-500 group-hover:bg-[var(--color-gold)]/[0.12] group-hover:border-[var(--color-gold)]/20 group-hover:shadow-[0_0_32px_rgba(212,175,55,0.12)] group-hover:scale-110">
                  <Icon className="h-7 w-7 text-[var(--color-gold)]" />
                </div>

                <h3 className="mt-6 font-heading text-[22px] font-bold text-[var(--color-text)]">
                  {step.title}
                </h3>
                <p className="mt-3 text-[13px] leading-[1.7] text-[var(--color-text-muted)] max-w-[260px] mx-auto">
                  {step.description}
                </p>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
