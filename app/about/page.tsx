import type { Metadata } from "next";
import { ArrowRight } from "lucide-react";
import { MarketingShell } from "@/components/shells/marketing-shell";
import { Photo } from "@/components/media/photo";
import { getImageRatio } from "@/lib/image-size";
import { TextReveal } from "@/components/motion/text-reveal";
import { ScrollReveal } from "@/components/motion/scroll-reveal";
import { AhviCtaBlock } from "@/components/ahvi-cta-block";

export const metadata: Metadata = {
  title: "About",
  description: "AHVI is your personal AI assistant for style, preparation and planning — bringing the decisions of everyday life into one intelligent experience.",
};

const PILLARS = [
  { label: "Style", title: "Know what to wear.", body: "AI Stylist, Wardrobe, Style Boards, Daily Wear, Style This and Try-On help you make better style decisions using what you actually own." },
  { label: "Prep", title: "Be ready for what's next.", body: "Packing, Skincare, MediTracker, Diet & Fitness and Events help turn preparation into something simple and organised." },
  { label: "Plan", title: "Know what's coming.", body: "Today's Plan, Planner, Calendar, Bills, Meals, Workouts and Routines help bring your day and week together." },
];

const JOURNEY = ["Wardrobe", "AI Stylist", "Style Board", "Daily Wear", "Prep", "Plan"];

const EXPERIENCE_IMAGES = [
  "/images/features/01-wardrobe.jpg",
  "/images/hero-hand-phone.webp",
  "/images/features/04-style-boards.jpg",
  "/images/features/03-daily-style.jpg",
];

export default async function AboutPage() {
  // Style Boards and Daily Wear define the reference height — Wardrobe and the AI-scan shot are
  // fitted (never cropped) into that same box, so all four cards line up at equal height.
  const experienceCardRatio = getImageRatio(EXPERIENCE_IMAGES[2]);

  return (
    <MarketingShell hideFinalCta>
      <section className="bg-bg text-ink">
        <div className="mx-auto grid max-w-[1600px] items-center gap-10 px-5 py-16 sm:px-8 sm:py-24 lg:grid-cols-2 lg:gap-16">
          <div>
            <div className="mb-5 text-[11px] tracking-[0.26em] text-muted">About AHVI</div>
            <h1 className="mb-6 font-condensed text-[clamp(36px,5.4vw,64px)] font-semibold leading-[0.98]">
              <TextReveal text="A more effortlessly" /><br /><TextReveal text="put-together life." delay={0.1} />
            </h1>
            <p className="mb-8 max-w-[46ch] text-[16px] leading-relaxed text-muted">
              AHVI is your personal AI assistant for style, preparation and planning — bringing the decisions of
              everyday life into one intelligent experience.
            </p>
            <a href="#idea" className="inline-flex items-center gap-2.5 border border-ink bg-ink px-6 py-3.5 text-[13px] tracking-[0.1em] text-bg hover:bg-black">
              JOIN THE WAITLIST <ArrowRight size={15} />
            </a>
          </div>
          <Photo src="/images/about-hero.webp" alt="The AHVI app" ratio="16/9" className="border border-ink/10 bg-surface" />
        </div>
      </section>

      <section id="idea" className="mx-auto max-w-[900px] px-5 py-16 sm:px-8 sm:py-24">
        <div className="mb-4 text-[11px] tracking-[0.26em] text-muted">The idea</div>
        <h2 className="mb-6 max-w-[20ch] font-condensed text-[clamp(28px,3.6vw,44px)] font-semibold leading-tight">
          Your life isn&apos;t made of separate tasks.
        </h2>
        <p className="mb-3 max-w-[56ch] text-[16px] leading-relaxed text-muted">
          What you wear affects how you move through your day. Where you&apos;re going affects what you need to
          prepare. What&apos;s on your calendar affects what you wear, eat and do.
        </p>
        <p className="max-w-[56ch] text-[16px] leading-relaxed text-muted">
          Yet most of these decisions live in completely different places. AHVI brings them together.
        </p>
      </section>

      <section className="border-t border-ink/10 bg-surface">
        <div className="mx-auto max-w-[1600px] px-5 py-16 sm:px-8 sm:py-24">
          <div className="grid gap-0 sm:grid-cols-3">
            {PILLARS.map((p, i) => (
              <ScrollReveal key={p.label} delay={i * 0.08}>
                <div className="border-t border-ink/15 py-6 pr-6">
                  <div className="mb-6 text-[11px] tracking-[0.24em] text-muted2">{p.label}</div>
                  <div className="mb-3 font-condensed text-[24px] font-semibold leading-tight">{p.title}</div>
                  <p className="max-w-[34ch] text-[14.5px] leading-relaxed text-muted">{p.body}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-[1600px] items-center gap-10 px-5 py-16 sm:px-8 sm:py-24 lg:grid-cols-2 lg:gap-16">
        <div>
          <div className="mb-4 text-[11px] tracking-[0.26em] text-muted">One intelligent assistant</div>
          <h2 className="mb-5 max-w-[18ch] font-condensed text-[clamp(26px,3.4vw,42px)] font-semibold leading-tight">
            Not another app. A smarter way to navigate your day.
          </h2>
          <p className="max-w-[46ch] text-[15.5px] leading-relaxed text-muted">
            AHVI is designed around context. Instead of giving you another list to manage, AHVI understands the
            relationship between your wardrobe, your plans, your routines and what&apos;s coming next.
          </p>
        </div>
        {/* <div className="flex items-center gap-3 border border-ink px-6 py-5 text-left">
          <span className="text-[15px] text-muted2">Ask me anything…</span>
          <span className="ml-auto flex h-9 w-9 shrink-0 items-center justify-center border border-ink text-[13px]">→</span>
        </div> */}
      </section>

      <section className="border-t border-ink/10 bg-ink text-bg">
        <div className="mx-auto max-w-[900px] px-5 py-16 text-center sm:px-8 sm:py-24">
          <div className="mb-4 text-[11px] tracking-[0.26em] text-bg/50">Built around you</div>
          <h2 className="mb-5 mx-auto max-w-[20ch] font-condensed text-[clamp(26px,3.4vw,42px)] font-semibold leading-tight">
            Personal should actually feel personal.
          </h2>
          <p className="mx-auto mb-3 max-w-[54ch] text-[15.5px] leading-relaxed text-bg/60">
            AHVI learns from the things that matter to you — your wardrobe, preferences, routines, plans and
            everyday context.
          </p>
          <p className="mx-auto max-w-[54ch] text-[15.5px] leading-relaxed text-bg/60">
            The goal isn&apos;t to tell you how to live. It&apos;s to make the decisions around your day feel
            easier.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-[1600px] px-5 py-16 sm:px-8 sm:py-24">
        <div className="mb-10 text-center">
          <div className="mb-4 text-[11px] tracking-[0.26em] text-muted">The AHVI experience</div>
          <h2 className="mx-auto mb-5 max-w-[22ch] font-condensed text-[clamp(26px,3.6vw,44px)] font-semibold leading-tight">
            Everything starts connecting.
          </h2>
          <p className="mx-auto max-w-[54ch] text-[15px] leading-relaxed text-muted">
            The outfit you choose. The event you&apos;re preparing for. The meal you&apos;re planning. The workout
            you&apos;re fitting in. The things you need to remember.
          </p>
        </div>
        <div className="mb-10 flex flex-wrap items-center justify-center gap-3 text-[12px] tracking-[0.1em]">
          {JOURNEY.map((step, i) => (
            <span key={step} className="flex items-center gap-3">
              <span className="border border-ink/20 px-4 py-2">{step}</span>
              {i < JOURNEY.length - 1 && <span className="text-muted2">→</span>}
            </span>
          ))}
        </div>
        <div className="grid gap-4" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 170px), 1fr))" }}>
          {EXPERIENCE_IMAGES.map((src) => (
            <Photo key={src} src={src} alt="The AHVI app" ratio={experienceCardRatio} fit="contain" className="border border-ink/10 bg-surface" />
          ))}
        </div>
      </section>

      <section className="border-t border-ink/10 bg-surface">
        <div className="mx-auto max-w-[720px] px-5 py-16 text-center sm:px-8 sm:py-24">
          <div className="mb-4 text-[11px] tracking-[0.26em] text-muted">Our philosophy</div>
          <h2 className="mb-5 font-condensed text-[clamp(26px,3.6vw,44px)] font-semibold leading-tight">
            Less figuring out. More living.
          </h2>
          <p className="mx-auto mb-3 max-w-[52ch] text-[15.5px] leading-relaxed text-muted">
            We believe technology should remove friction from everyday life — not add another layer of complexity.
          </p>
          <p className="mx-auto max-w-[52ch] text-[15.5px] leading-relaxed text-muted">
            AHVI is built to help with the small decisions that quietly take up your time, while keeping the
            experience simple, personal and beautifully considered.
          </p>
        </div>
      </section>

      <AhviCtaBlock />
    </MarketingShell>
  );
}
