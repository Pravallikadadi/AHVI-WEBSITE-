"use client";
import { useState } from "react";
import { Copy, Check } from "lucide-react";
import { Button } from "@/components/ui/button";

export function ReferralDashboard() {
  const [copied, setCopied] = useState(false);
  const link = "ahvi.com/r/your-code";

  const copy = () => {
    navigator.clipboard?.writeText("https://" + link).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 2200);
  };

  return (
    <>
      <div className="grid gap-px bg-ink/10 sm:grid-cols-3">
        {[
          ["0", "Successful referrals"],
          ["+0", "Bonus uploads"],
          ["10 uploads", "Current access"],
        ].map(([v, l]) => (
          <div key={l} className="bg-bg p-7 text-center">
            <div className="font-condensed text-[40px] font-semibold">{v}</div>
            <div className="mt-1.5 text-[11px] tracking-[0.14em] text-ink">{l}</div>
          </div>
        ))}
      </div>
      <div id="ref-share" className="mt-8 flex flex-wrap items-center justify-between gap-4 border border-ink/10 p-6">
        <div>
          <div className="mb-1.5 text-[10px] tracking-[0.18em] text-ink">Your personal link</div>
          <span className="font-condensed text-[19px]">{link}</span>
        </div>
        <div className="flex flex-wrap gap-2.5">
          <Button variant="primary" size="sm" onClick={copy}>
            {copied ? (
              <>
                Copied <Check size={14} />
              </>
            ) : (
              <>
                Copy referral link <Copy size={14} />
              </>
            )}
          </Button>
          <Button asChild variant="outline" size="sm">
            <a href={"https://wa.me/?text=" + encodeURIComponent("Come style your wardrobe with AHVI — " + link)} target="_blank" rel="noopener">
              WhatsApp
            </a>
          </Button>
          <Button asChild variant="outline" size="sm">
            <a
              href={
                "mailto:?subject=" +
                encodeURIComponent("Try AHVI with me") +
                "&body=" +
                encodeURIComponent("I've been using AHVI to style my wardrobe — join with my link: " + link)
              }
            >
              Email
            </a>
          </Button>
        </div>
      </div>
    </>
  );
}
