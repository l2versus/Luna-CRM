"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { fadeUp, stagger, viewportConfig } from "@/lib/animations";
import { FAQS } from "@/lib/constants";

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggle = (i: number) =>
    setOpenIndex((prev) => (prev === i ? null : i));

  return (
    <section id="faq" className="py-32 px-6 overflow-hidden">
      <div className="mx-auto max-w-[720px]">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={viewportConfig}
          variants={fadeUp}
          className="mb-14 text-center"
        >
          <span className="section-badge">FAQ</span>
          <h2
            className="mt-6 font-heading font-bold text-[var(--color-text)]"
            style={{ fontSize: "clamp(2rem, 4vw, 3rem)" }}
          >
            Perguntas Frequentes
          </h2>
        </motion.div>

        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="visible"
          viewport={viewportConfig}
          className="space-y-0"
        >
          {FAQS.map((faq, i) => {
            const isOpen = openIndex === i;
            return (
              <motion.div
                key={faq.q}
                variants={fadeUp}
                className="border-b border-white/[0.04]"
              >
                <button
                  onClick={() => toggle(i)}
                  aria-expanded={isOpen}
                  className="flex w-full items-center justify-between py-5 text-left transition-colors group"
                >
                  <span className="pr-4 text-[14px] font-medium text-[var(--color-text)] group-hover:text-[var(--color-gold)] transition-colors">
                    {faq.q}
                  </span>
                  <motion.span
                    animate={{ rotate: isOpen ? 180 : 0 }}
                    transition={{ duration: 0.25 }}
                    className={`shrink-0 transition-colors ${isOpen ? "text-[var(--color-gold)]" : "text-[var(--color-text-muted)]"}`}
                  >
                    <ChevronDown className="h-4 w-4" />
                  </motion.span>
                </button>

                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                      className="overflow-hidden"
                    >
                      <p className="pb-5 text-[13px] leading-[1.7] text-[var(--color-text-muted)]">
                        {faq.a}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
