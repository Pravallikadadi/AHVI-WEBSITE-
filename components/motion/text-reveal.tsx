"use client";
import { motion, useReducedMotion } from "framer-motion";

/** Splits text into words and reveals them with a soft staggered rise — for hero/section headings. */
export function TextReveal({ text, className, delay = 0 }: { text: string; className?: string; delay?: number }) {
  const reduce = useReducedMotion();
  const words = text.split(" ");
  return (
    <span className={className} style={{ display: "inline" }}>
      {words.map((w, i) => (
        <span key={i} style={{ display: "inline-block", overflow: "hidden", verticalAlign: "top" }}>
          <motion.span
            style={{ display: "inline-block" }}
            initial={reduce ? { y: 0, opacity: 1 } : { y: "100%", opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: reduce ? 0.01 : 0.6, delay: delay + i * 0.045, ease: [0.2, 0.7, 0.2, 1] }}
          >
            {w}
            {i < words.length - 1 ? "\u00A0" : ""}
          </motion.span>
        </span>
      ))}
    </span>
  );
}
