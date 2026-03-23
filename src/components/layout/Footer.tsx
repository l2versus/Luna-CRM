"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { SITE, FOOTER_LINKS } from "@/lib/constants";
import { fadeUp, stagger, viewportConfig } from "@/lib/animations";

/* ═══════════════════════════════════════════════════════
   Luna CRM — Footer Premium
   - Tech stack marquee (infinite scroll loop)
   - Giant brand section with orbital logo
   - Rich link columns + social + copyright
   ═══════════════════════════════════════════════════════ */

/* ── Tech Stack Data ───────────────────────────────────── */

const TECH_STACK = [
  { name: "Next.js", category: "Frontend" },
  { name: "React 19", category: "UI" },
  { name: "TypeScript", category: "Language" },
  { name: "Tailwind CSS", category: "Styling" },
  { name: "PostgreSQL", category: "Database" },
  { name: "Prisma ORM", category: "ORM" },
  { name: "Redis", category: "Cache" },
  { name: "OpenAI GPT-4", category: "AI" },
  { name: "pgvector", category: "Embeddings" },
  { name: "Evolution API", category: "WhatsApp" },
  { name: "Mercado Pago", category: "Payments" },
  { name: "Resend", category: "Email" },
  { name: "Cloudinary", category: "Media" },
  { name: "Docker", category: "Deploy" },
  { name: "Framer Motion", category: "Animation" },
  { name: "React Flow", category: "Bots" },
];

/* ── Tech Marquee Strip ────────────────────────────────── */

function TechMarquee({ reverse = false }: { reverse?: boolean }) {
  const items = [...TECH_STACK, ...TECH_STACK];

  return (
    <div className="relative overflow-hidden py-3">
      {/* Edge fades */}
      <div className="pointer-events-none absolute left-0 top-0 bottom-0 z-10 w-24 md:w-40 bg-gradient-to-r from-[var(--color-bg-primary)] to-transparent" />
      <div className="pointer-events-none absolute right-0 top-0 bottom-0 z-10 w-24 md:w-40 bg-gradient-to-l from-[var(--color-bg-primary)] to-transparent" />

      <div
        className={`flex gap-4 whitespace-nowrap ${
          reverse ? "animate-tech-marquee-reverse" : "animate-tech-marquee"
        }`}
      >
        {items.map((tech, i) => (
          <div
            key={`${tech.name}-${i}`}
            className="inline-flex items-center gap-2.5 px-4 py-2 rounded-lg border border-white/[0.04] bg-[var(--color-bg-surface)]/40 backdrop-blur-sm flex-shrink-0 group hover:border-[var(--color-gold)]/15 transition-colors duration-300"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-gold)]/40 group-hover:bg-[var(--color-gold)] transition-colors duration-300" />
            <span className="text-[13px] font-medium text-[var(--color-text-secondary)] group-hover:text-[var(--color-text)] transition-colors duration-300">
              {tech.name}
            </span>
            <span className="text-[9px] uppercase tracking-[0.1em] text-[var(--color-text-muted)]/60 font-body">
              {tech.category}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ── Feature Words Marquee (large text) ────────────────── */

const FEATURE_WORDS = [
  "Agendamento Inteligente",
  "CRM Kanban",
  "WhatsApp Ilimitado",
  "IA Concierge",
  "Radar de Retenção",
  "Janela de Ouro",
  "Automações Visuais",
  "LGPD Compliance",
  "Gestão Financeira",
  "Analytics ROI",
  "Portal do Paciente",
  "Bots No-Code",
];

function FeatureMarquee({ reverse = false }: { reverse?: boolean }) {
  return (
    <div className="relative overflow-hidden py-3">
      <div className="pointer-events-none absolute left-0 top-0 bottom-0 z-10 w-32 bg-gradient-to-r from-[var(--color-bg-primary)] to-transparent" />
      <div className="pointer-events-none absolute right-0 top-0 bottom-0 z-10 w-32 bg-gradient-to-l from-[var(--color-bg-primary)] to-transparent" />

      <div
        className={`flex gap-6 whitespace-nowrap ${
          reverse ? "animate-marquee-reverse" : "animate-marquee"
        }`}
      >
        {[...FEATURE_WORDS, ...FEATURE_WORDS].map((word, i) => (
          <span
            key={`${word}-${i}`}
            className="inline-flex items-center gap-3 text-[clamp(1.5rem,3.5vw,3rem)] font-heading font-bold select-none"
            style={{
              WebkitTextStroke: "1px rgba(212,175,55,0.12)",
              WebkitTextFillColor: "transparent",
            }}
          >
            {word}
            <span
              className="text-[0.5em]"
              style={{
                WebkitTextStroke: "0",
                WebkitTextFillColor: "rgba(212,175,55,0.12)",
              }}
            >
              ✦
            </span>
          </span>
        ))}
      </div>
    </div>
  );
}

/* ═════════════════════════════════════════════════════════
   FOOTER COMPONENT
   ═════════════════════════════════════════════════════════ */

export default function Footer() {
  return (
    <footer className="relative overflow-hidden">
      {/* ═══ TECH STACK MARQUEE SECTION ═══ */}
      <div className="relative py-10 border-t border-white/[0.03]">
        {/* Section label */}
        <div className="text-center mb-6">
          <span className="text-[10px] uppercase tracking-[0.3em] text-[var(--color-text-muted)] font-body">
            Tecnologias que alimentam o Luna
          </span>
        </div>

        {/* Row 1 — left to right */}
        <TechMarquee />
        {/* Row 2 — right to left */}
        <TechMarquee reverse />
      </div>

      {/* ═══ FEATURE WORDS MARQUEE ═══ */}
      <div className="relative py-8 border-t border-white/[0.03]">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[200px] bg-[var(--color-gold)]/[0.015] rounded-full blur-[100px]" />
        </div>

        <FeatureMarquee />
        <FeatureMarquee reverse />
      </div>

      {/* ═══ MEGA LOGO SECTION ═══ */}
      <div className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-[var(--color-gold)]/[0.025] rounded-full blur-[120px]" />
        </div>

        <div className="relative mx-auto flex items-center justify-center">
          {/* Orbital rings */}
          <div className="absolute w-[200px] h-[200px] md:w-[260px] md:h-[260px] rounded-full border border-[var(--color-gold)]/[0.06] logo-spin-slow" />
          <div
            className="absolute w-[160px] h-[160px] md:w-[210px] md:h-[210px] rounded-full border border-dashed border-[var(--color-gold)]/[0.04] logo-spin-slow"
            style={{ animationDirection: "reverse", animationDuration: "45s" }}
          />

          {/* Orbital dots */}
          <div className="absolute w-[200px] h-[200px] md:w-[260px] md:h-[260px] logo-spin-slow">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-[var(--color-gold)]/25" />
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 w-1 h-1 rounded-full bg-[var(--color-gold)]/15" />
            <div className="absolute right-0 top-1/2 translate-x-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-[var(--color-gold)]/25" />
          </div>

          {/* Main logo */}
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
            className="relative"
          >
            <Image
              src="/imagens/logos/logo.png"
              alt="Luna CRM"
              width={120}
              height={120}
              className="h-20 w-20 md:h-28 md:w-28 object-contain logo-float"
              style={{
                filter:
                  "drop-shadow(0 0 16px rgba(212,175,55,0.4)) drop-shadow(0 0 48px rgba(212,175,55,0.2))",
              }}
            />
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="mt-8 text-center"
        >
          <h3 className="font-heading text-3xl md:text-4xl font-bold text-gradient-gold tracking-wide">
            Luna CRM
          </h3>
          <p className="mt-2 text-[12px] text-[var(--color-text-muted)] tracking-[0.2em] uppercase">
            Inteligência Premium Para Clínicas
          </p>
        </motion.div>
      </div>

      {/* Gold separator */}
      <div className="mx-auto max-w-[1100px] px-6">
        <div className="h-px bg-gradient-to-r from-transparent via-[var(--color-gold)]/20 to-transparent" />
      </div>

      {/* ═══ MAIN FOOTER CONTENT ═══ */}
      <div className="mx-auto max-w-[1100px] px-6 py-14">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={viewportConfig}
          variants={stagger}
          className="grid grid-cols-2 gap-10 md:grid-cols-4"
        >
          {/* Brand */}
          <motion.div variants={fadeUp} className="col-span-2 md:col-span-1">
            <a href="/" className="flex items-center gap-3 group">
              <div className="relative">
                <Image
                  src="/imagens/logos/logo.png"
                  alt="Luna CRM"
                  width={44}
                  height={44}
                  className="h-10 w-10 object-contain logo-glow transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 -m-2 rounded-full bg-[var(--color-gold)]/[0.06] blur-xl opacity-70 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
              </div>
              <div className="flex flex-col">
                <span className="font-heading text-xl font-bold text-gradient-gold leading-none">
                  Luna
                </span>
                <span className="text-[9px] font-semibold tracking-[0.2em] uppercase text-[var(--color-gold)]/50 leading-none mt-0.5">
                  CRM
                </span>
              </div>
            </a>
            <p className="mt-4 max-w-[240px] text-[13px] leading-[1.7] text-[var(--color-text-muted)]">
              AI CRM premium projetado exclusivamente para clínicas de estética
              que faturam alto.
            </p>
            <span className="mt-4 inline-flex items-center gap-1.5 rounded-full border border-white/[0.04] bg-[var(--color-bg-surface)]/60 px-3 py-1 text-[11px] text-[var(--color-text-muted)]">
              Feito no Brasil 🇧🇷
            </span>
          </motion.div>

          {/* Produto */}
          <motion.div variants={fadeUp}>
            <h4 className="mb-5 text-[11px] font-semibold text-[var(--color-text)] uppercase tracking-[0.12em]">
              Produto
            </h4>
            <ul className="space-y-3">
              {FOOTER_LINKS.product.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="text-[13px] text-[var(--color-text-muted)] transition-colors duration-300 hover:text-[var(--color-gold)]"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Empresa */}
          <motion.div variants={fadeUp}>
            <h4 className="mb-5 text-[11px] font-semibold text-[var(--color-text)] uppercase tracking-[0.12em]">
              Empresa
            </h4>
            <ul className="space-y-3">
              {FOOTER_LINKS.company.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="text-[13px] text-[var(--color-text-muted)] transition-colors duration-300 hover:text-[var(--color-gold)]"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Legal */}
          <motion.div variants={fadeUp}>
            <h4 className="mb-5 text-[11px] font-semibold text-[var(--color-text)] uppercase tracking-[0.12em]">
              Legal
            </h4>
            <ul className="space-y-3">
              {FOOTER_LINKS.legal.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="text-[13px] text-[var(--color-text-muted)] transition-colors duration-300 hover:text-[var(--color-gold)]"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </motion.div>
        </motion.div>

        {/* Social */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={viewportConfig}
          variants={fadeUp}
          className="mt-12 flex items-center justify-center gap-3"
        >
          {FOOTER_LINKS.social.map((social) => (
            <a
              key={social.label}
              href={social.href}
              aria-label={social.label}
              target={social.href.startsWith("http") ? "_blank" : undefined}
              rel={
                social.href.startsWith("http")
                  ? "noopener noreferrer"
                  : undefined
              }
              className="group flex h-10 w-10 items-center justify-center rounded-full border border-white/[0.04] text-[var(--color-text-muted)] transition-all duration-300 hover:border-[var(--color-gold)]/20 hover:text-[var(--color-gold)] hover:bg-[var(--color-gold)]/[0.04] hover:shadow-[0_0_16px_rgba(212,175,55,0.08)]"
            >
              <social.icon className="h-4 w-4 transition-transform duration-300 group-hover:scale-110" />
            </a>
          ))}
        </motion.div>

        {/* Copyright */}
        <div className="mt-10 border-t border-white/[0.04] pt-8">
          <p className="text-center text-[11px] text-[var(--color-text-muted)]/70">
            {SITE.copyright}
          </p>
        </div>
      </div>
    </footer>
  );
}
