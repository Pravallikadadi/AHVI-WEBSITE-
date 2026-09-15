import type { Metadata } from "next";
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
import { HowItWorksSection } from "@/components/home/how-it-works-section";

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

      <HowItWorksSection />

      <section className="border-t border-ink/10 bg-bg">
        <div className="mx-auto max-w-[1600px] px-5 pt-10 sm:px-8 sm:pt-12">
          <SectionLabel label="Style boards" />
          <h2 className="mb-2 mt-4 font-condensed text-[clamp(28px,3.8vw,50px)] font-semibold leading-tight">
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
