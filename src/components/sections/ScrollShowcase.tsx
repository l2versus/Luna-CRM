"use client";

import { useRef } from "react";
import Image from "next/image";
import {
  motion,
  useScroll,
  useTransform,
} from "framer-motion";
import {
  Layout,
  MessageSquare,
  CreditCard,
  CalendarDays,
  Users,
} from "lucide-react";

/* ═══════════════════════════════════════════════════════
   Luna CRM — Scroll Showcase
   Each screen is its own section with scroll-driven
   parallax + 3D perspective. No sticky, no fixed.
   Bulletproof approach inspired by Linear/Vercel.
   ═══════════════════════════════════════════════════════ */

interface Screen {
  title: string;
  description: string;
  image: string;
  accent: string;
  icon: typeof Layout;
  tag: string;
}

const SCREENS: Screen[] = [
  {
    title: "Pipeline Kanban com Física Real",
    description:
      "Arraste leads com gravidade, sombra e inclinação. Cada card responde ao toque com feedback visual instantâneo. Atualização entre equipe via SSE.",
    image: "/imagens/showcase/kaban.png",
    accent: "#d4af37",
    icon: Layout,
    tag: "CRM",
  },
  {
    title: "Inbox WhatsApp Unificada",
    description:
      "Toda a equipe em uma caixa colaborativa. Texto, áudio, vídeo e documentos — sem custo por mensagem.",
    image: "/imagens/inbox-wpp.png",
    accent: "#2ECC8A",
    icon: MessageSquare,
    tag: "Comunicação",
  },
  {
    title: "Gestão Financeira Completa",
    description:
      "Pro-labore, comissões e relatórios em tempo real. Integração PIX automática via Mercado Pago.",
    image: "/imagens/screenshots/pro-laboreClinica.png",
    accent: "#4A7BFF",
    icon: CreditCard,
    tag: "Financeiro",
  },
  {
    title: "Agenda Inteligente",
    description:
      "Agendamento dinâmico sem conflitos. Confirmação automática por WhatsApp. Portal do paciente integrado.",
    image: "/imagens/screenshots/agenda.png",
    accent: "#FF6B4A",
    icon: CalendarDays,
    tag: "Agendamento",
  },
  {
    title: "Equipe & Permissões",
    description:
      "Gerencie sua equipe com papéis granulares. Cada colaborador vê apenas o que precisa.",
    image: "/imagens/screenshots/equipe.png",
    accent: "#A855F7",
    icon: Users,
    tag: "Gestão",
  },
];

const COUNT = SCREENS.length;

/* ── Single showcase card ────────────────────────────── */

function ShowcaseCard({ screen, index }: { screen: Screen; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const isEven = index % 2 === 0;

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  // Parallax: image moves slower than scroll
  const imgY = useTransform(scrollYProgress, [0, 1], [60, -60]);
  // Subtle 3D tilt based on scroll
  const rotateX = useTransform(scrollYProgress, [0, 0.5, 1], [4, 0, -3]);
  // Glow intensifies mid-view
  const glowOpacity = useTransform(scrollYProgress, [0.1, 0.4, 0.7, 0.9], [0, 0.6, 0.5, 0]);

  const Icon = screen.icon;

  return (
    <div ref={ref} className="relative py-16 md:py-24">
      <div
        className={`mx-auto max-w-[1180px] px-5 md:px-8 grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center ${
          isEven ? "" : "lg:[direction:rtl]"
        }`}
      >
        {/* ── Text ── */}
        <motion.div
          initial={{ opacity: 0, y: 40, filter: "blur(8px)" }}
          whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className={`text-center lg:text-left ${!isEven ? "lg:[direction:ltr]" : ""}`}
        >
          {/* Tag */}
          <span
            className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] border mb-5"
            style={{
              borderColor: `${screen.accent}30`,
              color: screen.accent,
              background: `${screen.accent}0a`,
            }}
          >
            <Icon className="w-3 h-3" />
            {screen.tag}
          </span>

          {/* Counter */}
          <p className="text-[var(--color-text-muted)] text-[11px] tracking-[0.25em] uppercase mb-2 font-body opacity-50">
            {String(index + 1).padStart(2, "0")}
            <span className="mx-1 text-[var(--color-border)]">/</span>
            {String(COUNT).padStart(2, "0")}
          </p>

          {/* Title */}
          <h3
            className="font-heading font-bold text-[var(--color-text)] leading-[1.08]"
            style={{ fontSize: "clamp(1.75rem, 3.5vw, 2.8rem)" }}
          >
            {screen.title}
          </h3>

          {/* Description */}
          <p className="mt-4 text-[var(--color-text-muted)] text-sm md:text-[15px] leading-[1.75] font-body max-w-[420px] mx-auto lg:mx-0">
            {screen.description}
          </p>

          {/* Accent bar */}
          <div
            className="mt-6 h-[2px] w-10 rounded-full mx-auto lg:mx-0"
            style={{ background: screen.accent }}
          />
        </motion.div>

        {/* ── Screenshot ── */}
        <motion.div
          initial={{ opacity: 0, y: 60, scale: 0.92 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 1, ease: [0.22, 1, 0.36, 1], delay: 0.15 }}
          className={`relative ${!isEven ? "lg:[direction:ltr]" : ""}`}
          style={{ perspective: 1000 }}
        >
          {/* Glow */}
          <motion.div
            style={{ opacity: glowOpacity }}
            className="absolute -inset-10 -z-10 pointer-events-none"
            aria-hidden
          >
            <div
              className="w-full h-full rounded-3xl blur-[80px]"
              style={{ background: `radial-gradient(ellipse at center, ${screen.accent}1a, transparent 70%)` }}
            />
          </motion.div>

          {/* Browser window with parallax image */}
          <motion.div style={{ rotateX, y: imgY }} className="will-change-transform">
            <div className="rounded-xl overflow-hidden border border-white/[0.06] shadow-[0_8px_60px_-12px_rgba(0,0,0,0.8)]">
              {/* Toolbar */}
              <div className="flex items-center gap-2 bg-[#0c0c0e] px-3 py-2 border-b border-white/[0.04]">
                <div className="flex gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-[#ff5f57]/70" />
                  <span className="w-2 h-2 rounded-full bg-[#febd2e]/70" />
                  <span className="w-2 h-2 rounded-full bg-[#27c840]/70" />
                </div>
                <div className="flex-1 flex justify-center">
                  <span className="bg-white/[0.04] rounded px-5 py-0.5 text-[9px] text-[var(--color-text-muted)] opacity-40 select-none">
                    app.lunacrm.com.br
                  </span>
                </div>
              </div>

              {/* Screenshot */}
              <Image
                src={screen.image}
                alt={screen.title}
                width={1200}
                height={750}
                className="w-full h-auto block"
              />

              {/* Shine overlay */}
              <div className="absolute inset-0 bg-gradient-to-br from-white/[0.015] via-transparent to-transparent pointer-events-none" />
            </div>
          </motion.div>

          {/* Side accent line */}
          <motion.div
            initial={{ scaleY: 0 }}
            whileInView={{ scaleY: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className={`absolute top-[10%] bottom-[10%] w-px origin-top hidden lg:block ${
              isEven ? "-right-6" : "-left-6"
            }`}
            style={{
              background: `linear-gradient(to bottom, transparent, ${screen.accent}30, transparent)`,
            }}
          />
        </motion.div>
      </div>

      {/* Section divider line */}
      {index < COUNT - 1 && (
        <div className="mx-auto max-w-[600px] mt-16 md:mt-24">
          <div className="h-px bg-gradient-to-r from-transparent via-white/[0.04] to-transparent" />
        </div>
      )}
    </div>
  );
}

/* ═════════════════════════════════════════════════════════
   MAIN
   ═════════════════════════════════════════════════════════ */

export default function ScrollShowcase() {
  return (
    <section id="showcase-scroll" className="relative py-12 md:py-20">
      {/* Section header */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.5 }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        className="text-center mb-8 md:mb-16 px-6"
      >
        <span className="section-badge mb-4 inline-block">Produto</span>
        <h2
          className="font-heading font-bold text-[var(--color-text)] mx-auto max-w-[700px]"
          style={{ fontSize: "clamp(1.8rem, 4vw, 3rem)" }}
        >
          Conheça Cada Módulo do{" "}
          <span className="text-gradient-gold">Luna CRM</span>
        </h2>
        <p className="mt-3 text-[var(--color-text-muted)] text-sm md:text-base max-w-[480px] mx-auto">
          Scroll para explorar as principais funcionalidades da plataforma.
        </p>
      </motion.div>

      {/* Cards */}
      {SCREENS.map((screen, i) => (
        <ShowcaseCard key={i} screen={screen} index={i} />
      ))}
    </section>
  );
}
