import type { Metadata } from "next";
import Link from "next/link";
import { MarketingShell } from "@/components/shells/marketing-shell";
import { TextReveal } from "@/components/motion/text-reveal";
import { ScrollReveal } from "@/components/motion/scroll-reveal";
import { PricingCard } from "@/components/pricing/pricing-card";
import { CouponInput } from "@/components/pricing/coupon-input";
import { FeatureCarousel } from "@/components/pricing/feature-carousel";
import { AhviCtaBlock } from "@/components/ahvi-cta-block";
import { highlightAhvi } from "@/lib/ahvi-text";

export const metadata: Metadata = {
  title: "Pricing",
  description: "AHVI Premium — 7 days free, then ₹499/month. Style, planning, wellness and everyday intelligence in one membership.",
};

export default function PricingPage() {
  return (
    <MarketingShell hideFinalCta>
      <section className="mx-auto max-w-[720px] px-5 pb-3 pt-16 text-center sm:px-8 sm:pt-24">
        <div className="mb-4 text-[11px] tracking-[0.26em] text-muted">{highlightAhvi("02 / PLAN — AHVI Premium")}</div>
        <h1 className="mb-4.5 font-condensed text-[clamp(32px,4.6vw,52px)] font-semibold leading-tight">
          <TextReveal text="Your Personal AI," /><br />
          <TextReveal text="Made More Powerful." delay={0.1} />
        </h1>
        <p className="mx-auto max-w-[46ch] text-[15px] leading-relaxed text-muted">
          {highlightAhvi("Unlock the complete AHVI experience with smarter styling, planning, wellness and everyday intelligence.")}
        </p>
      </section>

      <section className="px-5 py-10 sm:px-8 sm:py-14">
        <PricingCard />
        <div className="mx-auto mt-3 max-w-[520px] text-center text-[11px] tracking-[0.14em] text-muted2">
          One membership · 10+ AI-powered experiences
        </div>
        <div className="mt-6">
          <CouponInput />
        </div>
      </section>

      <section className="mx-auto max-w-[1100px] px-5 py-10 sm:px-8 sm:py-14">
        <ScrollReveal>
          <FeatureCarousel />
        </ScrollReveal>
      </section>

      <AhviCtaBlock />
      <div className="bg-ink pb-16 sm:pb-20">
        <div className="mx-auto flex max-w-[560px] justify-center gap-4 text-[11.5px] text-bg/50">
          <Link href="/termsofservice" className="transition-colors hover:text-bg">Terms</Link>
          <span>·</span>
          <Link href="/privacypolicy" className="transition-colors hover:text-bg">Privacy Policy</Link>
        </div>
      </div>
    </MarketingShell>
  );
}
