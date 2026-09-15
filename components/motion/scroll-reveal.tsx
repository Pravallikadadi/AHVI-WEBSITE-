"use client";
import { motion, useReducedMotion } from "framer-motion";

export function ScrollReveal({
  children,
  delay = 0,
  y = 24,
  blur = 6,
  className,
}: {
  children: React.ReactNode;
  delay?: number;
  y?: number;
  blur?: number;
  className?: string;
}) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      initial={reduce ? { opacity: 1 } : { opacity: 0, y, filter: `blur(${blur}px)` }}
      whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      viewport={{ once: true, margin: "-10%" }}
      transition={{ duration: reduce ? 0.01 : 0.85, delay, ease: [0.16, 1, 0.3, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
