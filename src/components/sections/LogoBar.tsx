"use client";

import { motion } from "framer-motion";
import { fadeUp, viewportConfig } from "@/lib/animations";
import { TECHS } from "@/lib/constants";

export default function LogoBar() {
  return (
    <section className="relative py-14 overflow-hidden">
      {/* Top divider */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[200px] h-px bg-gradient-to-r from-transparent via-[var(--color-gold)]/15 to-transparent" />

      <motion.p
        variants={fadeUp}
        initial="hidden"
        whileInView="visible"
        viewport={viewportConfig}
        className="text-center text-[12px] uppercase tracking-[0.2em] text-[var(--color-text-muted)] mb-10"
      >
        Tecnologias que potencializam o Luna
      </motion.p>

      <div className="relative">
        {/* Edge fades */}
        <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-[var(--color-bg-primary)] to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-[var(--color-bg-primary)] to-transparent z-10 pointer-events-none" />

        <div className="overflow-hidden">
          <div className="animate-marquee flex gap-20 w-max">
            {[...TECHS, ...TECHS].map((tech, i) => (
              <div
                key={`${tech.name}-${i}`}
                className="flex items-center gap-2.5 opacity-30 hover:opacity-60 transition-opacity duration-500 shrink-0"
              >
                <tech.icon className="h-4 w-4 text-[var(--color-text-muted)]" />
                <span className="text-[13px] font-medium text-[var(--color-text-muted)] whitespace-nowrap">
                  {tech.name}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
