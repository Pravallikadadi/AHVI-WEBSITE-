"use client";
import { useRef, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";

/** Cursor-following wrapper for premium CTAs — the button pulls toward the pointer within its bounds. */
export function MagneticButton({ children, className, strength = 14 }: { children: React.ReactNode; className?: string; strength?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const reduce = useReducedMotion();

  const onMove = (e: React.MouseEvent) => {
    if (reduce || !ref.current) return;
    const r = ref.current.getBoundingClientRect();
    const x = ((e.clientX - r.left) / r.width - 0.5) * strength;
    const y = ((e.clientY - r.top) / r.height - 0.5) * strength;
    setPos({ x, y });
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={() => setPos({ x: 0, y: 0 })}
      animate={{ x: pos.x, y: pos.y }}
      transition={{ type: "spring", stiffness: 200, damping: 14, mass: 0.4 }}
      className={cn("inline-block", className)}
    >
      {children}
    </motion.div>
  );
}
