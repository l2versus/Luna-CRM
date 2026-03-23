"use client";

import { useEffect, useRef, useCallback, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Calendar, Play, ChevronDown } from "lucide-react";
import Image from "next/image";
import { HERO, SITE } from "@/lib/constants";

/* ═══════════════════════════════════════════════════════
   Luna CRM — Hero Section (Cinematic Scroll-Driven)
   - Scroll-controlled parallax on every layer
   - Text fades + scales + blurs as user scrolls down
   - Dashboard lifts off and zooms toward camera
   - Floating particles + video background
   ═══════════════════════════════════════════════════════ */

interface Particle {
  x: number;
  y: number;
  r: number;
  vx: number;
  vy: number;
  opacity: number;
}

/* ── Cinematic entrance variants ──────────────────────── */

function heroEntrance(delay: number) {
  return {
    hidden: { opacity: 0, y: 50, filter: "blur(16px)", scale: 0.92 },
    visible: {
      opacity: 1,
      y: 0,
      filter: "blur(0px)",
      scale: 1,
      transition: {
        duration: 1.2,
        ease: [0.22, 1, 0.36, 1] as const,
        delay,
      },
    },
  };
}

const badgeVariant = {
  hidden: { opacity: 0, scale: 0.6, y: 24, filter: "blur(8px)" },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    filter: "blur(0px)",
    transition: {
      duration: 0.9,
      ease: [0.22, 1, 0.36, 1] as const,
      delay: 0.05,
    },
  },
};

const dashboardVariant = {
  hidden: { opacity: 0, y: 100, scale: 0.8, rotateX: 12 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    rotateX: 2,
    transition: {
      duration: 1.6,
      ease: [0.22, 1, 0.36, 1] as const,
      delay: 0.8,
    },
  },
};

const glowReveal = {
  hidden: { opacity: 0, scale: 0.4 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 2.5, ease: [0.22, 1, 0.36, 1] as const, delay: 0.2 },
  },
};

/* ── Particle canvas ──────────────────────────────────── */

function ParticleCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particles = useRef<Particle[]>([]);
  const raf = useRef<number>(0);
  const dims = useRef({ w: 0, h: 0 });

  const init = useCallback((w: number, h: number) => {
    dims.current = { w, h };
    const count = Math.min(80, Math.floor((w * h) / 12000));
    particles.current = Array.from({ length: count }, () => ({
      x: Math.random() * w,
      y: Math.random() * h,
      r: Math.random() * 1.8 + 0.4,
      vx: (Math.random() - 0.5) * 0.15,
      vy: -(Math.random() * 0.3 + 0.08),
      opacity: Math.random() * 0.35 + 0.05,
    }));
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      const dpr = window.devicePixelRatio || 1;
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      ctx.scale(dpr, dpr);
      init(rect.width, rect.height);
    };

    resize();
    window.addEventListener("resize", resize);

    const draw = () => {
      const { w, h } = dims.current;
      ctx.clearRect(0, 0, w, h);
      for (const p of particles.current) {
        p.x += p.vx;
        p.y += p.vy;
        if (p.y < -10) { p.y = h + 10; p.x = Math.random() * w; }
        if (p.x < -10) p.x = w + 10;
        if (p.x > w + 10) p.x = -10;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(212,175,55,${p.opacity})`;
        ctx.fill();
      }
      raf.current = requestAnimationFrame(draw);
    };

    raf.current = requestAnimationFrame(draw);
    return () => {
      cancelAnimationFrame(raf.current);
      window.removeEventListener("resize", resize);
    };
  }, [init]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 h-full w-full pointer-events-none z-[1]"
      aria-hidden="true"
    />
  );
}

/* ── Scroll indicator ─────────────────────────────────── */

function ScrollIndicator() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 2, duration: 1 }}
      className="absolute bottom-8 left-1/2 -translate-x-1/2 z-[5] flex flex-col items-center gap-2"
    >
      <span className="text-[10px] uppercase tracking-[0.3em] text-[var(--color-text-muted)] font-body">
        Role para explorar
      </span>
      <motion.div
        animate={{ y: [0, 6, 0] }}
        transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
      >
        <ChevronDown className="w-4 h-4 text-[var(--color-gold)]/50" />
      </motion.div>
    </motion.div>
  );
}

/* ═════════════════════════════════════════════════════════
   HERO COMPONENT
   ═════════════════════════════════════════════════════════ */

export default function Hero() {
  const [mounted, setMounted] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const sectionRef = useRef<HTMLElement>(null);

  // Scroll-driven transforms (hero spans ~120vh for scroll room)
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });

  // Text content: fades, scales down, blurs as user scrolls
  const textY = useTransform(scrollYProgress, [0, 0.5], [0, -120]);
  const textOpacity = useTransform(scrollYProgress, [0, 0.35], [1, 0]);
  const textScale = useTransform(scrollYProgress, [0, 0.5], [1, 0.9]);
  const textBlur = useTransform(scrollYProgress, [0, 0.4], [0, 12]);

  // Dashboard: zooms toward camera + lifts up as you scroll
  const dashY = useTransform(scrollYProgress, [0, 0.6], [0, -200]);
  const dashScale = useTransform(scrollYProgress, [0, 0.6], [1, 1.15]);
  const dashRotateX = useTransform(scrollYProgress, [0, 0.4], [2, 0]);
  const dashOpacity = useTransform(scrollYProgress, [0.5, 0.7], [1, 0]);

  // Background layers: parallax at different speeds
  const bgVideoY = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
  const glowY = useTransform(scrollYProgress, [0, 1], ["0%", "15%"]);
  const particleOpacity = useTransform(scrollYProgress, [0, 0.6], [1, 0.2]);

  // Logo decorations parallax
  const logoY1 = useTransform(scrollYProgress, [0, 1], [0, -80]);
  const logoY2 = useTransform(scrollYProgress, [0, 1], [0, -50]);

  useEffect(() => {
    setMounted(true);
    if (videoRef.current) {
      videoRef.current.muted = true;
    }
  }, []);

  return (
    <section
      ref={sectionRef}
      id="hero"
      className="relative min-h-[120vh] overflow-hidden"
    >
      {/* ═══ LAYER 1 — Background video with parallax ═══ */}
      {mounted && (
        <motion.div style={{ y: bgVideoY }} className="absolute inset-0 z-0">
          <video
            ref={videoRef}
            autoPlay
            loop
            playsInline
            muted
            className="absolute inset-0 w-full h-full object-cover opacity-[0.10] pointer-events-none blur-[2px] scale-110"
          >
            <source src={HERO.backgroundVideo} type="video/mp4" />
          </video>
        </motion.div>
      )}

      {/* ═══ LAYER 2 — Particles with scroll fade ═══ */}
      <motion.div style={{ opacity: particleOpacity }} className="absolute inset-0 z-[1]">
        <ParticleCanvas />
      </motion.div>

      {/* ═══ LAYER 3 — Radial gradients (parallax) ═══ */}
      <motion.div
        variants={glowReveal}
        initial="hidden"
        animate="visible"
        style={{ y: glowY }}
        className="absolute inset-0 pointer-events-none z-[2]"
      >
        {/* Main gold glow — top center */}
        <div
          className="absolute top-[-10%] left-1/2 -translate-x-1/2 w-[1200px] h-[800px]"
          style={{
            background:
              "radial-gradient(ellipse 50% 60% at 50% 30%, rgba(212,175,55,0.10) 0%, transparent 70%)",
          }}
        />
        {/* Secondary cool accent — right */}
        <div
          className="absolute top-[30%] right-[-10%] w-[600px] h-[600px]"
          style={{
            background:
              "radial-gradient(ellipse 50% 50% at 50% 50%, rgba(74,123,255,0.03) 0%, transparent 70%)",
          }}
        />
      </motion.div>

      {/* ═══ LAYER 4 — Edge fades ═══ */}
      <div className="absolute inset-0 pointer-events-none z-[2] bg-gradient-to-b from-[#0a0a0b]/60 via-transparent to-[#0a0a0b]" />

      {/* ═══ LAYER 5 — Decorative logos (parallax) ═══ */}
      <motion.div
        initial={{ opacity: 0, scale: 0.3, rotate: -30 }}
        animate={{ opacity: 0.04, scale: 1, rotate: 0 }}
        transition={{ duration: 2, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
        style={{ y: logoY1 }}
        className="absolute top-[12%] left-[8%] pointer-events-none z-[2] hidden lg:block"
      >
        <Image
          src="/imagens/logos/logo.png"
          alt=""
          width={160}
          height={160}
          className="logo-spin-slow"
          style={{ filter: "drop-shadow(0 0 40px rgba(212,175,55,0.2))" }}
        />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, scale: 0.3, rotate: 30 }}
        animate={{ opacity: 0.03, scale: 1, rotate: 0 }}
        transition={{ duration: 2, delay: 0.8, ease: [0.22, 1, 0.36, 1] }}
        style={{ y: logoY2 }}
        className="absolute bottom-[20%] right-[6%] pointer-events-none z-[2] hidden lg:block"
      >
        <Image
          src="/imagens/logos/logo.png"
          alt=""
          width={100}
          height={100}
          className="logo-float"
          style={{ filter: "drop-shadow(0 0 30px rgba(212,175,55,0.15))" }}
        />
      </motion.div>

      {/* ═══ LAYER 6 — CONTENT (scroll-driven fade/scale/blur) ═══ */}
      <div className="relative z-[3] mx-auto w-full max-w-[1100px] px-6 pt-32 pb-16 lg:pt-40 lg:pb-24">
        <motion.div
          style={{
            y: textY,
            opacity: textOpacity,
            scale: textScale,
            filter: useTransform(textBlur, (v) => `blur(${v}px)`),
          }}
          className="text-center"
        >
          {/* Badge */}
          <motion.div
            variants={badgeVariant}
            initial="hidden"
            animate="visible"
            className="mb-8 inline-flex items-center gap-2.5 rounded-full border border-[var(--color-gold)]/20 bg-[var(--color-gold)]/[0.04] px-5 py-2 backdrop-blur-sm"
          >
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[var(--color-gold)] opacity-40" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-[var(--color-gold)]" />
            </span>
            <span className="text-[var(--color-gold)] text-[11px] font-semibold uppercase tracking-[0.15em]">
              {HERO.badge}
            </span>
          </motion.div>

          {/* Headline */}
          <motion.h1
            variants={heroEntrance(0.15)}
            initial="hidden"
            animate="visible"
            className="font-heading font-bold leading-[1.05] text-[var(--color-text)] mx-auto max-w-[900px]"
            style={{ fontSize: "clamp(2.5rem, 5.5vw, 4.5rem)" }}
          >
            {HERO.headline}{" "}
            <span className="text-gradient-gold">{HERO.headlineHighlight}</span>
          </motion.h1>

          {/* Sub-headline */}
          <motion.p
            variants={heroEntrance(0.35)}
            initial="hidden"
            animate="visible"
            className="mx-auto mt-6 max-w-[560px] text-[16px] md:text-[17px] leading-[1.75] text-[var(--color-text-muted)]"
          >
            {HERO.subheadline}
          </motion.p>

          {/* CTAs */}
          <motion.div
            variants={heroEntrance(0.55)}
            initial="hidden"
            animate="visible"
            className="mt-10 flex flex-wrap items-center justify-center gap-4"
          >
            <motion.a
              href={SITE.whatsapp}
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.97 }}
              className="btn-gold !px-8 !py-[14px]"
            >
              <Calendar className="h-4 w-4" />
              {HERO.cta1}
            </motion.a>

            <motion.a
              href="#funcionalidades"
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.97 }}
              className="btn-outline-gold !px-8 !py-[14px]"
            >
              <Play className="h-4 w-4" />
              {HERO.cta2}
            </motion.a>
          </motion.div>
        </motion.div>

        {/* ═══ DASHBOARD SCREENSHOT (scroll-driven zoom + lift) ═══ */}
        <motion.div
          variants={dashboardVariant}
          initial="hidden"
          animate="visible"
          style={{
            y: dashY,
            scale: dashScale,
            rotateX: dashRotateX,
            opacity: dashOpacity,
            perspective: 1200,
          }}
          className="relative mt-16 lg:mt-20 mx-auto max-w-[1000px]"
        >
          {/* Glow */}
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 2, delay: 0.8 }}
            className="absolute -inset-8 rounded-3xl bg-[var(--color-gold)]/[0.06] blur-[80px]"
          />

          <div className="relative rounded-2xl border border-white/[0.08] overflow-hidden glow-gold">
            {/* Top chrome bar */}
            <div className="relative bg-[#0c0c0e] px-4 py-2.5 flex items-center gap-2 border-b border-white/[0.04]">
              <div className="flex gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-[#ff5f57]" />
                <div className="w-2.5 h-2.5 rounded-full bg-[#febd2e]" />
                <div className="w-2.5 h-2.5 rounded-full bg-[#27c840]" />
              </div>
              <div className="flex-1 flex justify-center">
                <div className="bg-white/[0.06] rounded-md px-12 py-1 text-[10px] text-[var(--color-text-muted)]">
                  app.lunacrm.com.br
                </div>
              </div>
            </div>

            <Image
              src={HERO.dashboardImage}
              alt="Luna CRM — Dashboard principal"
              width={1440}
              height={900}
              priority
              className="w-full h-auto"
            />

            {/* Reflective shine overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-white/[0.02] via-transparent to-transparent pointer-events-none" />

            {/* Bottom fade */}
            <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#0a0a0b] to-transparent" />
          </div>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <ScrollIndicator />
    </section>
  );
}
