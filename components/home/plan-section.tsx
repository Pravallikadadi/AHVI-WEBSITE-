import { SectionLabel } from "@/components/home/section-label";
import { ModuleTabs } from "@/components/home/module-tabs";
import { planModules } from "@/lib/site-data";
import { WaitlistCta } from "@/components/waitlist-cta";
import { ScrollReveal } from "@/components/motion/scroll-reveal";
import { PlanStack } from "@/components/motion/plan-stack";

export function PlanSection() {
  return (
    <section className="border-t border-ink/10 bg-bg">
      <div className="mx-auto max-w-[1600px] px-5 py-14 sm:px-8 sm:py-20">
        <div className="grid items-center gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:gap-16">
          <ScrollReveal>
            <SectionLabel label="PLAN" />
            <h2 className="mb-5 mt-5 max-w-[14ch] font-condensed text-[clamp(34px,5vw,72px)] font-bold leading-[0.98]">
              Know what&apos;s next.
            </h2>
            <p className="mb-8 max-w-[46ch] text-[15.5px] leading-relaxed text-muted">
              Your outfits, plans, reminders and everyday tasks — organised in one clear place.
            </p>
            {/* <WaitlistCta /> */}
          </ScrollReveal>
          <PlanStack />
        </div>

        <div className="mt-14 sm:mt-20">
          <ModuleTabs items={planModules} />
        </div>
      </div>
    </section>
  );
}
