"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Check, X } from "lucide-react";
import { fadeUp, stagger, viewportConfig } from "@/lib/animations";
import { PLANS, SITE } from "@/lib/constants";

function formatBRL(value: number): string {
  return value.toLocaleString("pt-BR");
}

export default function Pricing() {
  const [isAnnual, setIsAnnual] = useState(false);

  return (
    <section id="precos" className="py-32 px-6 overflow-hidden">
      <div className="mx-auto max-w-[1100px]">
        {/* Header */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={viewportConfig}
          variants={fadeUp}
          className="mb-12 text-center"
        >
          <span className="section-badge">Preços</span>
          <h2
            className="mt-6 font-heading font-bold text-[var(--color-text)]"
            style={{ fontSize: "clamp(2rem, 4vw, 3rem)" }}
          >
            Planos Para Cada Fase{" "}
            <br className="hidden md:block" />
            <span className="text-gradient-gold">da Sua Clínica</span>
          </h2>
        </motion.div>

        {/* Toggle */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={viewportConfig}
          variants={fadeUp}
          className="mb-14 flex items-center justify-center gap-4"
        >
          <span
            className={`text-[13px] font-medium transition-colors ${
              !isAnnual ? "text-[var(--color-text)]" : "text-[var(--color-text-muted)]"
            }`}
          >
            Mensal
          </span>

          <button
            onClick={() => setIsAnnual(!isAnnual)}
            className={`relative h-7 w-12 rounded-full transition-all duration-300 ${
              isAnnual
                ? "bg-[var(--color-gold)] shadow-[0_0_16px_rgba(212,175,55,0.3)]"
                : "bg-[var(--color-border)]"
            }`}
            aria-label="Alternar entre plano mensal e anual"
          >
            <div
              className={`absolute top-[3px] h-[22px] w-[22px] rounded-full bg-white shadow-sm transition-transform duration-300 ${
                isAnnual ? "translate-x-[23px]" : "translate-x-[3px]"
              }`}
            />
          </button>

          <span
            className={`text-[13px] font-medium transition-colors ${
              isAnnual ? "text-[var(--color-text)]" : "text-[var(--color-text-muted)]"
            }`}
          >
            Anual
          </span>

          {isAnnual && (
            <motion.span
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="rounded-full bg-[var(--color-success)]/10 px-2.5 py-1 text-[11px] font-bold text-[var(--color-success)]"
            >
              -20%
            </motion.span>
          )}
        </motion.div>

        {/* Cards Grid */}
        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="visible"
          viewport={viewportConfig}
          className="grid gap-5 md:grid-cols-3 items-stretch"
        >
          {PLANS.map((plan) => {
            const price = isAnnual ? plan.annual : plan.monthly;
            const isPopular = plan.popular;
            const isExec = plan.executive;

            return (
              <motion.div
                key={plan.name}
                variants={fadeUp}
                whileHover={{ y: -6, transition: { duration: 0.3 } }}
                className={`
                  relative flex flex-col rounded-2xl p-8 transition-all duration-500 overflow-hidden
                  ${isPopular
                    ? "card-popular bg-gradient-to-b from-[var(--color-bg-surface)] to-[var(--color-bg-primary)] md:-translate-y-4"
                    : isExec
                      ? "border border-white/[0.06] bg-gradient-to-b from-[var(--color-bg-surface-2)] to-[var(--color-bg-primary)]"
                      : "border border-white/[0.04] bg-[var(--color-bg-surface)]/60"
                  }
                `}
              >
                {/* Popular badge */}
                {isPopular && (
                  <div className="absolute -top-0.5 left-1/2 -translate-x-1/2 z-10">
                    <span className="inline-block rounded-b-xl bg-gradient-to-b from-[var(--color-gold)] to-[#b8962e] px-5 py-1.5 text-[10px] font-bold uppercase tracking-[0.15em] text-[#0a0a0b] shadow-[0_4px_16px_rgba(212,175,55,0.3)]">
                      Mais Popular
                    </span>
                  </div>
                )}

                {/* Plan name */}
                <div className={isPopular ? "pt-6" : "pt-1"}>
                  <h3 className="font-heading text-[22px] font-bold text-[var(--color-text)]">
                    {plan.name}
                  </h3>
                  <p className="mt-1 text-[12px] text-[var(--color-text-muted)]">
                    {plan.subtitle}
                  </p>
                </div>

                {/* Price */}
                <div className="mt-6 mb-8">
                  <span
                    className={`text-[40px] font-bold tracking-tight leading-none ${
                      isPopular ? "text-gradient-gold" : "text-[var(--color-text)]"
                    }`}
                  >
                    R$ {formatBRL(price)}
                  </span>
                  <span className="text-[13px] text-[var(--color-text-muted)]">/mês</span>
                  {isAnnual && (
                    <p className="mt-1 text-[11px] text-[var(--color-text-muted)] line-through">
                      R$ {formatBRL(plan.monthly)}/mês
                    </p>
                  )}
                </div>

                {/* Divider */}
                <div className="mb-6 h-px bg-gradient-to-r from-transparent via-white/[0.06] to-transparent" />

                {/* Features */}
                <ul className="flex-1 space-y-3 mb-8">
                  {plan.features.map((feat) => (
                    <li key={feat} className="flex items-start gap-2.5">
                      <div className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-[var(--color-gold)]/10">
                        <Check className="h-2.5 w-2.5 text-[var(--color-gold)]" />
                      </div>
                      <span className="text-[13px] text-[var(--color-text-muted)] leading-[1.5]">
                        {feat}
                      </span>
                    </li>
                  ))}
                  {plan.excluded?.map((feat) => (
                    <li key={feat} className="flex items-start gap-2.5 opacity-35">
                      <div className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-white/5">
                        <X className="h-2.5 w-2.5 text-[var(--color-text-muted)]" />
                      </div>
                      <span className="text-[13px] text-[var(--color-text-muted)] leading-[1.5]">
                        {feat}
                      </span>
                    </li>
                  ))}
                </ul>

                {/* CTA */}
                <a
                  href={SITE.whatsapp}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`
                    block w-full text-center rounded-full py-3.5 text-[13px] font-semibold
                    transition-all duration-300
                    ${isPopular
                      ? "btn-gold"
                      : isExec
                        ? "border border-white/10 text-[var(--color-text)] hover:border-white/20 hover:bg-white/[0.04] hover:shadow-[0_0_20px_rgba(255,255,255,0.04)]"
                        : "btn-outline-gold"
                    }
                  `}
                >
                  {plan.cta}
                </a>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
