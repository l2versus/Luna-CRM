"use client";

import { useState } from "react";
import { motion, useSpring, useTransform } from "framer-motion";
import { TrendingUp, Users, DollarSign, Crown, Sparkles, Check, ArrowRight } from "lucide-react";
import { fadeUp, stagger, viewportConfig } from "@/lib/animations";
import { PLANS, SITE } from "@/lib/constants";

/* ── Animated number spring ───────────────────────────── */
function AnimatedValue({
  value,
  prefix = "",
  suffix = "",
}: {
  value: number;
  prefix?: string;
  suffix?: string;
}) {
  const spring = useSpring(value, { stiffness: 80, damping: 20 });
  const display = useTransform(spring, (v) =>
    Math.round(v).toLocaleString("pt-BR")
  );
  spring.set(value);

  return (
    <span className="tabular-nums">
      {prefix}
      <motion.span>{display}</motion.span>
      {suffix}
    </span>
  );
}

/* ── Plan ROI card ────────────────────────────────────── */
function PlanROICard({
  plan,
  revenue,
  patients,
  index,
}: {
  plan: typeof PLANS[number];
  revenue: number;
  patients: number;
  index: number;
}) {
  const roi = plan.monthly > 0 ? Math.round((revenue / plan.monthly) * 100) : 0;
  const roiMultiplier = plan.monthly > 0 ? (revenue / plan.monthly) : 0;
  const isPopular = plan.popular;
  const isExecutive = plan.executive;
  const payback = revenue > 0 ? Math.max(1, Math.ceil(plan.monthly / (revenue / 30))) : 99;

  // Determine which features are most relevant for ROI
  const keyFeature = isExecutive
    ? "Radar de Retenção + Janela de Ouro + IA RAG"
    : isPopular
    ? "CRM Kanban + WhatsApp ilimitado + Bots"
    : "Agendamento + Portal Paciente + Financeiro";

  return (
    <motion.div
      variants={fadeUp}
      className={`relative flex flex-col rounded-2xl border p-6 transition-all duration-500 ${
        isPopular
          ? "border-[var(--color-gold)]/30 bg-gradient-to-b from-[var(--color-gold)]/[0.06] to-transparent shadow-[0_0_60px_rgba(212,175,55,0.08)]"
          : isExecutive
          ? "border-white/[0.08] bg-gradient-to-b from-white/[0.03] to-transparent"
          : "border-white/[0.04] bg-[var(--color-bg-surface)]/40"
      }`}
    >
      {/* Popular badge */}
      {isPopular && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-[#e5c76b] via-[#d4af37] to-[#b8962e] px-4 py-1 text-[11px] font-bold text-[#0a0a0b] uppercase tracking-wider shadow-[0_4px_20px_rgba(212,175,55,0.3)]">
            <Sparkles className="h-3 w-3" />
            Melhor Custo-Benefício
          </span>
        </div>
      )}

      {/* Header */}
      <div className={`mb-5 ${isPopular ? "pt-2" : ""}`}>
        <div className="flex items-center gap-2 mb-1">
          {isExecutive && <Crown className="h-4 w-4 text-[var(--color-gold)]" />}
          <h3 className={`text-[15px] font-bold ${isPopular ? "text-[var(--color-gold)]" : "text-[var(--color-text)]"}`}>
            {plan.name}
          </h3>
        </div>
        <p className="text-[12px] text-[var(--color-text-muted)]">{plan.subtitle}</p>
      </div>

      {/* Price */}
      <div className="mb-5">
        <div className="flex items-baseline gap-1">
          <span className="text-[11px] text-[var(--color-text-muted)]">R$</span>
          <span className={`text-[32px] font-bold leading-none ${isPopular ? "text-gradient-gold" : "text-[var(--color-text)]"}`}>
            {plan.monthly.toLocaleString("pt-BR")}
          </span>
          <span className="text-[12px] text-[var(--color-text-muted)]">/mês</span>
        </div>
      </div>

      {/* Divider */}
      <div className="mb-5 h-px bg-gradient-to-r from-transparent via-white/[0.06] to-transparent" />

      {/* ROI Metrics */}
      <div className="space-y-4 flex-1">
        {/* Receita adicional */}
        <div>
          <p className="text-[11px] text-[var(--color-text-muted)] uppercase tracking-wider mb-1">Receita adicional/mês</p>
          <p className={`text-[24px] font-bold leading-none ${
            isPopular ? "text-gradient-gold" : isExecutive ? "text-[var(--color-gold-light)]" : "text-[var(--color-text)]"
          }`}>
            <AnimatedValue value={revenue} prefix="R$ " />
          </p>
        </div>

        {/* ROI bar visual */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <p className="text-[11px] text-[var(--color-text-muted)] uppercase tracking-wider">ROI</p>
            <p className={`text-[14px] font-bold ${
              roi >= 500 ? "text-[var(--color-success)]" : roi >= 200 ? "text-[var(--color-gold)]" : "text-[var(--color-text)]"
            }`}>
              <AnimatedValue value={roi} suffix="%" />
            </p>
          </div>
          <div className="h-2 rounded-full bg-white/[0.04] overflow-hidden">
            <motion.div
              className={`h-full rounded-full ${
                roi >= 500
                  ? "bg-gradient-to-r from-[var(--color-success)]/60 to-[var(--color-success)]"
                  : roi >= 200
                  ? "bg-gradient-to-r from-[var(--color-gold)]/60 to-[var(--color-gold)]"
                  : "bg-gradient-to-r from-white/10 to-white/30"
              }`}
              initial={{ width: 0 }}
              animate={{ width: `${Math.min(100, roi / 10)}%` }}
              transition={{ duration: 1, delay: 0.3 + index * 0.15, ease: [0.22, 1, 0.36, 1] }}
            />
          </div>
        </div>

        {/* Multiplicador */}
        <div className="flex items-center justify-between">
          <p className="text-[11px] text-[var(--color-text-muted)]">Retorno por R$ 1 investido</p>
          <p className={`text-[15px] font-bold ${roi >= 500 ? "text-[var(--color-success)]" : "text-[var(--color-gold)]"}`}>
            {roiMultiplier.toFixed(1)}x
          </p>
        </div>

        {/* Payback */}
        <div className="flex items-center justify-between">
          <p className="text-[11px] text-[var(--color-text-muted)]">Payback estimado</p>
          <p className="text-[13px] font-semibold text-[var(--color-text)]">
            {payback <= 30 ? `${payback} dia${payback > 1 ? "s" : ""}` : `${Math.ceil(payback / 30)} meses`}
          </p>
        </div>

        {/* Key feature */}
        <div className="rounded-lg bg-white/[0.02] border border-white/[0.04] p-3">
          <p className="text-[11px] text-[var(--color-text-muted)] mb-1">Inclui:</p>
          <p className="text-[12px] text-[var(--color-text-secondary)] leading-relaxed">{keyFeature}</p>
        </div>
      </div>

      {/* CTA */}
      <motion.a
        href={isExecutive ? SITE.whatsapp : "#precos"}
        target={isExecutive ? "_blank" : undefined}
        rel={isExecutive ? "noopener noreferrer" : undefined}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className={`mt-6 flex items-center justify-center gap-2 rounded-xl py-3 text-[13px] font-bold transition-all duration-300 ${
          isPopular
            ? "btn-gold !rounded-xl !py-3"
            : "border border-white/[0.08] bg-white/[0.03] text-[var(--color-text)] hover:border-[var(--color-gold)]/20 hover:bg-[var(--color-gold)]/[0.04] hover:text-[var(--color-gold)]"
        }`}
      >
        {plan.cta}
        <ArrowRight className="h-3.5 w-3.5" />
      </motion.a>
    </motion.div>
  );
}

/* ── Main Component ───────────────────────────────────── */
export default function ROICalculator() {
  const [patients, setPatients] = useState(80);
  const [ticket, setTicket] = useState(3000);

  // Reactivation rates differ per plan tier
  const reactivatedEssential = Math.round(patients * 0.05);
  const reactivatedGrowth = Math.round(patients * 0.10);
  const reactivatedExecutive = Math.round(patients * 0.18);

  const revenueEssential = reactivatedEssential * ticket;
  const revenueGrowth = reactivatedGrowth * ticket;
  const revenueExecutive = reactivatedExecutive * ticket;

  const revenues = [revenueEssential, revenueGrowth, revenueExecutive];

  return (
    <section id="roi" className="py-32 px-6 overflow-hidden">
      <div className="mx-auto max-w-[1200px]">
        {/* Header */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={viewportConfig}
          variants={fadeUp}
          className="mb-6 text-center"
        >
          <span className="section-badge">Retorno</span>
          <h2
            className="mt-6 font-heading font-bold text-[var(--color-text)]"
            style={{ fontSize: "clamp(2rem, 4vw, 3rem)" }}
          >
            Quanto Sua Clínica Vai{" "}
            <span className="text-gradient-gold">Lucrar a Mais?</span>
          </h2>
          <p className="mt-4 mx-auto max-w-[520px] text-[15px] text-[var(--color-text-muted)] leading-relaxed">
            Ajuste os valores da sua clínica e veja o retorno estimado em cada plano.
            Dados baseados na taxa média de reativação dos nossos clientes.
          </p>
        </motion.div>

        {/* Sliders Card */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={viewportConfig}
          variants={fadeUp}
          className="relative mx-auto max-w-[700px] mb-14 overflow-hidden rounded-2xl border border-white/[0.04] bg-gradient-to-b from-[var(--color-bg-surface)] to-[var(--color-bg-primary)] p-8 md:p-10"
        >
          {/* Grid background */}
          <div
            className="absolute inset-0 opacity-[0.03] pointer-events-none"
            style={{
              backgroundImage:
                "repeating-linear-gradient(0deg, transparent, transparent 39px, rgba(255,255,255,0.3) 39px, rgba(255,255,255,0.3) 40px), repeating-linear-gradient(90deg, transparent, transparent 39px, rgba(255,255,255,0.3) 39px, rgba(255,255,255,0.3) 40px)",
            }}
          />
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/[0.06] to-transparent" />

          <div className="relative z-10 space-y-8">
            {/* Patients slider */}
            <div>
              <div className="mb-3 flex items-center justify-between">
                <label htmlFor="patients" className="flex items-center gap-2 text-[13px] font-medium text-[var(--color-text)]">
                  <Users className="h-4 w-4 text-[var(--color-gold)]/70" />
                  Pacientes atendidos por mês
                </label>
                <span className="rounded-lg bg-[var(--color-gold)]/10 px-3 py-1 text-[14px] font-bold text-[var(--color-gold)] tabular-nums min-w-[48px] text-center">
                  {patients}
                </span>
              </div>
              <input
                id="patients"
                type="range"
                min={10}
                max={500}
                step={5}
                value={patients}
                onChange={(e) => setPatients(Number(e.target.value))}
                className="slider w-full"
              />
              <div className="mt-1.5 flex justify-between text-[11px] text-[var(--color-text-muted)]">
                <span>10</span>
                <span>250</span>
                <span>500</span>
              </div>
            </div>

            {/* Ticket slider */}
            <div>
              <div className="mb-3 flex items-center justify-between">
                <label htmlFor="ticket" className="flex items-center gap-2 text-[13px] font-medium text-[var(--color-text)]">
                  <DollarSign className="h-4 w-4 text-[var(--color-gold)]/70" />
                  Ticket médio do procedimento
                </label>
                <span className="rounded-lg bg-[var(--color-gold)]/10 px-3 py-1 text-[14px] font-bold text-[var(--color-gold)] tabular-nums min-w-[90px] text-center">
                  R$ {ticket.toLocaleString("pt-BR")}
                </span>
              </div>
              <input
                id="ticket"
                type="range"
                min={500}
                max={10000}
                step={250}
                value={ticket}
                onChange={(e) => setTicket(Number(e.target.value))}
                className="slider w-full"
              />
              <div className="mt-1.5 flex justify-between text-[11px] text-[var(--color-text-muted)]">
                <span>R$ 500</span>
                <span>R$ 5.000</span>
                <span>R$ 10.000</span>
              </div>
            </div>

            {/* Summary insight */}
            <div className="flex items-center gap-3 rounded-xl bg-[var(--color-gold)]/[0.04] border border-[var(--color-gold)]/10 p-4">
              <TrendingUp className="h-5 w-5 text-[var(--color-gold)] shrink-0" />
              <p className="text-[13px] text-[var(--color-text-secondary)] leading-relaxed">
                Com <span className="font-bold text-[var(--color-text)]">{patients} pacientes</span> e ticket de{" "}
                <span className="font-bold text-[var(--color-text)]">R$ {ticket.toLocaleString("pt-BR")}</span>,
                o Executive AI pode recuperar até{" "}
                <span className="font-bold text-[var(--color-gold)]">R$ {revenueExecutive.toLocaleString("pt-BR")}/mês</span> em pacientes inativos.
              </p>
            </div>
          </div>
        </motion.div>

        {/* Plan ROI Cards Grid */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={viewportConfig}
          variants={stagger}
          className="grid gap-6 md:grid-cols-3"
        >
          {PLANS.map((plan, i) => (
            <PlanROICard
              key={plan.name}
              plan={plan}
              revenue={revenues[i]}
              patients={patients}
              index={i}
            />
          ))}
        </motion.div>

        {/* Bottom persuasion */}
        <motion.p
          initial="hidden"
          whileInView="visible"
          viewport={viewportConfig}
          variants={fadeUp}
          className="mt-10 text-center text-[13px] text-[var(--color-text-muted)]"
        >
          * Estimativas baseadas na taxa média de reativação: Essential 5%, Growth 10%, Executive 18% dos pacientes.
          Resultados reais podem variar conforme a operação da clínica.
        </motion.p>
      </div>
    </section>
  );
}
