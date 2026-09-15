import type { Metadata } from "next";
import { MarketingShell } from "@/components/shells/marketing-shell";
import { Photo } from "@/components/media/photo";

export const metadata: Metadata = {
  title: "How AHVI Works",
  description: "AHVI brings your wardrobe, style, preparation and plans together in three modules — Style, Prep and Plan.",
};

const MODULES = [
  {
    name: "Style",
    body: "AHVI helps you understand your personal style, organise your wardrobe, get outfit recommendations and create style boards — curated looks for every part of your life, from workdays to getaways.",
    img: "/images/style-boards-hero.png",
    alt: "AHVI Style Boards — curated looks for Workwear, Dinner, Minimal, Travel and Weekend",
    ratio: "1894/830",
  },
  {
    name: "Prep",
    body: "AHVI helps you prepare — daily outfits, packing, skincare, and fitness and routines — so you're ready for what's next.",
    img: "/images/prep-module-hero.png",
    alt: "AHVI Prep module — mood boards and packing checklists for a Goa Weekend trip",
    ratio: "3/2",
  },
  {
    name: "Plan",
    body: "AHVI helps you stay organised — today's plan, calendar, planner, bills and MediTracker, all in one place.",
    img: "/images/plan-module-hero.png",
    alt: "AHVI Plan module — Diet & Fitness, Home & Utilities, Today's Plan, MediTrack and Skincare",
    ratio: "1895/830",
  },
];

export default function HowAhviWorksPage() {
  return (
    <MarketingShell hideFinalCta>
      <section className="bg-bg">
        <div className="mx-auto max-w-[900px] px-5 pb-6 pt-16 text-center sm:px-8 sm:pt-24">
          <h1 className="font-condensed text-[clamp(34px,5vw,64px)] font-bold leading-[0.98]">
            How AHVI works.
          </h1>
        </div>
      </section>

      <section className="mx-auto max-w-[1600px] px-5 py-10 sm:px-8 sm:py-14">
        {MODULES.map((m) => (
          <div key={m.name} className="grid items-center gap-10 border-t border-ink/10 py-14 first:border-t-0 sm:grid-cols-[0.85fr_1.15fr] sm:gap-16 sm:py-20">
            <div>
              <h2 className="mb-4 font-condensed text-[clamp(30px,4vw,48px)] font-bold">{m.name}</h2>
              <p className="max-w-[42ch] text-[16px] leading-relaxed text-muted">{m.body}</p>
            </div>
            <Photo src={m.img} alt={m.alt} ratio={m.ratio} fit="contain" className="border border-ink/10 bg-surface" />
          </div>
        ))}
      </section>
    </MarketingShell>
  );
}
