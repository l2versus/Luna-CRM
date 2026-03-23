"use client";

import { motion } from "framer-motion";
import { fadeUp, scaleIn, stagger, viewportConfig } from "@/lib/animations";
import { INTEGRATIONS } from "@/lib/constants";

export default function Integrations() {
  return (
    <section id="integracoes" className="py-32 px-6 overflow-hidden">
      <div className="mx-auto max-w-[1000px]">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={viewportConfig}
          variants={fadeUp}
          className="mb-16 text-center"
        >
          <span className="section-badge">Integrações</span>
          <h2
            className="mt-6 font-heading font-bold text-[var(--color-text)]"
            style={{ fontSize: "clamp(2rem, 4vw, 3rem)" }}
          >
            Conectado Com Tudo Que{" "}
            <br className="hidden md:block" />
            <span className="text-gradient-gold">Você Já Usa</span>
          </h2>
        </motion.div>

        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="visible"
          viewport={viewportConfig}
          className="grid grid-cols-2 gap-4 md:grid-cols-4"
        >
          {INTEGRATIONS.map((int) => (
            <motion.div
              key={int.name}
              variants={scaleIn}
              whileHover={{ y: -4, transition: { duration: 0.25 } }}
              className="group relative flex flex-col items-center gap-3 overflow-hidden rounded-2xl border border-white/[0.04] bg-gradient-to-b from-[var(--color-bg-surface)] to-[var(--color-bg-primary)] p-6 text-center transition-all duration-300 hover:border-[var(--color-gold)]/15 hover:shadow-[0_0_40px_rgba(212,175,55,0.04)]"
            >
              {/* Top shine */}
              <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/[0.06] to-transparent" />

              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[var(--color-gold)]/[0.07] border border-[var(--color-gold)]/10 text-[var(--color-gold)] transition-all duration-300 group-hover:bg-[var(--color-gold)]/[0.14] group-hover:shadow-[0_0_20px_rgba(212,175,55,0.1)]">
                <int.icon className="h-5 w-5" />
              </div>
              <p className="text-[13px] font-semibold text-[var(--color-text)]">
                {int.name}
              </p>
              <p className="text-[11px] text-[var(--color-text-muted)]">
                {int.desc}
              </p>
            </motion.div>
          ))}
        </motion.div>

        <motion.p
          initial="hidden"
          whileInView="visible"
          viewport={viewportConfig}
          variants={fadeUp}
          className="mt-10 text-center text-[13px] text-[var(--color-text-muted)]"
        >
          E mais via{" "}
          <span className="font-medium text-[var(--color-text)]">Webhooks</span>{" "}
          e{" "}
          <span className="font-medium text-[var(--color-text)]">API aberta</span>
        </motion.p>
      </div>
    </section>
  );
}
