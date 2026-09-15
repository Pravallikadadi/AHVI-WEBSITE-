"use client";
import { motion, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";

/** Subtle premium lift/scale for cards on hover — used by BlogCard, feature tiles, style boards. */
export function AnimatedCard({ children, className }: { children: React.ReactNode; className?: string }) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      whileHover={reduce ? undefined : { y: -8, scale: 1.015, transition: { type: "spring", stiffness: 300, damping: 22, mass: 0.6 } }}
      className={cn(className)}
    >
      {children}
    </motion.div>
  );
}
