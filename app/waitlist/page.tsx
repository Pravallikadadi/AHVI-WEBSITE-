import type { Metadata } from "next";
import { PlainShell } from "@/components/shells/plain-shell";
import { WaitlistForm } from "@/components/waitlist-form";
import { TextReveal } from "@/components/motion/text-reveal";
import { ScrollReveal } from "@/components/motion/scroll-reveal";

export const metadata: Metadata = {
  title: "Waitlist",
  description: "Join the AHVI waitlist.",
};

export default function WaitlistPage() {
  return (
    <PlainShell>
      <div className="flex min-h-[70vh] items-center justify-center px-5 py-16 sm:px-8 sm:py-24">
        <div className="w-full max-w-[480px]">
          <div className="mb-7.5 text-center">
            <div className="mb-4 text-[11px] tracking-[0.26em] text-muted">Waitlist</div>
            <h1 className="font-condensed text-[clamp(32px,4.6vw,46px)] font-semibold"><TextReveal text="Be early to AHVI." /></h1>
          </div>
          <ScrollReveal delay={0.15}>
            <WaitlistForm />
          </ScrollReveal>
        </div>
      </div>
    </PlainShell>
  );
}
