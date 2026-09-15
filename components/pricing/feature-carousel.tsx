"use client";
import { useReducedMotion } from "framer-motion";
import { FeatureCard } from "@/components/pricing/feature-card";
import { premiumFeatures } from "@/lib/pricing-data";

export function FeatureCarousel() {
  const reduce = useReducedMotion();
  const track = reduce ? premiumFeatures : [...premiumFeatures, ...premiumFeatures];

  return (
    <div className="relative">
      <div className="mb-5 text-[11px] tracking-[0.24em] text-muted">What you get</div>
      <div
        className="overflow-x-hidden"
        style={{ scrollbarWidth: "none" }}
        onMouseEnter={(e) => {
          const el = e.currentTarget.querySelector<HTMLElement>("[data-marquee-track]");
          if (el) el.style.animationPlayState = "paused";
        }}
        onMouseLeave={(e) => {
          const el = e.currentTarget.querySelector<HTMLElement>("[data-marquee-track]");
          if (el) el.style.animationPlayState = "running";
        }}
      >
        <div
          data-marquee-track
          role="list"
          aria-label="AHVI Premium features"
          className="flex w-max gap-4 pb-2"
          style={{
            animation: reduce ? "none" : "ahvi-feature-marquee 32s linear infinite",
          }}
        >
          {track.map((f, i) => (
            <div key={f.id + i} role="listitem" className="ahvi-marquee-card shrink-0">
              <FeatureCard feature={f} />
            </div>
          ))}
        </div>
      </div>
      <style jsx global>{`
        @keyframes ahvi-feature-marquee {
          from { transform: translateX(0); }
          to { transform: translateX(-50%); }
        }
        .ahvi-marquee-card { flex: 0 0 260px; width: 260px; }
        @media (max-width: 640px) {
          .ahvi-marquee-card { flex-basis: 220px; width: 220px; }
        }
      `}</style>
    </div>
  );
}
