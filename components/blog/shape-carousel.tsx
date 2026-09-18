"use client";
import { useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Photo } from "@/components/media/photo";
import { cn } from "@/lib/utils";

export type ShapeCarouselItem = { label: string; image: string };

/** A 5-card swipeable comparison carousel — equal-sized cards, arrow navigation, pagination
    dots and native touch-scroll swipe. Used on posts (like the body shape guide) that need a
    dedicated visual comparison grid instead of the standard interleaved content images. */
export function ShapeCarousel({ title, items, ratio = "3/4" }: { title: string; items: ShapeCarouselItem[]; ratio?: string }) {
  const scrollerRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);

  useEffect(() => {
    const el = scrollerRef.current;
    if (!el) return;
    const onScroll = () => {
      const cardWidth = el.firstElementChild ? (el.firstElementChild as HTMLElement).offsetWidth + 12 : el.clientWidth;
      const index = Math.round(el.scrollLeft / cardWidth);
      setActive(Math.min(items.length - 1, Math.max(0, index)));
    };
    el.addEventListener("scroll", onScroll, { passive: true });
    return () => el.removeEventListener("scroll", onScroll);
  }, [items.length]);

  const goTo = (i: number) => {
    const el = scrollerRef.current;
    if (!el) return;
    const cardWidth = el.firstElementChild ? (el.firstElementChild as HTMLElement).offsetWidth + 12 : el.clientWidth;
    el.scrollTo({ left: i * cardWidth, behavior: "smooth" });
  };

  return (
    <div className="not-prose my-9">
      <div className="mb-4 flex items-center justify-between">
        <div className="text-[11px] font-bold uppercase tracking-[0.12em] text-muted2">{title}</div>
        <div className="hidden gap-1.5 sm:flex">
          <button
            type="button"
            aria-label="Previous"
            disabled={active === 0}
            onClick={() => goTo(active - 1)}
            className="flex h-8 w-8 items-center justify-center border border-ink/15 text-ink transition-colors hover:border-ink/40 disabled:opacity-30"
          >
            <ChevronLeft size={15} />
          </button>
          <button
            type="button"
            aria-label="Next"
            disabled={active === items.length - 1}
            onClick={() => goTo(active + 1)}
            className="flex h-8 w-8 items-center justify-center border border-ink/15 text-ink transition-colors hover:border-ink/40 disabled:opacity-30"
          >
            <ChevronRight size={15} />
          </button>
        </div>
      </div>

      <div ref={scrollerRef} className="scrollbar-hide -mx-5 flex snap-x snap-mandatory gap-3 overflow-x-auto px-5 sm:mx-0 sm:px-0">
        {items.map((it) => (
          <div key={it.label} className="w-[62%] shrink-0 snap-start sm:w-[220px]">
            <Photo src={it.image} alt={`${it.label} body shape`} ratio={ratio} fit="contain" className="border border-ink/10 bg-bg" />
            <div className="mt-2.5 text-[13px] font-medium tracking-[0.02em] text-ink">{it.label}</div>
          </div>
        ))}
      </div>

      <div className="mt-4 flex items-center justify-center gap-2" role="tablist" aria-label={`${title} pagination`}>
        {items.map((it, i) => (
          <button
            key={it.label}
            role="tab"
            aria-selected={i === active}
            aria-label={`Show ${it.label}`}
            onClick={() => goTo(i)}
            className={cn("h-2 rounded-full transition-all duration-300", i === active ? "w-6 bg-ink" : "w-2 bg-ink/20 hover:bg-ink/40")}
          />
        ))}
      </div>
    </div>
  );
}
