import { SectionLabel } from "@/components/home/section-label";
import { MediaTitleCarousel } from "@/components/home/media-title-carousel";
import { planModules } from "@/lib/site-data";
import { ScrollReveal } from "@/components/motion/scroll-reveal";

export function PlanSection() {
  return (
    <section className="border-t border-ink/10 bg-bg">
      <div className="mx-auto max-w-[1600px] px-5 py-16 sm:px-8 sm:py-24 lg:py-28">
        <div className="lg:grid lg:grid-cols-[0.95fr_1.05fr] lg:items-center lg:gap-12">
          <ScrollReveal className="max-w-[640px]">
            <SectionLabel label="THE PLANNER" />
            <h2 className="mb-5 mt-5 max-w-[14ch] font-condensed text-[clamp(38px,5.5vw,80px)] font-bold leading-[0.98]">
              Know what&apos;s next.
            </h2>
            <p className="mb-8 max-w-[46ch] text-[15.5px] leading-relaxed text-muted">
              Your outfits, plans, reminders and everyday tasks — organised in one clear place.
            </p>
          </ScrollReveal>

          <div className="mt-10 sm:mt-14 lg:mt-0 lg:max-w-[520px]">
            <MediaTitleCarousel items={planModules} />
          </div>
        </div>
      </div>
    </section>
  );
}
