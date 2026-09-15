import { SectionLabel } from "@/components/home/section-label";
import { ModuleTabs } from "@/components/home/module-tabs";
import { TodaysPrep } from "@/components/todays-prep";
import { prepModules } from "@/lib/site-data";
import { WaitlistCta } from "@/components/waitlist-cta";
import { ScrollReveal } from "@/components/motion/scroll-reveal";

export function PrepSection() {
  return (
    <section className="border-t border-ink/10 bg-bg">
      <div className="mx-auto max-w-[1600px] px-5 py-14 sm:px-8 sm:py-20">
        <div className="grid gap-10 lg:grid-cols-[1fr_1fr] lg:gap-16">
          <ScrollReveal>
            <SectionLabel label="PREP" />
            <h2 className="mb-5 mt-5 max-w-[14ch] font-condensed text-[clamp(34px,5vw,72px)] font-bold leading-[0.98]">
              Be ready for what's next.
            </h2>
            <p className="mb-8 max-w-[46ch] text-[15.5px] leading-relaxed text-muted">
              Prepare outfits, packing lists and everything you need before your day or occasion arrives.
            </p>
            {/* <WaitlistCta /> */}
          </ScrollReveal>
          <ScrollReveal delay={0.1}>
            <TodaysPrep />
          </ScrollReveal>
        </div>

        <div className="mt-14 sm:mt-20">
          <ModuleTabs items={prepModules} />
        </div>
      </div>
    </section>
  );
}
