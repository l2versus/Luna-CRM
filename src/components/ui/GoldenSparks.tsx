"use client";

import { useEffect, useRef, useCallback } from "react";

/* ── Types ─────────────────────────────────────────────── */

interface Spark {
  x: number;
  y: number;
  r: number;
  vx: number;
  vy: number;
  opacity: number;
  maxOpacity: number;
  life: number;
  maxLife: number;
  /** 0 = round dot, 1 = streak/line */
  type: number;
  /** streak length */
  len: number;
}

/* ── Config ─────────────────────────────────────────────── */

const GOLD_R = 212;
const GOLD_G = 175;
const GOLD_B = 55;
const PARTICLE_DENSITY = 0.000035; // particles per px²
const MAX_PARTICLES = 120;
const MIN_PARTICLES = 30;

/**
 * Full-page ambient golden sparks/particles.
 * Renders a fixed canvas behind all content with falling gold
 * dust, firefly-like glows, and occasional streak sparks.
 */
export default function GoldenSparks() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const sparks = useRef<Spark[]>([]);
  const raf = useRef(0);
  const dims = useRef({ w: 0, h: 0 });
  const mouseRef = useRef({ x: -9999, y: -9999 });

  const createSpark = useCallback((w: number, h: number, fromTop = false): Spark => {
    const isStreak = Math.random() < 0.15;
    const maxOpacity = Math.random() * 0.35 + 0.08;
    return {
      x: Math.random() * w,
      y: fromTop ? -10 : Math.random() * h,
      r: isStreak ? 0.8 : Math.random() * 1.8 + 0.3,
      vx: (Math.random() - 0.5) * 0.3,
      vy: Math.random() * 0.4 + 0.1,
      opacity: fromTop ? 0 : maxOpacity * Math.random(),
      maxOpacity,
      life: 0,
      maxLife: Math.random() * 600 + 200,
      type: isStreak ? 1 : 0,
      len: isStreak ? Math.random() * 8 + 4 : 0,
    };
  }, []);

  const init = useCallback(
    (w: number, h: number) => {
      dims.current = { w, h };
      const count = Math.max(
        MIN_PARTICLES,
        Math.min(MAX_PARTICLES, Math.floor(w * h * PARTICLE_DENSITY))
      );
      sparks.current = Array.from({ length: count }, () => createSpark(w, h));
    },
    [createSpark]
  );

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    /* ── Resize handling ─────────────────────────── */
    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const w = window.innerWidth;
      const h = window.innerHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      if (sparks.current.length === 0) init(w, h);
      dims.current = { w, h };
    };
    resize();
    window.addEventListener("resize", resize);

    /* ── Mouse interaction (subtle repel) ─────────── */
    const onMouse = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX, y: e.clientY };
    };
    window.addEventListener("mousemove", onMouse, { passive: true });

    /* ── Draw loop ────────────────────────────────── */
    const draw = () => {
      const { w, h } = dims.current;
      ctx.clearRect(0, 0, w, h);

      const mx = mouseRef.current.x;
      const my = mouseRef.current.y;

      for (let i = sparks.current.length - 1; i >= 0; i--) {
        const s = sparks.current[i];
        s.life++;

        // Fade in and out over lifetime
        const lifeFrac = s.life / s.maxLife;
        if (lifeFrac < 0.15) {
          s.opacity = s.maxOpacity * (lifeFrac / 0.15);
        } else if (lifeFrac > 0.75) {
          s.opacity = s.maxOpacity * (1 - (lifeFrac - 0.75) / 0.25);
        } else {
          // Subtle twinkle
          s.opacity =
            s.maxOpacity * (0.85 + 0.15 * Math.sin(s.life * 0.08 + i));
        }

        // Subtle drift
        s.x += s.vx + Math.sin(s.life * 0.005 + i) * 0.15;
        s.y += s.vy;

        // Mouse repel (gentle)
        const dx = s.x - mx;
        const dy = s.y - my;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 100 && dist > 0) {
          const force = (1 - dist / 100) * 0.5;
          s.x += (dx / dist) * force;
          s.y += (dy / dist) * force;
        }

        // Kill or respawn
        if (s.life >= s.maxLife || s.y > h + 20 || s.x < -20 || s.x > w + 20) {
          sparks.current[i] = createSpark(w, h, true);
          continue;
        }

        // Draw
        if (s.type === 1) {
          // Streak spark
          ctx.beginPath();
          ctx.moveTo(s.x, s.y);
          ctx.lineTo(s.x - s.vx * s.len, s.y - s.vy * s.len);
          ctx.strokeStyle = `rgba(${GOLD_R},${GOLD_G},${GOLD_B},${s.opacity * 0.6})`;
          ctx.lineWidth = s.r;
          ctx.lineCap = "round";
          ctx.stroke();
        } else {
          // Glowing dot
          // Outer glow
          const grd = ctx.createRadialGradient(s.x, s.y, 0, s.x, s.y, s.r * 4);
          grd.addColorStop(0, `rgba(${GOLD_R},${GOLD_G},${GOLD_B},${s.opacity * 0.6})`);
          grd.addColorStop(0.4, `rgba(${GOLD_R},${GOLD_G},${GOLD_B},${s.opacity * 0.15})`);
          grd.addColorStop(1, `rgba(${GOLD_R},${GOLD_G},${GOLD_B},0)`);
          ctx.beginPath();
          ctx.arc(s.x, s.y, s.r * 4, 0, Math.PI * 2);
          ctx.fillStyle = grd;
          ctx.fill();

          // Core
          ctx.beginPath();
          ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(${GOLD_R},${GOLD_G},${GOLD_B},${s.opacity})`;
          ctx.fill();
        }
      }

      raf.current = requestAnimationFrame(draw);
    };

    raf.current = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(raf.current);
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", onMouse);
    };
  }, [init, createSpark]);

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none fixed inset-0 z-[1]"
      aria-hidden="true"
      style={{ mixBlendMode: "screen" }}
    />
  );
}
