"use client";
import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "framer-motion";
import { ScrollReveal } from "@/components/motion/scroll-reveal";
import { AnimatedCard } from "@/components/motion/animated-card";
import { SparkCard } from "@/components/motion/spark-card";
import { highlightAhvi } from "@/lib/ahvi-text";
import { cn } from "@/lib/utils";

const AUTOPLAY_MS = 4200;
const RESUME_AFTER_MS = 3000;

/** Used only by DailyExperience ("A day with AHVI") — the gradient spark-border treatment is scoped
    here via SparkCard and never applied to Style Boards, the Homepage Style section, or any other card grid.
    A gently auto-advancing, swipeable carousel with pagination dots that track the active card. */
export function FeatureCardGrid({ items }: { items: { id: string; label: string; note: string }[] }) {
  const scrollerRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const reduce = useReducedMotion();
  const pausedRef = useRef(false);
  const resumeTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const el = scrollerRef.current;
    if (!el) return;
    const onScroll = () => {
      const card = el.children[0] as HTMLElement | undefined;
      if (!card) return;
      const gap = parseFloat(getComputedStyle(el).columnGap || "16") || 16;
      const step = card.getBoundingClientRect().width + gap;
      const index = Math.round(el.scrollLeft / step);
      setActive(Math.min(items.length - 1, Math.max(0, index)));
    };
    el.addEventListener("scroll", onScroll, { passive: true });
    return () => el.removeEventListener("scroll", onScroll);
  }, [items.length]);

  const goTo = (i: number) => {
    const el = scrollerRef.current;
    const card = el?.children[i] as HTMLElement | undefined;
    if (!el || !card) return;
    el.scrollTo({ left: card.offsetLeft - el.offsetLeft, behavior: "smooth" });
  };

  useEffect(() => {
    if (reduce) return;
    const timer = setInterval(() => {
      if (pausedRef.current) return;
      const el = scrollerRef.current;
      if (!el) return;
      const card = el.children[0] as HTMLElement | undefined;
      if (!card) return;
      const gap = parseFloat(getComputedStyle(el).columnGap || "16") || 16;
      const step = card.getBoundingClientRect().width + gap;
      const current = Math.round(el.scrollLeft / step);
      const atEnd = current >= items.length - 1;
      el.scrollTo({ left: atEnd ? 0 : (current + 1) * step, behavior: "smooth" });
    }, AUTOPLAY_MS);
    return () => clearInterval(timer);
  }, [reduce, items.length]);

  const pause = () => {
    pausedRef.current = true;
    if (resumeTimeout.current) clearTimeout(resumeTimeout.current);
  };
  const scheduleResume = () => {
    if (resumeTimeout.current) clearTimeout(resumeTimeout.current);
    resumeTimeout.current = setTimeout(() => {
      pausedRef.current = false;
    }, RESUME_AFTER_MS);
  };

  return (
    <div onMouseEnter={pause} onMouseLeave={scheduleResume}>
      <div
        ref={scrollerRef}
        className="scrollbar-hide -mx-5 flex flex-nowrap snap-x snap-proximity gap-4 overflow-x-auto px-5 pb-2 sm:-mx-8 sm:px-8"
        onPointerDown={pause}
        onPointerUp={scheduleResume}
        onTouchStart={pause}
        onTouchEnd={scheduleResume}
      >
        {items.map((m, i) => (
          <ScrollReveal
            key={m.id}
            delay={i * 0.05}
            className="w-[80%] max-w-[300px] shrink-0 snap-start sm:w-[280px] sm:max-w-none"
          >
            <AnimatedCard className="h-full">
              <SparkCard delay={i * 1.1} className="h-full p-6">
                <div className="font-condensed text-[19px] font-semibold">{m.label}</div>
                <p className="mt-2 text-[13.5px] leading-relaxed text-muted">{highlightAhvi(m.note)}</p>
              </SparkCard>
            </AnimatedCard>
          </ScrollReveal>
        ))}
      </div>

      <div className="mt-6 flex items-center justify-center gap-2" role="tablist" aria-label="A day with AHVI cards">
        {items.map((m, i) => (
          <button
            key={m.id}
            role="tab"
            aria-selected={i === active}
            aria-label={`Show ${m.label}`}
            onClick={() => {
              pause();
              goTo(i);
              scheduleResume();
            }}
            className={cn(
              "h-2 rounded-full transition-all duration-300",
              i === active ? "w-6 bg-ink" : "w-2 bg-ink/20 hover:bg-ink/40"
            )}
          />
        ))}
      </div>
    </div>
  );
}
