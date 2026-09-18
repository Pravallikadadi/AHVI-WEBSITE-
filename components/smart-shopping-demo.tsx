"use client";
import { useState } from "react";
import { Photo } from "@/components/media/photo";
import { Button } from "@/components/ui/button";
import { highlightAhvi } from "@/lib/ahvi-text";

export function SmartShoppingDemo() {
  const [choice, setChoice] = useState<"buy" | "skip" | null>(null);
  const verdict =
    choice === "buy"
      ? "Added. It closes the gap between 23 outfits you couldn't complete."
      : choice === "skip"
      ? "Skipped — and nothing is lost. You already own two pieces doing this job."
      : "This could work. Good addition to your current wardrobe.";

  return (
    <div className="grid justify-items-center gap-4">
      <div
        className="w-full max-w-[220px] border border-ink/10 bg-bg transition-all duration-500"
        style={{
          transform: choice === "buy" ? "translateY(-10px)" : choice === "skip" ? "translateX(-20px) rotate(-2deg)" : "none",
          opacity: choice === "skip" ? 0.4 : 1,
        }}
      >
        <Photo
          src="/images/smart-shopping-outfit.webp"
          alt="A black top, white wide-leg trousers, black handbag and white sneakers under consideration"
          ratio="3/4"
         
          className="bg-surface"
        />
        <div className="p-4">
          <div className="text-[10.5px] tracking-[0.2em] text-muted">Under consideration</div>
          <div className="mt-1 font-condensed text-[20px] font-semibold leading-tight">Relaxed neutral layer</div>
        </div>
      </div>
      <div className="w-full max-w-[340px] border border-goldsoft/20 bg-ink p-5 text-bg">
        <div className="mb-2 text-[10.5px] tracking-[0.2em] text-goldsoft">{highlightAhvi("AHVI says")}</div>
        <p className="mb-4 text-[15px] leading-relaxed text-bg/85">{verdict}</p>
        <div className="flex gap-2.5">
          <Button variant="gold" size="sm" className="flex-1" onClick={() => setChoice("buy")}>
            Buy
          </Button>
          <Button variant="outline" size="sm" className="flex-1 border-bg/30 text-bg hover:bg-bg/10" onClick={() => setChoice("skip")}>
            Skip
          </Button>
        </div>
      </div>
    </div>
  );
}
