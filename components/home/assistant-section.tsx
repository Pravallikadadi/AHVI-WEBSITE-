import { SectionLabel } from "@/components/home/section-label";
import { WaitlistCta } from "@/components/waitlist-cta";

export function AssistantSection() {
  return (
    <section className="border-t border-ink/10 bg-bg">
      <div className="mx-auto max-w-[1000px] px-5 py-14 text-center sm:px-8 sm:py-28">
        <SectionLabel label="Your personal AI Assistant" />
        <h2 className="mx-auto mb-6 mt-5 max-w-[22ch] font-condensed text-[clamp(30px,4.4vw,58px)] font-semibold leading-[1.02]">
          What if everything you needed was already in one place?
        </h2>
        <p className="mx-auto mb-10 max-w-[52ch] text-[15.5px] leading-relaxed text-muted">
          Style, Prep and Plan aren&apos;t three apps — they&apos;re one assistant that already knows your wardrobe,
          your schedule and your day.
        </p>
        <div className="mx-auto flex w-fit">
          <WaitlistCta />
        </div>
      </div>
    </section>
  );
}
