import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { highlightAhvi } from "@/lib/ahvi-text";

export function FinalWaitlistCTA() {
  return (
    <section className="relative overflow-hidden bg-ink text-bg">
      <div className="pointer-events-none absolute left-1/2 top-[-60%] aspect-square w-[min(560px,80vw)] -translate-x-1/2 rounded-full border border-goldsoft/20" />
      <div className="relative mx-auto max-w-[640px] px-5 py-20 text-center sm:px-8 sm:py-24">
        <div className="mx-auto mb-5 h-px w-16 bg-gradient-to-r from-transparent via-goldsoft to-transparent" />
        <div className="mb-4 text-[11px] tracking-[0.26em] text-goldsoft">Ready when you are</div>
        <h2 className="mb-3 font-condensed text-[clamp(28px,4vw,44px)] font-semibold leading-tight">{highlightAhvi("Meet AHVI.")}</h2>
        <p className="mx-auto mb-7 max-w-[38ch] text-[15px] leading-relaxed text-bg/60">
          {highlightAhvi("Join the waitlist and be among the first to experience AHVI.")}
        </p>
        <Button asChild variant="gold">
          <Link href="/waitlist">
            Join the Waitlist <ArrowRight size={15} />
          </Link>
        </Button>
      </div>
    </section>
  );
}
