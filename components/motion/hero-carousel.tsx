"use client";
import { forwardRef, useCallback, useEffect, useImperativeHandle, useRef, useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

export type HeroSlide = {
  id: string;
  label: string;
  caption: string;
  src: string;
  alt: string;
};

export type HeroCarouselHandle = { goTo: (index: number) => void };

const AUTOPLAY_MS = 5200;

function wrap(index: number, length: number) {
  return ((index % length) + length) % length;
}

/** Coverflow-style carousel — active slide centered and glowing, neighbours peeking to the sides with a 3D tilt. */
export const HeroCarousel = forwardRef<HeroCarouselHandle, { slides: HeroSlide[]; onSlideChange?: (index: number) => void }>(
  function HeroCarousel({ slides, onSlideChange }, ref) {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const reduce = useReducedMotion();
  const length = slides.length;
  const timer = useRef<ReturnType<typeof setInterval> | null>(null);

  const goTo = useCallback((i: number) => setActive(wrap(i, length)), [length]);
  const next = useCallback(() => setActive((a) => wrap(a + 1, length)), [length]);
  const prev = useCallback(() => setActive((a) => wrap(a - 1, length)), [length]);

  useImperativeHandle(ref, () => ({ goTo }), [goTo]);

  useEffect(() => {
    onSlideChange?.(active);
  }, [active, onSlideChange]);

  useEffect(() => {
    if (reduce || paused) return;
    timer.current = setInterval(next, AUTOPLAY_MS);
    return () => {
      if (timer.current) clearInterval(timer.current);
    };
  }, [paused, reduce, next]);

  return (
    <div
      className="relative w-full select-none"
      role="region"
      aria-roledescription="carousel"
      aria-label="AHVI app showcase"
      tabIndex={0}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onKeyDown={(e) => {
        if (e.key === "ArrowRight") next();
        if (e.key === "ArrowLeft") prev();
      }}
    >
      <div
        className="relative aspect-[16/11] w-full overflow-hidden"
        style={{ perspective: 1400 }}
      >
        {slides.map((s, i) => {
          let diff = i - active;
          if (diff > length / 2) diff -= length;
          if (diff < -length / 2) diff += length;
          const abs = Math.abs(diff);
          const isActive = diff === 0;

          const clickable = !isActive && abs <= 1;

          return (
            <motion.div
              key={s.id}
              className={cn("absolute left-1/2 top-0 h-full w-[72%]", clickable && "cursor-pointer")}
              style={{ zIndex: 20 - abs, transformStyle: "preserve-3d" }}
              animate={{
                x: reduce ? "-50%" : `calc(-50% + ${diff * 62}%)`,
                scale: reduce ? 1 : isActive ? 1 : abs === 1 ? 0.66 : 0.55,
                opacity: reduce ? (isActive ? 1 : 0) : abs > 1 ? 0 : isActive ? 1 : 0.45,
                rotateY: reduce ? 0 : diff * -14,
                filter: isActive ? "blur(0px)" : "blur(6px)",
              }}
              transition={{ type: "spring", stiffness: 220, damping: 30, mass: 0.9 }}
              onClick={clickable ? () => goTo(i) : undefined}
              role={clickable ? "button" : undefined}
              tabIndex={clickable ? 0 : undefined}
              aria-label={clickable ? `Show ${s.label}` : undefined}
              aria-hidden={abs > 1}
              onKeyDown={
                clickable
                  ? (e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        goTo(i);
                      }
                    }
                  : undefined
              }
            >
              <div
                className="relative h-full w-full overflow-hidden rounded-sm"
                style={{
                  background:
                    "linear-gradient(135deg, rgb(var(--brand-from) / 0.16), rgb(var(--brand-via) / 0.1), rgb(var(--brand-to) / 0.16))",
                }}
              >
                <Image
                  src={s.src}
                  alt={s.alt}
                  fill
                  sizes="(min-width: 1024px) 55vw, 90vw"
                  priority={isActive}
                  className="object-contain p-4 sm:p-6"
                />
              </div>
            </motion.div>
          );
        })}
      </div>

      <div className="mt-7 flex items-center justify-between gap-6">
        <AnimatePresence mode="wait">
          <motion.p
            key={slides[active].id}
            initial={reduce ? { opacity: 1 } : { opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reduce ? { opacity: 1 } : { opacity: 0, y: -6 }}
            transition={{ duration: reduce ? 0.01 : 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="text-[13px] leading-relaxed text-muted"
          >
            {slides[active].caption}
          </motion.p>
        </AnimatePresence>

        <div className="flex shrink-0 items-center gap-2">
          <button
            aria-label="Previous slide"
            onClick={prev}
            className="grid h-9 w-9 place-items-center border border-ink/15 text-ink transition-colors duration-300 hover:border-ink hover:bg-ink hover:text-bg"
          >
            <ChevronLeft size={16} />
          </button>
          <button
            aria-label="Next slide"
            onClick={next}
            className="grid h-9 w-9 place-items-center border border-ink/15 text-ink transition-colors duration-300 hover:border-ink hover:bg-ink hover:text-bg"
          >
            <ChevronRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
});
