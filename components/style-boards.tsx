"use client";
import Image from "next/image";
import { useReducedMotion } from "framer-motion";
import { styleBoards } from "@/lib/site-data";
import { ScrollReveal } from "@/components/motion/scroll-reveal";
import { AnimatedCard } from "@/components/motion/animated-card";
import { ImageReveal } from "@/components/motion/image-reveal";
import { SpotlightCard } from "@/components/motion/spotlight-card";
import { AhviLogo } from "@/components/ahvi-logo";

export function StyleBoardsRail() {
  const reduce = useReducedMotion();
  return (
    <div className="scrollbar-hide flex flex-nowrap snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-2 sm:px-8">
      {styleBoards.map((b, i) => (
        <ScrollReveal
          key={b.name}
          delay={i * 0.07}
          className="w-[85%] max-w-[340px] shrink-0 snap-center sm:w-[260px] sm:max-w-none"
        >
          <AnimatedCard className="group h-full overflow-hidden border border-ink/10 bg-bg transition-shadow duration-300 hover:border-ink/20 hover:shadow-[0_20px_48px_rgba(0,0,0,0.1)]">
            <SpotlightCard className="flex h-full flex-col gap-2.5 p-4 sm:gap-3">
              <div className="flex items-center gap-2">
                <AhviLogo size={20} className="h-5 w-5 text-ink" />
                <span className="ahvi-wordmark ahvi-wordmark-light text-[15px] leading-none">AHVI</span>
              </div>

              <h3 className="font-condensed text-[19px] font-bold leading-none">{b.name}</h3>

              <p className="gradient-chip rounded-md px-3 py-2 text-[12px] font-semibold leading-snug sm:py-2.5 sm:text-[11.5px]">
                {b.subtitle}
              </p>

              <ImageReveal delay={i * 0.05}>
                <div className="relative aspect-[4/3] w-full overflow-hidden rounded-md bg-surface">
                  <Image
                    src={b.img}
                    alt={b.alt}
                    fill
                    sizes="(min-width: 1024px) 20vw, (min-width: 640px) 45vw, 80vw"
                    className={"h-full w-full object-contain transition-transform duration-700 ease-out" + (reduce ? "" : " group-hover:scale-[1.05]")}
                  />
                </div>
              </ImageReveal>

              <div className="gradient-chip rounded-md px-3 py-2 sm:py-2.5">
                <div className="text-[12.5px] font-bold text-ink sm:text-[12px]">Why this works</div>
                <p className="mt-1 text-[11.5px] leading-relaxed opacity-90 sm:text-[11px]">{b.why}</p>
              </div>
            </SpotlightCard>
          </AnimatedCard>
        </ScrollReveal>
      ))}
    </div>
  );
}
