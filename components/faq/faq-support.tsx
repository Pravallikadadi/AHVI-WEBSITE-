import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { highlightAhvi } from "@/lib/ahvi-text";

export function FAQSupport() {
  return (
    <section className="border-t border-ink/10 bg-surface">
      <div className="mx-auto max-w-[560px] px-5 py-16 text-center sm:px-8 sm:py-20">
        <h2 className="mb-3 font-serif text-[clamp(24px,3vw,32px)] font-semibold text-ink">Still have questions?</h2>
        <p className="mb-7 text-[14.5px] leading-relaxed text-muted">
          {highlightAhvi("Our team is here to help you get the most out of AHVI.")}
        </p>
        <div className="flex flex-wrap justify-center gap-3">
          <Button asChild variant="primary">
            <Link href="/waitlist">
              Join the Waitlist <ArrowRight size={15} />
            </Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/contact">Contact Support</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
