"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import { styleBoards } from "@/lib/site-data";

const CYCLE_MS = 3000;

type Layout = {
  top: string;
  left: string;
  width: string;
  rotate: number;
  z: number;
  from: { x: number; y: number; rotate: number };
};

// Resting position/rotation approximates the original scattered-collage artwork; `from` is where
// each card flies in from — a different direction and spin per card so they converge, not slide.
const LAYOUT: Layout[] = [
  { top: "24%", left: "0%", width: "34%", rotate: -7, z: 10, from: { x: -280, y: 70, rotate: -150 } },
  { top: "0%", left: "21%", width: "34%", rotate: -3, z: 20, from: { x: -180, y: -240, rotate: 140 } },
  { top: "0%", left: "43%", width: "30%", rotate: 3, z: 30, from: { x: 220, y: -260, rotate: -170 } },
  { top: "9%", left: "65%", width: "32%", rotate: 5, z: 15, from: { x: 320, y: 110, rotate: 190 } },
  { top: "48%", left: "37%", width: "26%", rotate: -4, z: 40, from: { x: 0, y: 300, rotate: -210 } },
];

/** Scattered phone-card collage — each card flips/rotates in from a different direction, re-triggering on a loop. */
export function StyleCollage() {
  const reduce = useReducedMotion();
  const [cycle, setCycle] = useState(0);

  useEffect(() => {
    if (reduce) return;
    const id = setInterval(() => setCycle((c) => c + 1), CYCLE_MS);
    return () => clearInterval(id);
  }, [reduce]);

  return (
    <div className="relative mx-auto aspect-[16/10] w-full max-w-[820px] overflow-hidden">
      {styleBoards.map((b, i) => {
        const l = LAYOUT[i % LAYOUT.length];
        return (
          <motion.div
            key={`${b.name}-${cycle}`}
            className="absolute overflow-hidden rounded-2xl border border-ink/10 bg-bg shadow-[0_24px_60px_rgba(10,10,10,0.18)]"
            style={{ top: l.top, left: l.left, width: l.width, zIndex: l.z }}
            initial={
              reduce
                ? { opacity: 1, x: 0, y: 0, rotate: l.rotate, scale: 1 }
                : { opacity: 0, x: l.from.x, y: l.from.y, rotate: l.from.rotate, scale: 0.45 }
            }
            animate={{ opacity: 1, x: 0, y: 0, rotate: l.rotate, scale: 1 }}
            transition={{ type: "spring", stiffness: 95, damping: 15, mass: 0.9, delay: reduce ? 0 : i * 0.1 }}
          >
            <div className="flex items-center gap-2 px-3 pt-3">
              <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full border border-ink/15">
                <ArrowLeft size={12} />
              </span>
              <div className="min-w-0">
                <div className="truncate font-condensed text-[13px] font-bold leading-none">{b.name}</div>
                <div className="truncate text-[9.5px] leading-tight text-muted">{b.subtitle}</div>
              </div>
            </div>
            <div className="relative mt-2 aspect-[1122/710] w-full px-2 pb-2">
              <Image
                src={b.img}
                alt={b.alt}
                fill
                sizes="(min-width: 1024px) 22vw, 40vw"
                className="rounded-lg object-cover"
              />
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
