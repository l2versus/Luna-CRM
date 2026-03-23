"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { scaleReveal, viewportConfig } from "@/lib/animations";

export default function ProductShowcase() {
  const [mounted, setMounted] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const sectionRef = useRef<HTMLElement>(null);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  // Parallax: video moves slower than scroll
  const videoY = useTransform(scrollYProgress, [0, 1], ["8%", "-8%"]);
  // Glow intensifies as you scroll into view
  const glowOpacity = useTransform(scrollYProgress, [0.2, 0.5], [0, 1]);
  // Slight rotation based on scroll
  const rotateX = useTransform(scrollYProgress, [0.1, 0.5, 0.9], [4, 0, -2]);

  useEffect(() => {
    setMounted(true);
    if (videoRef.current) {
      videoRef.current.muted = true;
    }
  }, []);

  return (
    <section ref={sectionRef} className="relative py-32 px-6 overflow-hidden">
      <div className="mx-auto max-w-[1100px]">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={viewportConfig}
          variants={scaleReveal}
          className="text-center mb-14"
        >
          <h2 className="font-heading text-[28px] md:text-[36px] font-bold text-[var(--color-text)]">
            Pipeline Kanban com física real —{" "}
            <span className="text-gradient-gold">
              a experiência que leads merecem
            </span>
          </h2>
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={viewportConfig}
          variants={scaleReveal}
          className="relative"
          style={{ perspective: "1200px" }}
        >
          {/* Animated glow behind */}
          <motion.div
            style={{ opacity: glowOpacity }}
            className="absolute -inset-16 rounded-3xl bg-[var(--color-gold)]/[0.04] blur-[80px]"
          />

          <motion.div
            style={{ rotateX }}
            className="relative rounded-2xl overflow-hidden border border-white/[0.06] shadow-2xl"
          >
            {/* Top shine line */}
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[var(--color-gold)]/15 to-transparent z-10" />

            {mounted && (
              <motion.div style={{ y: videoY }}>
                <video ref={videoRef} autoPlay loop muted playsInline className="w-full scale-110">
                  <source src="/videos/Crm-full.mp4" type="video/mp4" />
                </video>
              </motion.div>
            )}
            {/* Bottom fade */}
            <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[var(--color-bg-primary)] to-transparent z-10" />
          </motion.div>

          {/* Side accents */}
          <div className="absolute -left-6 top-1/4 h-1/2 w-px bg-gradient-to-b from-transparent via-[var(--color-gold)]/20 to-transparent" />
          <div className="absolute -right-6 top-1/4 h-1/2 w-px bg-gradient-to-b from-transparent via-[var(--color-gold)]/20 to-transparent" />
        </motion.div>
      </div>
    </section>
  );
}
