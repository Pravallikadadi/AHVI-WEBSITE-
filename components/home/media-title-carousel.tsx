"use client";
import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";

export type CarouselItem = {
  id: string;
  label: string;
  type: "image" | "video";
  src: string;
  alt: string;
};

const AUTOPLAY_MS = 4200;
const RESUME_AFTER_MS = 3000;

/** Shared by the Prep and Planner sections — clickable titles (with a moving active-underline),
    a single swipeable media view below, and synced pagination dots. Titles, media and dots always
    track the same active index, whether changed by click, swipe, drag-scroll, dot tap, or autoplay.
    Auto-advances gently, pausing on hover/touch and resuming after, and is fully disabled under
    prefers-reduced-motion. */
export function MediaTitleCarousel({ items }: { items: CarouselItem[] }) {
  const scrollerRef = useRef<HTMLDivElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const [inView, setInView] = useState(false);
  const reduce = useReducedMotion();
  const pausedRef = useRef(false);
  const resumeTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const el = scrollerRef.current;
    if (!el) return;
    const onScroll = () => {
      const width = el.clientWidth || 1;
      const index = Math.round(el.scrollLeft / width);
      setActive(Math.min(items.length - 1, Math.max(0, index)));
    };
    el.addEventListener("scroll", onScroll, { passive: true });
    return () => el.removeEventListener("scroll", onScroll);
  }, [items.length]);

  const goTo = (i: number) => {
    const el = scrollerRef.current;
    if (!el) return;
    el.scrollTo({ left: i * el.clientWidth, behavior: "smooth" });
  };

  // Only start autoplay once this carousel's section is actually on screen — not the instant the
  // page loads — and stop again the moment it scrolls out of view. A single threshold means the
  // callback only fires on real enter/exit crossings, not on every small scroll movement.
  useEffect(() => {
    const el = wrapperRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(([entry]) => setInView(entry?.isIntersecting ?? false), { threshold: 0.3 });
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (reduce || !inView) return;
    const timer = setInterval(() => {
      if (pausedRef.current) return;
      const el = scrollerRef.current;
      if (!el) return;
      const width = el.clientWidth || 1;
      const current = Math.round(el.scrollLeft / width);
      const atEnd = current >= items.length - 1;
      el.scrollTo({ left: atEnd ? 0 : (current + 1) * width, behavior: "smooth" });
    }, AUTOPLAY_MS);
    return () => clearInterval(timer);
  }, [reduce, items.length, inView]);

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
    <div ref={wrapperRef} className="lg:flex lg:h-full lg:flex-col" onMouseEnter={pause} onMouseLeave={scheduleResume}>
      <div className="scrollbar-hide -mx-5 flex flex-nowrap gap-x-7 overflow-x-auto border-b border-ink/10 px-5 pb-3 sm:mx-0 sm:gap-x-9 sm:px-0 lg:shrink-0">
        {items.map((it, i) => (
          <button
            key={it.id}
            type="button"
            onClick={() => {
              pause();
              goTo(i);
              scheduleResume();
            }}
            aria-current={i === active}
            className={cn(
              "relative shrink-0 whitespace-nowrap pb-2.5 text-[13px] font-bold tracking-[0.06em] transition-colors sm:text-[14px]",
              i === active ? "text-ink" : "text-ink/40 hover:text-ink/70"
            )}
          >
            {it.label}
            <span
              className={cn(
                "absolute inset-x-0 -bottom-[1px] h-[2px] origin-left bg-ink transition-transform duration-300 ease-out",
                i === active ? "scale-x-100" : "scale-x-0"
              )}
            />
          </button>
        ))}
      </div>

      <div
        ref={scrollerRef}
        className="scrollbar-hide mt-6 flex snap-x snap-mandatory overflow-x-auto rounded-lg lg:min-h-0 lg:flex-1"
        onPointerDown={pause}
        onPointerUp={scheduleResume}
        onTouchStart={pause}
        onTouchEnd={scheduleResume}
      >
        {items.map((it) => (
          <div key={it.id} className="relative aspect-[4/5] w-full shrink-0 snap-center overflow-hidden bg-bg lg:aspect-auto lg:h-full">
            {it.type === "video" ? (
              <video src={it.src} muted playsInline loop autoPlay controls className="h-full w-full object-contain" />
            ) : (
              <Image src={it.src} alt={it.alt} fill sizes="(min-width: 1024px) 45vw, 100vw" className="object-contain" />
            )}
          </div>
        ))}
      </div>

      <div className="mt-5 flex items-center justify-center gap-2 lg:shrink-0" role="tablist" aria-label="Carousel pagination">
        {items.map((it, i) => (
          <button
            key={it.id}
            role="tab"
            aria-selected={i === active}
            aria-label={`Show ${it.label}`}
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
