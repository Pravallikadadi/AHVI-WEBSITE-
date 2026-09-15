"use client";
import { useId } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { Plus, Minus } from "lucide-react";
import type { FaqItem } from "@/lib/faq-data";

export function FAQItem({ item, open, onToggle }: { item: FaqItem; open: boolean; onToggle: () => void }) {
  const id = useId();
  const reduce = useReducedMotion();
  return (
    <div className="border-b border-ink/10">
      <button
        type="button"
        aria-expanded={open}
        aria-controls={id}
        onClick={onToggle}
        className="flex w-full items-center justify-between gap-4 py-5 text-left focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent"
      >
        <span className="font-condensed text-[16.5px] font-medium text-ink">{item.question}</span>
        <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full border border-ink/15 text-ink">
          {open ? <Minus size={14} /> : <Plus size={14} />}
        </span>
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            id={id}
            role="region"
            initial={reduce ? { height: "auto", opacity: 1 } : { height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={reduce ? { opacity: 0 } : { height: 0, opacity: 0 }}
            transition={{ duration: reduce ? 0.01 : 0.3, ease: [0.2, 0.7, 0.2, 1] }}
            className="overflow-hidden"
          >
            <p className="max-w-[68ch] pb-5 text-[14.5px] leading-relaxed text-muted">{item.answer}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
