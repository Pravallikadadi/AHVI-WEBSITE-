"use client";
import { useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";

export function ModuleTabs({ items }: { items: { id: string; label: string; note: string }[] }) {
  const [active, setActive] = useState(0);
  const reduce = useReducedMotion();

  return (
    <div>
      <div className="flex flex-wrap gap-2">
        {items.map((it, i) => (
          <button
            key={it.id}
            onClick={() => setActive(i)}
            className={
              "border px-4 py-2 text-[13px] font-medium transition-colors " +
              (i === active ? "border-ink bg-ink text-bg" : "border-ink/15 text-muted hover:border-ink/40 hover:text-ink")
            }
          >
            {it.label}
          </button>
        ))}
      </div>
      <div className="relative mt-6 min-h-[92px] border border-ink/10 bg-bg p-7 sm:p-9">
        <AnimatePresence mode="wait">
          <motion.div
            key={items[active].id}
            initial={reduce ? { opacity: 1 } : { opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reduce ? { opacity: 1 } : { opacity: 0, y: -10 }}
            transition={{ duration: reduce ? 0.01 : 0.35, ease: [0.2, 0.7, 0.2, 1] }}
          >
            <div className="font-condensed text-[22px] font-semibold sm:text-[26px]">{items[active].label}</div>
            <p className="mt-2.5 max-w-[52ch] text-[14.5px] leading-relaxed text-muted">{items[active].note}</p>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
