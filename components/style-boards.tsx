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
    <div className="grid grid-cols-1 gap-3 px-5 sm:grid-cols-2 sm:gap-4 sm:px-8 lg:grid-cols-5">
      {styleBoards.map((b, i) => (
        <ScrollReveal key={b.name} delay={i * 0.07}>
          <AnimatedCard className="group h-full overflow-hidden border border-ink/10 bg-bg transition-shadow duration-300 hover:border-ink/20 hover:shadow-[0_20px_48px_rgba(0,0,0,0.1)]">
            <SpotlightCard className="flex h-full flex-col gap-3 p-4">
              <div className="flex items-center gap-1.5">
                <AhviLogo size={14} />
                <span className="ahvi-wordmark text-[11px] leading-none">AHVI</span>
              </div>

              <h3 className="font-condensed text-[19px] font-bold leading-none">{b.name}</h3>

              <p className="gradient-chip rounded-md px-3 py-2.5 text-[11.5px] font-semibold leading-snug">
                {b.subtitle}
              </p>

              <ImageReveal delay={i * 0.05}>
                <div className="relative overflow-hidden rounded-md bg-surface" style={{ aspectRatio: "1122/710" }}>
                  <Image
                    src={b.img}
                    alt={b.alt}
                    fill
                    sizes="(min-width: 1024px) 20vw, (min-width: 640px) 45vw, 90vw"
                    className={"object-cover transition-transform duration-700 ease-out" + (reduce ? "" : " group-hover:scale-[1.05]")}
                  />
                </div>
              </ImageReveal>

              <div className="gradient-chip rounded-md px-3 py-2.5">
                <div className="text-[12px] font-bold text-ink">Why this works</div>
                <p className="mt-1 text-[11px] leading-relaxed opacity-90">{b.why}</p>
              </div>
            </SpotlightCard>
          </AnimatedCard>
        </ScrollReveal>
      ))}
    </div>
  );
}
