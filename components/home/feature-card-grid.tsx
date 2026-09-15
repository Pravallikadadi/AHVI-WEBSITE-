import { ScrollReveal } from "@/components/motion/scroll-reveal";
import { AnimatedCard } from "@/components/motion/animated-card";
import { SpotlightCard } from "@/components/motion/spotlight-card";

export function FeatureCardGrid({ items }: { items: { id: string; label: string; note: string }[] }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {items.map((m, i) => (
        <ScrollReveal key={m.id} delay={i * 0.05}>
          <AnimatedCard className="h-full border border-ink/10 bg-bg shadow-[0_1px_2px_rgba(0,0,0,0.04)] transition-shadow duration-300 hover:border-ink/20 hover:shadow-[0_16px_40px_rgba(0,0,0,0.08)]">
            <SpotlightCard className="h-full p-6">
              <div className="font-condensed text-[19px] font-semibold">{m.label}</div>
              <p className="mt-2 text-[13.5px] leading-relaxed text-muted">{m.note}</p>
            </SpotlightCard>
          </AnimatedCard>
        </ScrollReveal>
      ))}
    </div>
  );
}
