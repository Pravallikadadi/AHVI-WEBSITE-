"use client";
import { motion, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";

/** Wrap any Photo/image block — reveals with a rising clip-path + gentle scale settle, never crops via animation. */
export function ImageReveal({ children, className, delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      className={cn("overflow-hidden", className)}
      initial={reduce ? { clipPath: "inset(0% 0% 0% 0%)" } : { clipPath: "inset(0% 0% 0% 0%)" }}
      whileInView={{ clipPath: "inset(0% 0% 0% 0%)" }}
      viewport={{ once: true, margin: "-10%" }}
      transition={{ duration: reduce ? 0.01 : 0.9, delay, ease: [0.2, 0.7, 0.2, 1] }}
    >
      <motion.div
        initial={reduce ? { scale: 1 } : { scale: 1.12 }}
        whileInView={{ scale: 1 }}
        viewport={{ once: true, margin: "-10%" }}
        transition={{ duration: reduce ? 0.01 : 1.1, delay, ease: [0.2, 0.7, 0.2, 1] }}
      >
        {children}
      </motion.div>
    </motion.div>
  );
}
