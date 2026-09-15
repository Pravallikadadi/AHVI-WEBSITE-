import { SectionLabel } from "@/components/home/section-label";
import { FeatureCardGrid } from "@/components/home/feature-card-grid";
import { ScrollReveal } from "@/components/motion/scroll-reveal";

const ROWS = [
  { id: "01", label: "What to wear", note: "Polished. Comfortable. Effortlessly you — an outfit chosen for today's mobility, weather and meetings." },
  { id: "02", label: "What to eat", note: "A meal plan started before you've thought about lunch." },
  { id: "03", label: "What to do", note: "Care routines and small tasks, surfaced only when they're due." },
  { id: "04", label: "What to prepare", note: "The week ahead — outfits, meals and schedule — sorted in one plan." },
  { id: "05", label: "What's next", note: "Today's plan, read the moment you open AHVI." },
];

export function DailyExperience() {
  return (
    <section className="border-t border-ink/10 bg-surface">
      <div className="mx-auto max-w-[1600px] px-5 py-20 sm:px-8 sm:py-28">
        <ScrollReveal className="mb-12 max-w-[640px]">
          <SectionLabel label="A day with AHVI" />
          <h2 className="mb-4 mt-4 font-condensed text-[clamp(30px,4vw,50px)] font-semibold leading-tight">
            Good morning. Here&apos;s your day.
          </h2>
          <p className="text-[15.5px] leading-relaxed text-muted">
            One greeting, read against your mobility, the weather and today&apos;s meetings — then everything else
            falls into place.
          </p>
        </ScrollReveal>
        <FeatureCardGrid items={ROWS} />
      </div>
    </section>
  );
}
