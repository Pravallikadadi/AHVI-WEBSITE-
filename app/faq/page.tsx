import type { Metadata } from "next";
import { MarketingShell } from "@/components/shells/marketing-shell";
import { FAQHero } from "@/components/faq/faq-hero";
import { FAQAccordion } from "@/components/faq/faq-accordion";
import { FAQSupport } from "@/components/faq/faq-support";

export const metadata: Metadata = {
  title: "FAQ | AHVI",
  description: "Find answers about AHVI, your personal AI assistant for styling, shopping, wellness and everyday planning.",
};

export default function FAQPage() {
  return (
    <MarketingShell hideFinalCta>
      <FAQHero />
      <FAQAccordion />
      <FAQSupport />
    </MarketingShell>
  );
}
