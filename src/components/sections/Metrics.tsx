"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { motion } from "framer-motion";
import { fadeUp, stagger, viewportConfig } from "@/lib/animations";
import { METRICS } from "@/lib/constants";
import type { Metric } from "@/lib/constants";

function useAnimatedCounter(target: number, duration = 2000, inView: boolean) {
  const [value, setValue] = useState(0);

  useEffect(() => {
    if (!inView) return;
    let start: number | null = null;
    let raf: number;

    const step = (timestamp: number) => {
      if (start === null) start = timestamp;
      const progress = Math.min((timestamp - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setValue(Math.floor(eased * target));
      if (progress < 1) raf = requestAnimationFrame(step);
    };

    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [target, duration, inView]);

  return value;
}

function MetricCard({ metric, inView }: { metric: Metric; inView: boolean }) {
  const counter = useAnimatedCounter(metric.numericValue, 2000, inView);

  return (
    <motion.div
      variants={fadeUp}
      whileHover={{ y: -3, transition: { duration: 0.25 } }}
      className="group relative overflow-hidden rounded-2xl border border-white/[0.04] bg-gradient-to-b from-[var(--color-bg-surface)] to-[var(--color-bg-primary)] p-8 text-center transition-all duration-300 hover:border-[var(--color-gold)]/10 hover:shadow-[0_0_40px_rgba(212,175,55,0.04)]"
    >
      {/* Top shine */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-px bg-gradient-to-r from-transparent via-[var(--color-gold)]/10 to-transparent" />

      {/* Corner glow */}
      <div className="absolute -top-12 -right-12 h-24 w-24 rounded-full bg-[var(--color-gold)]/[0.03] blur-2xl opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

      <div className="font-heading text-[42px] font-bold text-gradient-gold mb-1.5 tracking-tight leading-none">
        {metric.prefix}
        {counter}
        {metric.suffix}
      </div>
      <p className="text-[13px] text-[var(--color-text-muted)] font-medium">
        {metric.description}
      </p>
    </motion.div>
  );
}

export default function Metrics() {
  const ref = useRef<HTMLElement>(null);
  const [inView, setInView] = useState(false);

  const handleIntersection = useCallback(
    (entries: IntersectionObserverEntry[]) => {
      if (entries[0].isIntersecting) setInView(true);
    },
    []
  );

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(handleIntersection, {
      threshold: 0.3,
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, [handleIntersection]);

  return (
    <section ref={ref} className="py-20 px-6 overflow-hidden">
      <motion.div
        variants={stagger}
        initial="hidden"
        whileInView="visible"
        viewport={viewportConfig}
        className="mx-auto max-w-[1100px] grid grid-cols-2 lg:grid-cols-4 gap-4"
      >
        {METRICS.map((metric) => (
          <MetricCard key={metric.description} metric={metric} inView={inView} />
        ))}
      </motion.div>
    </section>
  );
}
