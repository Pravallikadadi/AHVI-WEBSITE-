"use client";
import { useRef, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { WaitlistCta } from "@/components/waitlist-cta";
import { TextReveal } from "@/components/motion/text-reveal";
import { HeroCarousel, type HeroSlide, type HeroCarouselHandle } from "@/components/motion/hero-carousel";
import { cn } from "@/lib/utils";

const heroSlides: HeroSlide[] = [
  {
    id: "overview",
    label: "Overview",
    caption: "Your wardrobe, your day, your plan — all in one assistant.",
    src: "/images/hero-app-showcase.png",
    alt: "The AHVI app — wardrobe, daily style, diet & fitness and skincare shown across phone screens",
  },
  {
    id: "style",
    label: "Style",
    caption: "Outfit boards, curated for every occasion.",
    src: "/images/style-boards-hero.png",
    alt: "AHVI Style boards — Minimal, Workwear, Dinner, Weekend and Travel looks",
  },
  {
    id: "prep",
    label: "Prep",
    caption: "Mood boards and packing checklists, ready before you go.",
    src: "/images/prep-module-hero.png",
    alt: "AHVI Prep & Plan — mood board and checklist for a weekend trip",
  },
  {
    id: "plan",
    label: "Plan",
    caption: "Routines, reminders and what's next — organised.",
    src: "/images/plan-module-hero.png",
    alt: "AHVI Plan module — fitness, diet, home & utilities, today's plan, meds and skincare",
  },
];

const TABS = ["style", "prep", "plan"] as const;

export function Hero() {
  const reduce = useReducedMotion();
  const carouselRef = useRef<HeroCarouselHandle>(null);
  const [activeSlide, setActiveSlide] = useState(0);

  return (
    <section className="relative overflow-hidden bg-bg text-ink">
      <div
        aria-hidden
        className="pointer-events-none absolute -top-40 left-1/2 h-[560px] w-[900px] -translate-x-1/2 rounded-full opacity-[0.06] blur-[110px]"
        style={{ background: "radial-gradient(circle, rgb(var(--color-ink)) 0%, transparent 70%)" }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.035] [background-image:linear-gradient(to_right,rgb(var(--color-ink))_1px,transparent_1px),linear-gradient(to_bottom,rgb(var(--color-ink))_1px,transparent_1px)]"
        style={{ maskImage: "linear-gradient(to bottom, black, transparent 75%)" }}
      />
      <div className="relative mx-auto grid max-w-[1600px] items-stretch gap-0 px-5 pb-0 pt-8 sm:px-8 sm:pt-10 lg:grid-cols-[0.9fr_1.3fr] lg:gap-10">
        <motion.div
          initial={reduce ? { opacity: 1 } : { opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: reduce ? 0.01 : 0.7 }}
          className="flex flex-col pb-14 sm:pb-20"
        >
          <div className="mb-8 flex items-center gap-6 text-[16px] font-bold tracking-[0.06em] sm:text-[19px]">
            {TABS.map((id) => {
              const index = heroSlides.findIndex((s) => s.id === id);
              const isActive = activeSlide === index;
              return (
                <button
                  key={id}
                  onClick={() => carouselRef.current?.goTo(index)}
                  aria-current={isActive}
                  className={cn(
                    "relative pb-1 transition-colors",
                    isActive ? "text-ink" : "text-ink/45 hover:text-ink"
                  )}
                >
                  {heroSlides[index].label}.
                  <span
                    className={cn(
                      "absolute inset-x-0 -bottom-0.5 h-[2px] origin-left bg-ink transition-transform duration-300 ease-out",
                      isActive ? "scale-x-100" : "scale-x-0"
                    )}
                  />
                </button>
              );
            })}
          </div>
          <h1 className="mb-7 font-condensed text-[clamp(46px,7vw,96px)] font-semibold leading-[0.94] tracking-tight text-ink">
            <TextReveal text="Your effortlessly" />
            <br />
            <TextReveal text="put-together day." delay={0.12} />
          </h1>
          <p className="mb-9 max-w-[42ch] text-[clamp(15px,1.1vw,17px)] leading-relaxed text-muted">
            AHVI reads your wardrobe, your schedule and your life — then decides what to wear, what to prepare and
            what&apos;s next, before you have to think about it.
          </p>
          <div className="flex flex-wrap items-center gap-6">
            <WaitlistCta />
            <a href="#style" className="text-[12.5px] tracking-[0.14em] text-muted underline-offset-4 transition-colors hover:text-ink hover:underline">
              Explore AHVI
            </a>
          </div>
        </motion.div>

        <motion.div
          initial={reduce ? { opacity: 1 } : { opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: reduce ? 0.01 : 0.8, delay: reduce ? 0 : 0.1 }}
          className="flex items-center pb-10 sm:pb-14"
        >
          <HeroCarousel slides={heroSlides} />
        </motion.div>
      </div>

    </section>
  );
}
