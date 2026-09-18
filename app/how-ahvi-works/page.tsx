import fs from "fs";
import path from "path";
import type { Metadata } from "next";
import { MarketingShell } from "@/components/shells/marketing-shell";
import { SectionLabel } from "@/components/home/section-label";
import { HowItWorksAuto } from "@/components/home/how-it-works-auto";
import { ScrollReveal } from "@/components/motion/scroll-reveal";
import { highlightAhvi } from "@/lib/ahvi-text";

export const metadata: Metadata = {
  title: "How AHVI Works",
  description: "From your wardrobe to your day, in four steps.",
};

const STEPS = [
  {
    n: "01",
    title: "Personalize",
    body: "Discover your style, preferences, body shape, and wardrobe needs.",
    video: "/videos/how-ahvi-works/video-01.mp4",
  },
  {
    n: "02",
    title: "Build Your Wardrobe",
    body: "Add your existing clothes and create your digital wardrobe.",
    video: "/videos/how-ahvi-works/video-02.mp4",
  },
  {
    n: "03",
    title: "Get Styled",
    body: "Receive personalized outfit recommendations for every occasion.",
    video: "/videos/how-ahvi-works/video-03.mp4",
  },
  {
    n: "04",
    title: "Plan With Confidence",
    body: "Prepare outfits, organize your wardrobe, and dress with confidence.",
    video: "/videos/how-ahvi-works/video-04.mp4",
  },
];

function videoExists(src: string) {
  try {
    return fs.existsSync(path.join(process.cwd(), "public", src));
  } catch {
    return false;
  }
}

export default function HowAhviWorksPage() {
  const steps = STEPS.map((s) => ({ ...s, videoExists: videoExists(s.video) }));

  return (
    <MarketingShell hideFinalCta>
      <section className="border-t border-ink/10 bg-bg">
        <div className="mx-auto max-w-[1600px] px-5 py-16 sm:px-8 sm:py-24">
          <ScrollReveal className="mb-12 max-w-[640px]">
            <SectionLabel label="How AHVI works" />
            <h1 className="mb-4 mt-4 font-condensed text-[clamp(34px,4.8vw,60px)] font-bold leading-tight">
              {highlightAhvi("From your wardrobe to your day, in four steps.")}
            </h1>
          </ScrollReveal>

          <ScrollReveal delay={0.1}>
            <HowItWorksAuto steps={steps} />
          </ScrollReveal>
        </div>
      </section>
    </MarketingShell>
  );
}
