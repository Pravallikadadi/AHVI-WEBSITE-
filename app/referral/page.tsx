import type { Metadata } from "next";
import { ArrowRight, Link2, UserPlus, CheckCircle2, Gift, Shirt, CalendarClock, ListChecks } from "lucide-react";
import { MarketingShell } from "@/components/shells/marketing-shell";
import { ReferralDashboard } from "@/components/referral-dashboard";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";
import { ScrollReveal } from "@/components/motion/scroll-reveal";
import { TextReveal } from "@/components/motion/text-reveal";
import { MagneticButton } from "@/components/motion/magnetic-button";
import { referralSteps, referralFaq } from "@/lib/site-data";
import { highlightAhvi } from "@/lib/ahvi-text";

export const metadata: Metadata = {
  title: "Referral",
  description: "Invite friends to AHVI and unlock bonus uploads for your wardrobe.",
};

export default function ReferralPage() {
  return (
    <MarketingShell>
      <section className="relative overflow-hidden bg-ink text-bg">
        <div className="pointer-events-none absolute -right-[16%] -top-[38%] aspect-square w-[min(680px,90vw)] border border-goldsoft/15" />
        <div className="relative mx-auto max-w-[900px] px-5 py-16 text-center sm:px-8 sm:py-20">
          <div className="mb-4.5 text-[11px] tracking-[0.26em] text-goldsoft">{highlightAhvi("AHVI referral")}</div>
          <h1 className="mb-4.5 font-condensed text-[clamp(32px,5vw,58px)] font-semibold leading-tight">
            <TextReveal text="Why AHVI?" /><br />
            <TextReveal text="Share the experience." delay={0.1} />
          </h1>
          <p className="mx-auto max-w-[44ch] text-[15.5px] leading-relaxed text-bg/65">
            {highlightAhvi(
              "Invite the people whose style you love. When they join AHVI through your referral, you unlock more access for your wardrobe."
            )}
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-[900px] px-5 pt-10 sm:px-8">
        <div className="mb-4.5 text-center text-[10.5px] tracking-[0.22em] text-muted">{highlightAhvi("Your AHVI circle")}</div>
        <ReferralDashboard />
      </section>

      <section className="bg-ink text-bg">
        <div className="mx-auto max-w-[900px] px-5 py-16 sm:px-8 sm:py-24">
          <div className="mb-8 text-center text-[11px] tracking-[0.26em] text-goldsoft">How referrals work</div>
          <div className="grid gap-9 text-center" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 200px), 1fr))" }}>
            {referralSteps.map((s, i) => {
              const StepIcon = [Link2, UserPlus, CheckCircle2, Gift][i] ?? Link2;
              return (
                <div key={s.n}>
                  <div className="mx-auto mb-4 grid h-[46px] w-[46px] place-items-center border border-goldsoft/60 font-condensed text-[16px] font-semibold text-goldsoft">
                    <StepIcon aria-hidden="true" size={19} strokeWidth={1.5} />
                  </div>
                  <div className="mb-1.5 font-condensed text-[17px] font-semibold">{highlightAhvi(s.title)}</div>
                  <div className="text-[12.5px] leading-relaxed text-bg/60">{highlightAhvi(s.body)}</div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-[640px] px-5 py-16 text-center sm:px-8 sm:py-24">
        <Gift aria-hidden="true" size={26} strokeWidth={1.5} className="mx-auto mb-3.5 text-accent" />
        <div className="mb-3.5 text-[10.5px] tracking-[0.2em] text-muted">Your reward</div>
        <div className="font-condensed text-[clamp(56px,8vw,84px)] font-semibold leading-none text-accent">+5</div>
        <div className="my-2.5 text-[13px] tracking-[0.16em]">Free uploads</div>
        <p className="mx-auto max-w-[38ch] text-[14.5px] leading-relaxed text-muted">
          Every successful friend referral gives you 5 additional free uploads.
        </p>
      </section>

      <section className="border-y border-ink/10 bg-bg">
        <div className="mx-auto max-w-[1100px] px-5 py-16 sm:px-8 sm:py-24">
          <div className="mb-14 max-w-[640px]">
            <div className="mb-4 text-[11px] tracking-[0.26em] text-ink">{highlightAhvi("Why AHVI?")}</div>
            <h2 className="mb-4 font-condensed text-[clamp(28px,3.8vw,48px)] font-semibold leading-tight">
              Share the experience.
            </h2>
            <p className="max-w-[54ch] text-[15px] leading-relaxed text-muted">
              {highlightAhvi(
                "AHVI brings style, preparation and planning together in one intelligent experience — making everyday decisions feel simpler and more personal."
              )}
            </p>
          </div>

          <div className="grid gap-0 sm:grid-cols-3">
            {[
              { n: "01", label: "Style", title: "Know what to wear.", body: "Your wardrobe, AI Stylist, Style Boards and Daily Wear come together to make getting dressed feel effortless.", icon: Shirt },
              { n: "02", label: "Prep", title: "Be ready for what's next.", body: "From packing and skincare to events and routines, AHVI helps you prepare before the moment arrives.", icon: CalendarClock },
              { n: "03", label: "Plan", title: "Know what's coming.", body: "Bring your calendar, meals, workouts, bills and daily routines into one connected plan.", icon: ListChecks },
            ].map((v) => (
              <div key={v.n} className="group border-t border-ink/15 py-7 pr-8 transition-transform duration-300 motion-safe:hover:-translate-y-1.5">
                <div className="mb-8 flex items-baseline justify-between">
                  <v.icon aria-hidden="true" size={20} strokeWidth={1.5} className="text-ink" />
                  <span className="text-[11px] tracking-[0.2em] text-muted2">{v.label}</span>
                </div>
                <div className="mb-3 flex items-center gap-2 font-condensed text-[24px] font-semibold leading-tight">
                  {v.title}
                  <ArrowRight size={16} className="shrink-0 -translate-x-1 opacity-0 transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-100" />
                </div>
                <p className="max-w-[32ch] text-[14.5px] leading-relaxed text-muted">{highlightAhvi(v.body)}</p>
              </div>
            ))}
          </div>

          <div className="mt-12 text-center sm:mt-20">
            <div className="mb-4 text-[11px] tracking-[0.26em] text-muted">{highlightAhvi("Share AHVI")}</div>
            <h3 className="mx-auto mb-4 max-w-[24ch] font-condensed text-[clamp(24px,3.2vw,38px)] font-semibold leading-tight">
              The best things are better together.
            </h3>
            <p className="mx-auto mb-7 max-w-[46ch] text-[15px] leading-relaxed text-muted">
              {highlightAhvi("Know someone who would love a more effortlessly put-together day? Share AHVI with them.")}
            </p>
            <a href="#ref-share" className="inline-flex items-center gap-2.5 border border-ink bg-ink px-7 py-4 text-[13px] tracking-[0.1em] text-bg hover:bg-black">
              {highlightAhvi("Share AHVI")} <ArrowRight size={15} />
            </a>
          </div>

          <div className="mx-auto mt-16 max-w-[640px] border border-ink/15 p-8 text-center sm:p-11">
            <h3 className="mb-3 font-condensed text-[clamp(22px,2.8vw,30px)] font-semibold leading-tight">
              You share.
              <br />
              {highlightAhvi("They discover AHVI.")}
              <br />
              Everyone wins.
            </h3>
            <p className="text-[14.5px] leading-relaxed text-muted">
              Every successful friend referral gives you 5 additional free uploads.
            </p>
          </div>
        </div>
      </section>

      <section id="faq" className="mx-auto max-w-[640px] px-5 py-16 sm:px-8 sm:py-24">
        <div className="mb-5 text-center text-[11px] tracking-[0.26em] text-muted">FAQ</div>
        <Accordion type="single" collapsible className="border-t border-ink/10">
          {referralFaq.map((f, i) => (
            <AccordionItem key={i} value={"item-" + i}>
              <AccordionTrigger>{f.q}</AccordionTrigger>
              <AccordionContent>{highlightAhvi(f.a)}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </section>
    </MarketingShell>
  );
}
