import { SectionLabel } from "@/components/home/section-label";
import { WaitlistCta } from "@/components/waitlist-cta";
import { ScrollReveal } from "@/components/motion/scroll-reveal";
import { StyleCollage } from "@/components/motion/style-collage";
import { highlightAhvi } from "@/lib/ahvi-text";

export function StyleSection() {
  return (
    <section id="style" className="border-t border-ink/10 bg-bg">
      <div className="mx-auto grid max-w-[1600px] items-center gap-10 px-5 py-10 sm:px-8 sm:py-20 lg:grid-cols-[0.85fr_1.15fr] lg:gap-16">
        <ScrollReveal>
          <SectionLabel label="STYLE" />
          <h2 className="mb-5 mt-5 font-condensed text-[clamp(38px,5.5vw,80px)] font-bold leading-[0.98]">
            Style.
          </h2>
          <p className="max-w-[52ch] text-[17px] font-medium leading-relaxed text-ink">
            Your personal AI stylist that helps you decide what to wear and how to style it.
          </p>
          <p className="mt-4 max-w-[52ch] text-[15.5px] leading-relaxed text-muted">
            {highlightAhvi(
              "AHVI gives personalised outfit suggestions based on your wardrobe, preferences, and occasion. It helps you create complete looks, choose matching colours, style your existing clothes, and discover new ways to wear what you already own."
            )}
          </p>
          <div className="mt-8">
            {/* <WaitlistCta /> */}
          </div>
        </ScrollReveal>
        <StyleCollage />
      </div>
    </section>
  );
}
