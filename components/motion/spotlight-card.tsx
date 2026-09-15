"use client";
import { useRef } from "react";
import { motion, useMotionValue, useMotionTemplate } from "framer-motion";
import { cn } from "@/lib/utils";

/** Cursor-reactive glow that tracks the pointer across a card's surface — the hover treatment Runway-style sites use instead of a flat highlight. */
export function SpotlightCard({
  children,
  className,
  variant = "light",
}: {
  children: React.ReactNode;
  className?: string;
  variant?: "light" | "dark";
}) {
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(-999);
  const y = useMotionValue(-999);

  function onMove(e: React.MouseEvent<HTMLDivElement>) {
    const r = ref.current?.getBoundingClientRect();
    if (!r) return;
    x.set(e.clientX - r.left);
    y.set(e.clientY - r.top);
  }

  const glow = variant === "dark" ? "rgba(255,255,255,0.12)" : "rgba(10,10,10,0.07)";
  const background = useMotionTemplate`radial-gradient(280px circle at ${x}px ${y}px, ${glow}, transparent 70%)`;

  return (
    <div
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={() => {
        x.set(-999);
        y.set(-999);
      }}
      className={cn("group/spotlight relative isolate overflow-hidden", className)}
    >
      <motion.div
        aria-hidden
        className="pointer-events-none absolute inset-0 z-10 opacity-0 transition-opacity duration-500 group-hover/spotlight:opacity-100"
        style={{ background }}
      />
      {children}
    </div>
  );
}
