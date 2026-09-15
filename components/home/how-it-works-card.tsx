"use client";
import { useState } from "react";
import { AnimatedCard } from "@/components/motion/animated-card";
import { SparkCard } from "@/components/motion/spark-card";
import { LetterHighlight } from "@/components/motion/letter-highlight";

export function HowItWorksCard({ n, title, body, delay }: { n: string; title: string; body: string; delay: number }) {
  const [hovered, setHovered] = useState(false);

  return (
    <div className="h-full" onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}>
      <AnimatedCard className="h-full">
        <SparkCard delay={delay} className="h-full p-6">
          <div className="spark-card__number font-condensed text-[15px] font-bold tracking-[0.06em]">{n}</div>
          <div className="mt-3 font-condensed text-[19px] font-bold leading-tight">{title}</div>
          <p className="mt-2.5 text-[13.5px] leading-relaxed">
            <LetterHighlight text={body} active={hovered} />
          </p>
        </SparkCard>
      </AnimatedCard>
    </div>
  );
}
