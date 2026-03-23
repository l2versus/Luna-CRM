"use client";

import { motion } from "framer-motion";
import { Star } from "lucide-react";
import { fadeUp, viewportConfig } from "@/lib/animations";
import { TESTIMONIALS } from "@/lib/constants";
import type { Testimonial } from "@/lib/constants";

const row1 = TESTIMONIALS.slice(0, 3);
const row2 = TESTIMONIALS.slice(3, 6);

function TestimonialCard({ t }: { t: Testimonial }) {
  return (
    <div className="min-w-[300px] max-w-[360px] shrink-0 rounded-2xl border border-white/[0.04] bg-gradient-to-b from-[var(--color-bg-surface)] to-[var(--color-bg-primary)] p-6">
      {/* Stars */}
      <div className="mb-4 flex gap-0.5">
        {Array.from({ length: 5 }).map((_, i) => (
          <Star
            key={i}
            className="h-3.5 w-3.5 fill-[var(--color-gold)] text-[var(--color-gold)]"
          />
        ))}
      </div>

      {/* Quote */}
      <blockquote className="mb-5 text-[13px] leading-[1.7] text-[var(--color-text-secondary)] italic">
        &ldquo;{t.text}&rdquo;
      </blockquote>

      {/* Divider */}
      <div className="mb-4 h-px bg-white/[0.04]" />

      {/* Author */}
      <div className="flex items-center gap-3">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[var(--color-gold)]/[0.08] text-[11px] font-bold text-[var(--color-gold)] border border-[var(--color-gold)]/10">
          {t.initials}
        </div>
        <div>
          <p className="text-[13px] font-semibold text-[var(--color-text)]">
            {t.name}
          </p>
          <p className="text-[11px] text-[var(--color-text-muted)]">{t.role}</p>
        </div>
      </div>
    </div>
  );
}

function MarqueeRow({
  items,
  reverse = false,
}: {
  items: Testimonial[];
  reverse?: boolean;
}) {
  const animClass = reverse ? "animate-marquee-reverse" : "animate-marquee";

  return (
    <div className="group relative overflow-hidden">
      <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-32 bg-gradient-to-r from-[var(--color-bg-primary)] to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-32 bg-gradient-to-l from-[var(--color-bg-primary)] to-transparent" />

      <div
        className={`flex gap-4 ${animClass} group-hover:[animation-play-state:paused]`}
      >
        {[...items, ...items, ...items, ...items].map((t, i) => (
          <TestimonialCard key={`${t.initials}-${i}`} t={t} />
        ))}
      </div>
    </div>
  );
}

export default function Testimonials() {
  return (
    <section id="depoimentos" className="py-28 overflow-hidden">
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={viewportConfig}
        variants={fadeUp}
        className="mb-16 px-6 text-center"
      >
        <span className="inline-block rounded-full border border-[var(--color-gold)]/20 bg-[var(--color-gold)]/[0.04] px-4 py-1.5 text-[11px] font-semibold tracking-[0.15em] text-[var(--color-gold)] uppercase">
          Depoimentos
        </span>
        <h2 className="mt-6 font-heading font-bold text-[var(--color-text)]" style={{ fontSize: "clamp(2rem, 4vw, 3rem)" }}>
          O Que Donos de Clínicas Dizem
        </h2>
      </motion.div>

      <div className="space-y-4">
        <MarqueeRow items={row1} />
        <MarqueeRow items={row2} reverse />
      </div>
    </section>
  );
}
