"use client";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { MagneticButton } from "@/components/motion/magnetic-button";
import { ScrollReveal } from "@/components/motion/scroll-reveal";
import { pricingConfig } from "@/lib/pricing-data";

export function PricingCard() {
  const { currency, originalPrice, offerPrice, trialDays, billingPeriod } = pricingConfig;
  return (
    <ScrollReveal>
      <div className="mx-auto max-w-[520px] border border-bg/15 bg-ink p-8 text-bg sm:p-10">
        <span className="mb-5 inline-flex w-fit items-center border border-goldsoft/50 px-3.5 py-1 text-[10.5px] tracking-[0.16em] text-goldsoft">
          Limited time offer
        </span>
        <div className="mb-1.5 text-[14px] text-bg/70">
          First {trialDays} days FREE, then
        </div>
        <div className="mb-6 flex items-baseline gap-3">
          <span className="text-[22px] text-bg/45 line-through">
            {currency}{originalPrice}
          </span>
          <span className="font-condensed text-[clamp(38px,5vw,52px)] font-semibold text-goldsoft">
            {currency}{offerPrice}
          </span>
          <span className="text-[14px] text-bg/60">/{billingPeriod}</span>
        </div>
        <MagneticButton className="block w-full">
          <Link
            href="/waitlist"
            className="flex w-full items-center justify-center gap-2.5 border border-goldsoft bg-goldsoft px-6 py-4 text-[13.5px] tracking-[0.08em] text-ink transition-colors hover:bg-bg"
          >
            Join the Waitlist <ArrowRight size={15} />
          </Link>
        </MagneticButton>
        <p className="mt-4 text-center text-[12.5px] text-bg/55">
          {trialDays} days free, then {currency}{offerPrice}/{billingPeriod}. Cancel anytime.
        </p>
      </div>
    </ScrollReveal>
  );
}
