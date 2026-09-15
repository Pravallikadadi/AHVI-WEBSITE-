import type { Metadata } from "next";
import { MarketingShell } from "@/components/shells/marketing-shell";
import { SurveyForm } from "@/components/survey-form";

export const metadata: Metadata = {
  title: "Survey",
  description: "Help shape what AHVI builds next.",
};

export default function SurveyPage() {
  return (
    <MarketingShell>
      <div className="mx-auto max-w-[640px] px-5 py-16 sm:px-8 sm:py-24">
        <div className="mb-4.5 text-[11px] tracking-[0.26em] text-muted">Survey</div>
        <h1 className="mb-8.5 font-condensed text-[clamp(30px,4vw,42px)] font-semibold">A couple of quick questions.</h1>
        <SurveyForm />
      </div>
    </MarketingShell>
  );
}
