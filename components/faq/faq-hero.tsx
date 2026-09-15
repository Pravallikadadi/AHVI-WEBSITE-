"use client";
import { TextReveal } from "@/components/motion/text-reveal";

export function FAQHero() {
  return (
    <section className="relative overflow-hidden bg-ink text-bg">
      <div className="relative mx-auto max-w-[720px] px-5 py-16 text-center sm:px-8 sm:py-24">
        <div className="mb-4 text-[11px] tracking-[0.26em] text-bg/50">FAQ</div>
        <h1 className="mb-5 font-condensed text-[clamp(34px,5vw,58px)] font-semibold leading-tight">
          <TextReveal text="Everything you need to know about AHVI." />
        </h1>
        <p className="mx-auto max-w-[48ch] text-[15px] leading-relaxed text-bg/60">
          From your wardrobe to your daily plans, here&apos;s how AHVI works.
        </p>
      </div>
    </section>
  );
}
