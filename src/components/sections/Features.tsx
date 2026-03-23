"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import Image from "next/image";
import { blurIn, staggerSlow, viewportConfig, slideLeft, slideRight } from "@/lib/animations";
import { FEATURES } from "@/lib/constants";
import type { Feature } from "@/lib/constants";
import DecorativeLogo from "@/components/ui/DecorativeLogo";

function FeatureCard({ feature, span2, index }: { feature: Feature; span2: boolean; index: number }) {
  const Icon = feature.icon;
  const isEven = index % 2 === 0;

  return (
    <motion.div
      variants={isEven ? slideLeft : slideRight}
      whileHover={{ y: -6, transition: { duration: 0.35, ease: [0.22, 1, 0.36, 1] } }}
      className={`
        group relative overflow-hidden rounded-2xl
        border border-white/[0.04] bg-gradient-to-b from-[var(--color-bg-surface)] to-[var(--color-bg-primary)]
        p-7 transition-all duration-500
        hover:border-[var(--color-gold)]/15
        hover:shadow-[0_8px_60px_rgba(212,175,55,0.06),0_2px_20px_rgba(0,0,0,0.3)]
        ${span2 ? "md:col-span-2" : ""}
      `}
    >
      {/* Top shine line */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/[0.06] to-transparent" />

      {/* Corner glow on hover */}
      <div className="absolute -top-20 -right-20 h-40 w-40 rounded-full bg-[var(--color-gold)]/[0.03] blur-3xl opacity-0 transition-opacity duration-700 group-hover:opacity-100" />

      {/* Icon */}
      <div className="relative flex h-12 w-12 items-center justify-center rounded-xl bg-[var(--color-gold)]/[0.07] border border-[var(--color-gold)]/10 transition-all duration-500 group-hover:bg-[var(--color-gold)]/[0.14] group-hover:shadow-[0_0_28px_rgba(212,175,55,0.15)] group-hover:scale-110">
        <Icon className="h-5 w-5 text-[var(--color-gold)]" />
      </div>

      {/* Text */}
      <h3 className="mt-5 font-heading text-[20px] font-bold text-[var(--color-text)]">
        {feature.title}
      </h3>
      <p className="mt-2 text-[13px] leading-relaxed text-[var(--color-text-muted)] line-clamp-3">
        {feature.description}
      </p>

      {/* Screenshot */}
      <div className={`relative mt-5 overflow-hidden rounded-xl border border-white/[0.04] ${span2 ? "" : "max-h-44"}`}>
        <Image
          src={feature.image}
          alt={feature.title}
          width={800}
          height={450}
          className="w-full object-cover opacity-50 transition-all duration-700 group-hover:opacity-85 group-hover:scale-[1.05]"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[var(--color-bg-primary)] via-[var(--color-bg-primary)]/40 to-transparent" />
      </div>
    </motion.div>
  );
}

export default function Features() {
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  const bgY = useTransform(scrollYProgress, [0, 1], ["-5%", "5%"]);

  return (
    <section ref={sectionRef} id="funcionalidades" className="relative py-32 px-6 overflow-hidden">
      {/* Parallax background glow */}
      <motion.div
        style={{ y: bgY }}
        className="pointer-events-none absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] rounded-full bg-[var(--color-gold)]/[0.015] blur-[120px]"
      />

      {/* Decorative logos */}
      <DecorativeLogo size={140} className="absolute top-20 -left-10" opacity={0.04} spin />
      <DecorativeLogo size={90} className="absolute bottom-32 -right-6" opacity={0.035} float />

      <div className="relative mx-auto max-w-[1100px]">
        {/* Section Header */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={viewportConfig}
          variants={blurIn}
          className="mb-16 text-center"
        >
          <span className="section-badge">Funcionalidades</span>
          <h2
            className="mt-6 font-heading font-bold text-[var(--color-text)]"
            style={{ fontSize: "clamp(2rem, 4vw, 3rem)" }}
          >
            Tudo Que Sua Clínica Precisa,{" "}
            <br className="hidden md:block" />
            <span className="text-gradient-gold">Em Um Só Lugar</span>
          </h2>
        </motion.div>

        {/* Bento Grid */}
        <motion.div
          variants={staggerSlow}
          initial="hidden"
          whileInView="visible"
          viewport={viewportConfig}
          className="grid grid-cols-1 gap-4 md:grid-cols-3"
        >
          <FeatureCard feature={FEATURES[0]} span2 index={0} />
          <FeatureCard feature={FEATURES[1]} span2={false} index={1} />
          <FeatureCard feature={FEATURES[2]} span2={false} index={2} />
          <FeatureCard feature={FEATURES[3]} span2 index={3} />
          <FeatureCard feature={FEATURES[4]} span2={false} index={4} />
          <FeatureCard feature={FEATURES[5]} span2 index={5} />
        </motion.div>
      </div>
    </section>
  );
}
