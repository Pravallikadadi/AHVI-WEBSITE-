"use client";
import { useRef } from "react";
import { motion, useScroll, useTransform, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";

/** Shifts children at a different rate than the page scrolls, for depth — wrap hero art or section imagery. */
export function Parallax({
  children,
  className,
  offset = 60,
}: {
  children: React.ReactNode;
  className?: string;
  offset?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], [reduce ? 0 : -offset, reduce ? 0 : offset]);

  return (
    <div ref={ref} className={cn("will-change-transform", className)}>
      <motion.div style={{ y }}>{children}</motion.div>
    </div>
  );
}
