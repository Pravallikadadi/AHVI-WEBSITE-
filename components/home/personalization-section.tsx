import { PersonalizationGrid } from "@/components/personalization-grid";
import { SectionLabel } from "@/components/home/section-label";

export function PersonalizationSection() {
  return (
    <section className="border-t border-ink/10 bg-bg">
      <div className="mx-auto max-w-[1600px] px-5 py-20 sm:px-8 sm:py-28">
        <div className="mb-12 max-w-[640px]">
          <SectionLabel label="Personalization" />
          <h2 className="mb-4 mt-4 font-condensed text-[clamp(28px,3.6vw,46px)] font-bold leading-tight">
            AHVI gets to know your style.
          </h2>
          <p className="text-[15.5px] leading-relaxed text-muted">
            Eight dimensions, learned quietly over time — never a form you have to fill in.
          </p>
        </div>

        <PersonalizationGrid />
      </div>
    </section>
  );
}
