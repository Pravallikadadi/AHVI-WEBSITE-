"use client";
import { useEffect, useRef } from "react";
import { useReducedMotion } from "framer-motion";
import { Palette, PersonStanding, Sparkles, ScanFace, Scan, type LucideIcon } from "lucide-react";
import { personalizationDims } from "@/lib/site-data";
import { AnimatedCard } from "@/components/motion/animated-card";
import { SparkCard } from "@/components/motion/spark-card";

/** One icon per personalization dimension, keyed by its label — decorative, since the label text beside it already carries the meaning. */
const DIMENSION_ICONS: Record<string, LucideIcon> = {
  "Skin Tone": Palette,
  "Body Shape": PersonStanding,
  "Style Persona": Sparkles,
  "Face Scan": ScanFace,
  "Body Scan": Scan,
};

const AUTO_ADVANCE_MS = 3800;
const RESUME_AFTER_MS = 3000;

function DimensionCard({ d, i }: { d: (typeof personalizationDims)[number]; i: number }) {
  const Icon = DIMENSION_ICONS[d.label];
  return (
    <SparkCard delay={i * 1.1} className="flex h-full flex-col gap-2.5 p-6">
      <div className="flex items-center justify-between gap-2">
        <span className="spark-card__number text-[10.5px] font-bold tracking-[0.2em]">{d.n}</span>
        {Icon && <Icon aria-hidden="true" size={20} strokeWidth={1.5} className="shrink-0 text-ink/70" />}
      </div>
      <span className="mt-1 font-condensed text-[clamp(19px,1.8vw,22px)] font-semibold">{d.label}</span>
      <span className="text-[13.5px] font-medium leading-relaxed text-ink">{d.note}</span>
      <span className="text-[13px] leading-relaxed text-muted">{d.detail}</span>
    </SparkCard>
  );
}

export function PersonalizationGrid() {
  const reduce = useReducedMotion();
  const scrollerRef = useRef<HTMLDivElement>(null);
  const pausedRef = useRef(false);
  const resumeTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);
  const n = personalizationDims.length;

  useEffect(() => {
    if (reduce) return;
    const el = scrollerRef.current;
    if (!el) return;
    const timer = setInterval(() => {
      if (pausedRef.current || el.clientWidth === 0) return;
      const cardWidth = el.children[0]?.getBoundingClientRect().width ?? el.clientWidth;
      const gap = 16;
      const step = cardWidth + gap;
      const atEnd = el.scrollLeft + el.clientWidth >= el.scrollWidth - 4;
      el.scrollTo({ left: atEnd ? 0 : el.scrollLeft + step, behavior: "smooth" });
    }, AUTO_ADVANCE_MS);
    return () => clearInterval(timer);
  }, [reduce, n]);

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
    <>
      {/* Mobile: auto-advancing, swipeable carousel */}
      <div
        ref={scrollerRef}
        className="scrollbar-hide flex snap-x snap-mandatory gap-4 overflow-x-auto pb-2 sm:hidden"
        onPointerDown={pause}
        onPointerUp={scheduleResume}
        onTouchStart={pause}
        onTouchEnd={scheduleResume}
      >
        {personalizationDims.map((d, i) => (
          <div key={d.n} className="w-[80%] max-w-[300px] shrink-0 snap-center">
            <AnimatedCard className="h-full">
              <DimensionCard d={d} i={i} />
            </AnimatedCard>
          </div>
        ))}
      </div>

      {/* Tablet/desktop: unchanged static grid */}
      <div className="hidden gap-4 sm:grid sm:gap-5" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 220px), 1fr))" }}>
        {personalizationDims.map((d, i) => (
          <AnimatedCard key={d.n} className="h-full">
            <DimensionCard d={d} i={i} />
          </AnimatedCard>
        ))}
      </div>
    </>
  );
}
