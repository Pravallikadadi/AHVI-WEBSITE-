import { personalizationDims } from "@/lib/site-data";
import { AnimatedCard } from "@/components/motion/animated-card";
import { SparkCard } from "@/components/motion/spark-card";

export function PersonalizationGrid() {
  return (
    <div className="grid gap-4 sm:gap-5" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 220px), 1fr))" }}>
      {personalizationDims.map((d, i) => (
        <AnimatedCard key={d.n} className="h-full">
          <SparkCard delay={i * 1.1} className="flex h-full flex-col gap-2.5 p-6">
            <span className="spark-card__number text-[10.5px] font-bold tracking-[0.2em]">{d.n}</span>
            <span className="mt-1 font-condensed text-[clamp(19px,1.8vw,22px)] font-semibold">{d.label}</span>
            <span className="text-[13.5px] font-medium leading-relaxed text-ink">{d.note}</span>
            <span className="text-[13px] leading-relaxed text-muted">{d.detail}</span>
          </SparkCard>
        </AnimatedCard>
      ))}
    </div>
  );
}
