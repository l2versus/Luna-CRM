"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Calendar, MessageCircle } from "lucide-react";
import { fadeUpSlow, viewportConfig } from "@/lib/animations";
import { SITE } from "@/lib/constants";
import DecorativeLogo from "@/components/ui/DecorativeLogo";

export default function FinalCTA() {
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  // Glow that intensifies as you scroll in
  const glowScale = useTransform(scrollYProgress, [0.1, 0.5], [0.6, 1]);
  const glowOpacity = useTransform(scrollYProgress, [0.1, 0.5], [0, 1]);

  return (
    <section ref={sectionRef} id="contato" className="relative overflow-hidden py-32 px-6">
      {/* Animated background glow */}
      <motion.div
        style={{ scale: glowScale, opacity: glowOpacity }}
        className="pointer-events-none absolute inset-0"
      >
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse 70% 50% at 50% 30%, rgba(212,175,55,0.08) 0%, transparent 70%)",
          }}
        />
      </motion.div>

      {/* Decorative logos — larger, more visible */}
      <DecorativeLogo size={200} className="absolute top-1/2 -translate-y-1/2 -left-16" opacity={0.04} spin />
      <DecorativeLogo size={160} className="absolute top-1/2 -translate-y-1/2 -right-12" opacity={0.035} spin />
      <DecorativeLogo size={80} className="absolute top-10 left-1/4" opacity={0.03} float />

      {/* Decorative top line */}
      <motion.div
        initial={{ scaleX: 0 }}
        whileInView={{ scaleX: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[400px] h-px bg-gradient-to-r from-transparent via-[var(--color-gold)]/20 to-transparent origin-center"
      />

      {/* Side accents */}
      <div className="absolute left-[10%] top-1/4 h-32 w-px bg-gradient-to-b from-transparent via-[var(--color-gold)]/10 to-transparent" />
      <div className="absolute right-[10%] top-1/3 h-32 w-px bg-gradient-to-b from-transparent via-[var(--color-gold)]/10 to-transparent" />

      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={viewportConfig}
        variants={fadeUpSlow}
        className="relative z-10 mx-auto max-w-[580px] text-center"
      >
        <h2
          className="font-heading font-bold text-[var(--color-text)]"
          style={{ fontSize: "clamp(2rem, 4.5vw, 3.25rem)" }}
        >
          Pronta Para Transformar{" "}
          <span className="text-gradient-gold">Sua Clínica?</span>
        </h2>
        <p className="mx-auto mt-5 max-w-[440px] text-[15px] leading-[1.7] text-[var(--color-text-muted)]">
          Agende uma demonstração gratuita e veja o Luna CRM em ação com os
          dados da sua clínica.
        </p>

        <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <motion.a
            href={SITE.whatsapp}
            target="_blank"
            rel="noopener noreferrer"
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.97 }}
            className="btn-gold px-8 py-4 text-[15px]"
          >
            <Calendar className="h-4 w-4" />
            Agendar Demo Gratuita
          </motion.a>
          <motion.a
            href={SITE.whatsapp}
            target="_blank"
            rel="noopener noreferrer"
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.97 }}
            className="btn-outline-gold px-8 py-4 text-[15px]"
          >
            <MessageCircle className="h-4 w-4" />
            Falar no WhatsApp
          </motion.a>
        </div>
      </motion.div>
    </section>
  );
}
