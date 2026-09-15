import { SectionLabel } from "@/components/home/section-label";
import { ScrollReveal } from "@/components/motion/scroll-reveal";
import { HowItWorksCard } from "@/components/home/how-it-works-card";

const STEPS = [
  { n: "01", title: "Personalize", body: "Discover your style, preferences, body shape, and wardrobe needs." },
  { n: "02", title: "Build Your Wardrobe", body: "Add your existing clothes and create your digital wardrobe." },
  { n: "03", title: "Get Styled", body: "Receive personalized outfit recommendations for every occasion." },
  { n: "04", title: "Plan With Confidence", body: "Prepare outfits, organize your wardrobe, and dress with confidence." },
];

export function HowItWorksSection() {
  return (
    <section className="border-t border-ink/10 bg-bg">
      <div className="mx-auto max-w-[1600px] px-5 py-14 sm:px-8 sm:py-20">
        <ScrollReveal className="mb-12 max-w-[640px]">
          <SectionLabel label="How AHVI works" />
          <h2 className="mb-4 mt-4 font-condensed text-[clamp(28px,3.6vw,46px)] font-bold leading-tight">
            From your wardrobe to your day, in four steps.
          </h2>
        </ScrollReveal>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {STEPS.map((s, i) => (
            <ScrollReveal key={s.n} delay={i * 0.08}>
              <HowItWorksCard n={s.n} title={s.title} body={s.body} delay={i * 1.1} />
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
