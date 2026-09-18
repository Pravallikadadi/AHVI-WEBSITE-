import { WaitlistCta } from "@/components/waitlist-cta";
import { ScrollReveal } from "@/components/motion/scroll-reveal";
import { SpotlightCard } from "@/components/motion/spotlight-card";

export function AhviCtaBlock() {
  return (
    <section className="relative overflow-hidden bg-ink text-bg">
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-1/2 h-[520px] w-[820px] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-[0.09] blur-[120px]"
        style={{ background: "radial-gradient(circle, rgb(var(--color-bg)) 0%, transparent 70%)" }}
      />
      <SpotlightCard variant="dark" className="relative">
        <div className="mx-auto max-w-[900px] px-5 py-14 text-center sm:px-8 sm:py-28">
          <ScrollReveal>
            <div className="ahvi-wordmark ahvi-wordmark-strong text-[18px] tracking-[0.28em] text-bg sm:text-[20px]">AHVI</div>
            <h2 className="mx-auto mb-3 mt-5 max-w-[20ch] font-condensed text-[clamp(34px,5.6vw,64px)] font-bold leading-[0.98]">
              Style. Prep. Plan.
            </h2>
            <p className="mx-auto mb-9 max-w-[46ch] text-[15.5px] leading-relaxed text-bg/60">
              Make every day feel a little more put-together.
            </p>
            <WaitlistCta inverted />
          </ScrollReveal>
        </div>
      </SpotlightCard>
    </section>
  );
}
