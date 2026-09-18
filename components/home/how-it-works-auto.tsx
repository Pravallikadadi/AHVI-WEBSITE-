"use client";
import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "framer-motion";
import { HowItWorksCard } from "@/components/home/how-it-works-card";
import { HowItWorksVideo } from "@/components/home/how-it-works-video";
import { cn } from "@/lib/utils";

export type HowItWorksStep = { n: string; title: string; body: string; video: string; videoExists: boolean };

const INTERVAL_MS = 5000;

/** Desktop (lg+): auto-advancing pairing of the four "How AHVI works" cards (left) with a single
    active video area (right) — no click required. One card is highlighted at a time; its matching
    video plays; both move to the next step together on a timer (or sooner if the active video ends
    first), looping continuously. Pauses on hover/focus, resumes on leave, and stays static under
    prefers-reduced-motion.
    Mobile (below lg): no carousel — every card is shown with its own video directly beneath it,
    stacked vertically in order, nothing auto-advances or swipes. */
export function HowItWorksAuto({ steps }: { steps: HowItWorksStep[] }) {
  const [active, setActive] = useState(0);
  const reduce = useReducedMotion();
  const pausedRef = useRef(false);
  const desktopRef = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);

  const current = steps[active];

  // Only start the desktop auto-advance once this section is actually on screen — not the
  // moment the page loads — and stop it again the moment it scrolls out of view.
  useEffect(() => {
    const el = desktopRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(([entry]) => setInView(entry?.isIntersecting ?? false), { threshold: 0.3 });
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    // Steps with a real uploaded video advance only when that video finishes playing
    // (via onEnded below) — never on a fixed timer, so it always plays to its full
    // original duration. The timer only drives steps still showing the placeholder.
    if (reduce || current.videoExists || !inView) return;
    const timer = setInterval(() => {
      if (pausedRef.current) return;
      setActive((i) => (i + 1) % steps.length);
    }, INTERVAL_MS);
    return () => clearInterval(timer);
  }, [reduce, steps.length, active, current.videoExists, inView]);

  const pause = () => {
    pausedRef.current = true;
  };
  const resume = () => {
    pausedRef.current = false;
  };
  const advance = () => setActive((i) => (i + 1) % steps.length);

  return (
    <>
      {/* Mobile: each card followed directly by its own video, stacked vertically — no carousel,
          no swipe, no dots, nothing auto-advances. */}
      <div className="flex flex-col gap-12 lg:hidden">
        {steps.map((s, i) => (
          <div key={s.n} className="flex flex-col gap-4">
            <HowItWorksCard n={s.n} title={s.title} body={s.body} delay={i * 1.1} />
            <HowItWorksVideo src={s.video} label={s.title} exists={s.videoExists} />
          </div>
        ))}
      </div>

      {/* Desktop: auto-advancing single video paired with the highlighted card. */}
      <div
        ref={desktopRef}
        className="hidden lg:grid lg:grid-cols-2 lg:items-start lg:gap-12"
        onMouseEnter={pause}
        onMouseLeave={resume}
        onFocus={pause}
        onBlur={resume}
      >
        <div className="flex flex-col gap-3">
          {steps.map((s, i) => (
            <HowItWorksCard key={s.n} n={s.n} title={s.title} body={s.body} delay={i * 1.1} active={i === active} />
          ))}
        </div>

        <div className="lg:sticky lg:top-[100px]">
          <HowItWorksVideo src={current.video} label={current.title} exists={current.videoExists} onEnded={advance} />
          <div className="mt-4 flex items-center justify-center gap-2" role="tablist" aria-label="How AHVI works steps">
            {steps.map((s, i) => (
              <button
                key={s.n}
                type="button"
                role="tab"
                aria-selected={i === active}
                aria-label={`Show ${s.title}`}
                onClick={() => setActive(i)}
                className={cn("h-2 rounded-full transition-all duration-300", i === active ? "w-6 bg-ink" : "w-2 bg-ink/20 hover:bg-ink/40")}
              />
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
