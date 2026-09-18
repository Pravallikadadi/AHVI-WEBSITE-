"use client";
import { useState } from "react";
import { AnimatedCard } from "@/components/motion/animated-card";
import { SparkCard } from "@/components/motion/spark-card";
import { LetterHighlight } from "@/components/motion/letter-highlight";
import { cn } from "@/lib/utils";

export function HowItWorksCard({
  n,
  title,
  body,
  delay,
  active,
}: {
  n: string;
  title: string;
  body: string;
  delay: number;
  /** When set (e.g. by an auto-advancing sequence), drives the highlighted/dimmed look instead of pointer hover. Omit to keep the card's normal hover-only behavior. */
  active?: boolean;
}) {
  const [hovered, setHovered] = useState(false);
  const highlighted = active === undefined ? hovered : active;

  return (
    <div
      className={cn("h-full transition-opacity duration-500", active === false && "opacity-55")}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <AnimatedCard className="h-full">
        <SparkCard delay={delay} active={active === undefined ? undefined : active} className="h-full p-6">
          <div className="spark-card__number font-condensed text-[15px] font-bold tracking-[0.06em]">{n}</div>
          <div className="mt-3 font-condensed text-[19px] font-bold leading-tight">{title}</div>
          <p className="mt-2.5 text-[13.5px] leading-relaxed">
            <LetterHighlight text={body} active={highlighted} />
          </p>
        </SparkCard>
      </AnimatedCard>
    </div>
  );
}
