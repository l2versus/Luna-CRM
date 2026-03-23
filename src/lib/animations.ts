import type { Variants } from "framer-motion";

/* ═══════════════════════════════════════════════════════
   Luna CRM — Framer Motion Animation Variants
   Apple-level premium scroll effects
   ═══════════════════════════════════════════════════════ */

// Cubic bezier for premium easing (Apple-style ease-out)
const luxuryEase = [0.22, 1, 0.36, 1] as const;
const snappyEase = [0.16, 1, 0.3, 1] as const;

// ── Fade Up (default section entrance) ───────────────
export const fadeUp: Variants = {
  hidden: {
    opacity: 0,
    y: 40,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.8,
      ease: luxuryEase,
    },
  },
};

// ── Fade Up Slow (cinematic sections) ────────────────
export const fadeUpSlow: Variants = {
  hidden: {
    opacity: 0,
    y: 60,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 1.1,
      ease: luxuryEase,
    },
  },
};

// ── Fade In (no movement, just opacity) ──────────────
export const fadeIn: Variants = {
  hidden: {
    opacity: 0,
  },
  visible: {
    opacity: 1,
    transition: {
      duration: 0.8,
      ease: luxuryEase,
    },
  },
};

// ── Scale In (pop effect for icons/badges) ───────────
export const scaleIn: Variants = {
  hidden: {
    opacity: 0,
    scale: 0.85,
  },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.6,
      ease: snappyEase,
    },
  },
};

// ── Scale Up Reveal (dramatic, Apple-style) ──────────
export const scaleReveal: Variants = {
  hidden: {
    opacity: 0,
    scale: 0.92,
    y: 30,
  },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: {
      duration: 1,
      ease: luxuryEase,
    },
  },
};

// ── Slide from Left ──────────────────────────────────
export const slideLeft: Variants = {
  hidden: {
    opacity: 0,
    x: -60,
  },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.8,
      ease: luxuryEase,
    },
  },
};

// ── Slide from Right ─────────────────────────────────
export const slideRight: Variants = {
  hidden: {
    opacity: 0,
    x: 60,
  },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.8,
      ease: luxuryEase,
    },
  },
};

// ── Blur In (Apple-style focus reveal) ───────────────
export const blurIn: Variants = {
  hidden: {
    opacity: 0,
    filter: "blur(12px)",
    y: 20,
  },
  visible: {
    opacity: 1,
    filter: "blur(0px)",
    y: 0,
    transition: {
      duration: 0.8,
      ease: luxuryEase,
    },
  },
};

// ── Rotate In (subtle 3D entrance) ──────────────────
export const rotateIn: Variants = {
  hidden: {
    opacity: 0,
    rotateX: 12,
    y: 40,
  },
  visible: {
    opacity: 1,
    rotateX: 0,
    y: 0,
    transition: {
      duration: 0.9,
      ease: luxuryEase,
    },
  },
};

// ── Clip reveal (bottom-up mask effect) ──────────────
export const clipReveal: Variants = {
  hidden: {
    opacity: 0,
    clipPath: "inset(20% 0% 0% 0%)",
    y: 30,
  },
  visible: {
    opacity: 1,
    clipPath: "inset(0% 0% 0% 0%)",
    y: 0,
    transition: {
      duration: 0.9,
      ease: luxuryEase,
    },
  },
};

// ── Stagger Container ────────────────────────────────
export const stagger: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.12,
    },
  },
};

// ── Stagger Slow (for feature grids) ─────────────────
export const staggerSlow: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.18,
    },
  },
};

// ── Stagger Fast (tight sequences) ──────────────────
export const staggerFast: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.06,
    },
  },
};

// ── Float Animation (hero image continuous) ──────────
export const float = {
  animate: {
    y: [0, -10, 0],
    transition: {
      duration: 4,
      repeat: Infinity,
      ease: "easeInOut" as const,
    },
  },
};

// ── Glow Pulse (continuous for highlighted elements) ─
export const glowPulse = {
  animate: {
    boxShadow: [
      "0 0 30px rgba(212,175,55,0.08)",
      "0 0 60px rgba(212,175,55,0.15)",
      "0 0 30px rgba(212,175,55,0.08)",
    ],
    transition: {
      duration: 3,
      repeat: Infinity,
      ease: "easeInOut" as const,
    },
  },
};

// ── Draw Line (for connector/separator animations) ───
export const drawLine: Variants = {
  hidden: {
    scaleX: 0,
    opacity: 0,
  },
  visible: {
    scaleX: 1,
    opacity: 1,
    transition: {
      duration: 1.2,
      ease: luxuryEase,
    },
  },
};

// ── Viewport Settings ────────────────────────────────
export const viewportConfig = {
  once: true,
  amount: 0.2,
} as const;

// ── Hover Effects ────────────────────────────────────
export const hoverLift = {
  whileHover: { y: -4, transition: { duration: 0.2 } },
};

export const hoverScale = {
  whileHover: { scale: 1.02, transition: { duration: 0.2 } },
};

export const tapScale = {
  whileTap: { scale: 0.98 },
};
