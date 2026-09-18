import type { Metadata } from "next";
import { ArrowRight } from "lucide-react";
import { MarketingShell } from "@/components/shells/marketing-shell";
import { Photo } from "@/components/media/photo";
import { getImageRatio } from "@/lib/image-size";
import { TextReveal } from "@/components/motion/text-reveal";
import { ScrollReveal } from "@/components/motion/scroll-reveal";
import { AhviCtaBlock } from "@/components/ahvi-cta-block";
import { highlightAhvi } from "@/lib/ahvi-text";

export const metadata: Metadata = {
  title: "About",
  description: "AHVI is building a new kind of personal AI — one that understands you, your world and the context of your everyday life.",
};

const CONNECTIONS = [
  "A dinner affects what you wear.",
  "A trip affects what you pack.",
  "Your schedule affects what you eat.",
  "Your routine affects what you need to remember.",
];

const AI_UNDERSTANDS = ["Who you are.", "What you like.", "What you own.", "How you live.", "What's happening next."];

const NOT_ANOTHER = ["Not another chatbot.", "Not another dashboard.", "Not another app asking you to organise your life."];

const LEARNS = ["Your preferences.", "Your choices.", "Your routines.", "Your context.", "Your life."];

const DAILY_QUESTIONS = [
  "What should I wear?",
  "What should I eat?",
  "What do I need today?",
  "What should I pack?",
  "What did I forget?",
  "What's happening tomorrow?",
];

const PILLARS = [
  { label: "Style", title: "Understand your taste, wardrobe and personal expression." },
  { label: "Prep & Plan", title: "Understand what's coming and help you get ready for it." },
  { label: "The Future", title: "Understand your life as a whole — and intelligently help you navigate it." },
];

const FUTURE_MOMENTS = [
  { trigger: "Your trip is next week.", response: "It knows what you're taking." },
  { trigger: "Your dinner is tomorrow.", response: "It knows what you're wearing." },
  { trigger: "Your week is getting busy.", response: "It helps you organise it." },
  { trigger: "Something needs to be bought.", response: "It knows why you need it." },
  { trigger: "Something needs to be remembered.", response: "It reminds you." },
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
      {/* Hero */}
      <section className="bg-bg text-ink">
        <div className="mx-auto grid max-w-[1600px] items-center gap-10 px-5 py-16 sm:px-8 sm:py-24 lg:grid-cols-2 lg:gap-16">
          <div>
            <div className="mb-5 text-[11px] tracking-[0.26em] text-ink">{highlightAhvi("About AHVI")}</div>
            <h1 className="mb-6 font-condensed text-[clamp(32px,5vw,58px)] font-semibold leading-[1.03]">
              <TextReveal text="We're building the intelligence" /><br /><TextReveal text="behind everyday life." delay={0.1} />
            </h1>
            <p className="mb-4 max-w-[48ch] text-[16px] leading-relaxed text-muted">
              {highlightAhvi(
                "AHVI is building a new kind of personal AI — one that understands you, your world and the context of your everyday life."
              )}
            </p>
            <p className="mb-8 max-w-[48ch] text-[16px] font-semibold leading-relaxed text-ink">
              Our vision is simple: technology should make life feel more effortless, not more complicated.
            </p>
            <a href="#why" className="inline-flex items-center gap-2.5 border border-ink bg-ink px-6 py-3.5 text-[13px] tracking-[0.1em] text-bg hover:bg-black">
              JOIN THE WAITLIST <ArrowRight size={15} />
            </a>
          </div>
          <Photo src="/images/about-hero.webp" alt="The AHVI app" ratio="16/9" className="border border-ink/10 bg-surface" />
        </div>
      </section>

      {/* Why AHVI */}
      <section id="why" className="border-t border-ink/10 bg-surface">
        <div className="mx-auto max-w-[900px] px-5 py-16 sm:px-8 sm:py-24">
          <div className="mb-4 text-[11px] tracking-[0.26em] text-ink">Why AHVI</div>
          <h2 className="mb-6 max-w-[20ch] font-condensed text-[clamp(28px,3.6vw,44px)] font-semibold leading-tight">
            Life is connected. Technology isn&apos;t.
          </h2>
          <p className="mb-3 max-w-[56ch] text-[16px] leading-relaxed text-muted">
            Today, different parts of your life live in different places. Your wardrobe is somewhere. Your
            calendar somewhere else. Your plans, reminders, meals, shopping and routines somewhere else.
          </p>
          <p className="mb-8 max-w-[56ch] text-[16px] leading-relaxed text-muted">
            But you don&apos;t experience your life that way.
          </p>
          <div className="mb-8 grid gap-3 sm:grid-cols-2">
            {CONNECTIONS.map((line, i) => (
              <ScrollReveal key={line} delay={i * 0.06}>
                <div className="border border-ink/10 bg-bg px-5 py-4 text-[14.5px] leading-relaxed text-ink/85">
                  {line}
                </div>
              </ScrollReveal>
            ))}
          </div>
          <p className="max-w-[56ch] text-[16px] font-semibold leading-relaxed text-ink">
            {highlightAhvi("We believe your technology should understand those connections too.")}
          </p>
        </div>
      </section>

      {/* Our Vision */}
      <section className="mx-auto max-w-[900px] px-5 py-16 sm:px-8 sm:py-24">
        <div className="mb-4 text-[11px] tracking-[0.26em] text-ink">Our vision</div>
        <h2 className="mb-6 max-w-[20ch] font-condensed text-[clamp(28px,3.6vw,44px)] font-semibold leading-tight">
          A personal intelligence that knows you.
        </h2>
        <p className="mb-3 max-w-[56ch] text-[16px] leading-relaxed text-muted">
          We imagine a future where you don&apos;t have to constantly manage your digital life. You shouldn&apos;t
          have to search through apps, remember everything, or explain yourself repeatedly.
        </p>
        <p className="mb-5 max-w-[56ch] text-[16px] leading-relaxed text-muted">Your AI should understand:</p>
        <ul className="mb-6 flex flex-wrap gap-2.5">
          {AI_UNDERSTANDS.map((item) => (
            <li key={item} className="gradient-chip rounded-md px-4 py-2 text-[13.5px] font-semibold">
              {item}
            </li>
          ))}
        </ul>
        <p className="mb-1 max-w-[56ch] text-[16px] leading-relaxed text-muted">
          And use that understanding to help you move through life.
        </p>
        <p className="max-w-[56ch] text-[16px] font-semibold leading-relaxed text-ink">
          {highlightAhvi("That is what we're building with AHVI.")}
        </p>
      </section>

      {/* What We Believe */}
      <section className="border-t border-ink/10 bg-ink text-bg">
        <div className="mx-auto max-w-[900px] px-5 py-16 sm:px-8 sm:py-24">
          <div className="mb-4 text-[11px] tracking-[0.26em] text-bg/50">What we believe</div>
          <h2 className="mb-6 max-w-[20ch] font-condensed text-[clamp(28px,3.6vw,44px)] font-semibold leading-tight">
            AI should feel personal.
          </h2>
          <div className="mb-6 flex flex-col gap-1.5">
            {NOT_ANOTHER.map((line) => (
              <p key={line} className="max-w-[56ch] text-[16px] leading-relaxed text-bg/60">
                {line}
              </p>
            ))}
          </div>
          <p className="mb-5 max-w-[56ch] text-[16px] font-semibold leading-relaxed">
            {highlightAhvi("AHVI is designed to learn you.")}
          </p>
          <ul className="mb-6 flex flex-wrap gap-2.5">
            {LEARNS.map((item) => (
              <li key={item} className="border border-bg/20 px-4 py-2 text-[13.5px] font-semibold text-bg/85">
                {item}
              </li>
            ))}
          </ul>
          <p className="max-w-[56ch] text-[15.5px] leading-relaxed text-bg/60">
            {highlightAhvi(
              "The more you use AHVI, the more useful it becomes — because it understands more about you, not just the question you're asking."
            )}
          </p>
        </div>
      </section>

      {/* Our Philosophy */}
      <section className="border-t border-ink/10 bg-bg">
        <div className="mx-auto max-w-[900px] px-5 py-16 sm:px-8 sm:py-24">
          <div className="mb-4 text-[11px] tracking-[0.26em] text-ink">Our philosophy</div>
          <h2 className="mb-6 max-w-[20ch] font-condensed text-[clamp(28px,3.6vw,44px)] font-semibold leading-tight">
            Less figuring out. More living.
          </h2>
          <p className="mb-6 max-w-[56ch] text-[16px] leading-relaxed text-muted">
            There are hundreds of tiny decisions in every day.
          </p>
          <div className="mb-6 grid gap-2.5 sm:grid-cols-2">
            {DAILY_QUESTIONS.map((q) => (
              <div key={q} className="border-l-2 border-ink/15 pl-4 text-[14.5px] leading-relaxed text-ink/75">
                {q}
              </div>
            ))}
          </div>
          <p className="mb-1 max-w-[56ch] text-[16px] leading-relaxed text-muted">
            Individually, they&apos;re small. Together, they create mental noise.
          </p>
          <p className="mb-1 mt-4 max-w-[56ch] text-[16px] font-semibold leading-relaxed text-ink">
            {highlightAhvi("We want AHVI to take some of that noise away.")}
          </p>
          <p className="max-w-[56ch] text-[16px] leading-relaxed text-muted">
            So you can spend less time organising your life — and more time actually living it.
          </p>
        </div>
      </section>

      {/* Style -> Prep & Plan -> Something Bigger */}
      <section className="border-t border-ink/10 bg-surface">
        <div className="mx-auto max-w-[1600px] px-5 py-16 sm:px-8 sm:py-24">
          <div className="mb-4 text-[11px] tracking-[0.26em] text-ink">Style → Prep &amp; Plan → Something bigger</div>
          <h2 className="mb-6 max-w-[26ch] font-condensed text-[clamp(26px,3.6vw,44px)] font-semibold leading-tight">
            It starts with what you wear. It grows into everything around you.
          </h2>
          <p className="mb-3 max-w-[56ch] text-[15.5px] leading-relaxed text-muted">
            Style is deeply personal. It&apos;s one of the most visible expressions of who we are, which makes it a
            natural place for {highlightAhvi("AHVI")} to begin understanding you.
          </p>
          <p className="mb-10 max-w-[56ch] text-[15.5px] leading-relaxed text-muted">
            But our vision goes beyond style.
          </p>
          <div className="grid gap-0 sm:grid-cols-3">
            {PILLARS.map((p, i) => (
              <ScrollReveal key={p.label} delay={i * 0.08}>
                <div className="border-t border-ink/15 py-6 pr-6">
                  <div className="mb-6 text-[11px] tracking-[0.24em] text-ink">{p.label}</div>
                  <p className="max-w-[34ch] text-[15px] leading-relaxed text-ink">{p.title}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Existing product gallery — unchanged */}
      <section className="mx-auto max-w-[1600px] px-5 py-16 sm:px-8 sm:py-24">
        <div className="mb-10 text-center">
          <div className="mb-4 text-[11px] tracking-[0.26em] text-ink">{highlightAhvi("The AHVI experience")}</div>
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
        <div className="scrollbar-hide flex snap-x snap-mandatory gap-4 overflow-x-auto pb-2 lg:justify-center">
          {EXPERIENCE_IMAGES.map((src) => (
            <Photo
              key={src}
              src={src}
              alt="The AHVI app"
              ratio={experienceCardRatio}
              fit="contain"
              className="w-[42%] max-w-[190px] shrink-0 snap-center rounded-lg border border-ink/10 bg-surface sm:w-[220px] sm:max-w-none"
            />
          ))}
        </div>
      </section>

      {/* The Future We See */}
      <section className="border-t border-ink/10 bg-ink text-bg">
        <div className="mx-auto max-w-[720px] px-5 py-16 sm:px-8 sm:py-24">
          <div className="mb-4 text-[11px] tracking-[0.26em] text-bg/50">The future we see</div>
          <h2 className="mb-10 max-w-[22ch] font-condensed text-[clamp(26px,3.6vw,44px)] font-semibold leading-tight">
            Imagine an AI that knows what&apos;s coming before you ask.
          </h2>
          <div className="mb-10 flex flex-col gap-6">
            {FUTURE_MOMENTS.map((m) => (
              <ScrollReveal key={m.trigger}>
                <div className="border-l-2 border-bg/20 pl-5">
                  <p className="text-[15.5px] leading-relaxed text-bg/50">{m.trigger}</p>
                  <p className="text-[17px] font-semibold leading-relaxed">{m.response}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>
          <p className="text-[15.5px] leading-relaxed text-bg/60">Not because you told it every single detail.</p>
          <p className="text-[15.5px] font-semibold leading-relaxed">
            {highlightAhvi("Because it understands the context of your life.")}
          </p>
        </div>
      </section>

      {/* Our North Star */}
      <section className="border-t border-ink/10 bg-surface">
        <div className="mx-auto max-w-[720px] px-5 py-16 text-center sm:px-8 sm:py-24">
          <div className="mb-4 text-[11px] tracking-[0.26em] text-ink">Our north star</div>
          <h2 className="mb-5 font-condensed text-[clamp(30px,4vw,48px)] font-semibold leading-tight">
            Plan ahead. Live in the moment.
          </h2>
          <p className="mx-auto mb-3 max-w-[52ch] text-[15.5px] leading-relaxed text-muted">
            We don&apos;t want technology to make people spend more time managing technology. We want it to give
            people their time back.
          </p>
          <p className="mx-auto max-w-[52ch] text-[16px] font-semibold leading-relaxed text-ink">
            {highlightAhvi("AHVI handles the thinking around your day, so you can be present for your life.")}
          </p>
        </div>
      </section>

      {/* Final statement */}
      <section className="mx-auto max-w-[720px] px-5 py-16 text-center sm:px-8 sm:py-24">
        <p className="mx-auto mb-2 max-w-[36ch] text-[16px] leading-relaxed text-muted">
          {highlightAhvi("We're building AHVI for a world where your AI doesn't just answer you.")}
        </p>
        <p className="font-condensed text-[clamp(30px,4vw,48px)] font-semibold leading-tight">It knows you.</p>
      </section>

      <AhviCtaBlock />
    </MarketingShell>
  );
}
