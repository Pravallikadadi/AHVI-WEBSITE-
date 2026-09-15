import type { Metadata } from "next";
import { LEGAL } from "@/lib/legal-data";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "AHVI privacy policy — placeholder pending final legal review.",
};

export default function Page() {
  const legal = LEGAL["privacy"];
  return (
    <div className="mx-auto max-w-[680px] px-5 py-16 sm:px-8 sm:py-24">
      <h1 className="mb-2.5 font-condensed text-[clamp(30px,4vw,42px)] font-semibold">{legal.title}</h1>
      <p className="mb-7.5 text-[12.5px] tracking-[0.04em] text-muted2">Placeholder structure — pending final legal review.</p>
      {legal.body.map((p, i) => (
        <p key={i} className="mb-4.5 text-[15.5px] leading-relaxed text-ink/85">
          {p}
        </p>
      ))}
    </div>
  );
}
