import type { Metadata } from "next";
import Link from "next/link";
import { MarketingShell } from "@/components/shells/marketing-shell";
import { BlueprintFrame } from "@/components/blueprint-frame";
import { roles } from "@/lib/site-data";
import { highlightAhvi } from "@/lib/ahvi-text";

export const metadata: Metadata = {
  title: "Careers",
  description: "Open roles and partner programs at AHVI.",
};

export default function CareersPage() {
  return (
    <MarketingShell>
      <section className="mx-auto max-w-[1000px] px-5 pb-6 pt-16 sm:px-8 sm:pt-24">
        <div className="mb-5 text-[11px] tracking-[0.26em] text-muted">Careers</div>
        <h1 className="font-condensed text-[clamp(34px,5.2vw,64px)] font-semibold leading-tight">
          Build the future
          <br />
          of personal AI.
        </h1>
      </section>
      <section className="mx-auto max-w-[1000px] px-5 pb-3.5 pt-6 sm:px-8">
        <div className="text-[11px] tracking-[0.22em] text-muted">Open roles</div>
      </section>
      <section className="mx-auto grid max-w-[1000px] gap-px bg-ink/10 px-5 pb-12 pt-3.5 sm:px-8 sm:pb-16">
        {roles.map((r) => (
          <div key={r.title} className="flex flex-wrap items-center justify-between gap-3.5 bg-bg p-5.5">
            <div>
              <div className="font-condensed text-[19px] font-semibold">{r.title}</div>
              <div className="mt-1 text-[12.5px] text-muted">{r.place}</div>
            </div>
            <span className="border border-ink/20 px-3.5 py-1.5 text-[10.5px] tracking-[0.12em]">{r.type}</span>
          </div>
        ))}
      </section>
      <section className="mx-auto grid max-w-[1000px] gap-5 px-5 pb-16 sm:px-8 sm:pb-24" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 280px), 1fr))" }}>
        <BlueprintFrame className="p-7">
          <div className="mb-2.5 font-condensed text-[22px] font-semibold">Growth Partner Program</div>
          <p className="mb-4 text-[14.5px] leading-relaxed text-muted">{highlightAhvi("For operators who want to help AHVI grow into new markets and audiences.")}</p>
          <Link href="/contact" className="text-[12.5px] tracking-[0.1em] text-accent">
            Get in touch →
          </Link>
        </BlueprintFrame>
        <BlueprintFrame className="p-7">
          <div className="mb-2.5 font-condensed text-[22px] font-semibold">Brand Partner Program</div>
          <p className="mb-4 text-[14.5px] leading-relaxed text-muted">{highlightAhvi("For fashion and lifestyle brands who want to reach AHVI's members.")}</p>
          <Link href="/contact" className="text-[12.5px] tracking-[0.1em] text-accent">
            Get in touch →
          </Link>
        </BlueprintFrame>
      </section>
    </MarketingShell>
  );
}
