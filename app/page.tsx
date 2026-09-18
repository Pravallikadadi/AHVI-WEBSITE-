import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { MarketingShell } from "@/components/shells/marketing-shell";
import { Hero } from "@/components/hero";
import { StyleSection } from "@/components/home/style-section";
import { PrepSection } from "@/components/home/prep-section";
import { PlanSection } from "@/components/home/plan-section";
import { AssistantSection } from "@/components/home/assistant-section";
import { DailyExperience } from "@/components/home/daily-experience";
import { StyleBoardsRail } from "@/components/style-boards";
import { SectionLabel } from "@/components/home/section-label";
import { PersonalizationSection } from "@/components/home/personalization-section";
import { AhviCtaBlock } from "@/components/ahvi-cta-block";

export const metadata: Metadata = {
  title: "AHVI — Your Personal AI Stylist",
  description:
    "AHVI is your personal AI stylist that understands your wardrobe, your style and your lifestyle — helping you decide what to wear, what to prepare and what's next.",
};

export default function HomePage() {
  return (
    <MarketingShell hideFinalCta>
      <Hero />

      <StyleSection />

      <section className="border-t border-ink/10 bg-bg">
        <div className="mx-auto flex max-w-[1600px] flex-wrap items-center justify-between gap-5 px-5 py-10 sm:px-8 sm:py-12">
          <div>
            <SectionLabel label="How AHVI works" />
            <p className="mt-2.5 max-w-[46ch] text-[14.5px] leading-relaxed text-muted">
              From your wardrobe to your day, in four simple steps.
            </p>
          </div>
          <Link
            href="/how-ahvi-works"
            className="inline-flex shrink-0 items-center gap-2.5 border border-ink bg-ink px-5 py-3 text-[12.5px] tracking-[0.1em] text-bg"
          >
            See how it works <ArrowRight size={14} />
          </Link>
        </div>
      </section>

      <section className="border-t border-ink/10 bg-bg">
        <div className="mx-auto max-w-[1600px] px-5 pt-10 sm:px-8 sm:pt-12">
          <SectionLabel label="Style boards" />
          <h2 className="mb-2 mt-4 font-condensed text-[clamp(32px,4.4vw,58px)] font-semibold leading-tight">
            One wardrobe. Endless directions.
          </h2>
        </div>
        <div className="mt-10">
          <StyleBoardsRail />
        </div>
      </section>

      <PersonalizationSection />

      <PrepSection />
      <PlanSection />
      <AssistantSection />
      <DailyExperience />

      <AhviCtaBlock />
    </MarketingShell>
  );
}
