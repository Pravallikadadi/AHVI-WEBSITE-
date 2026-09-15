import type { Metadata } from "next";
import { MarketingShell } from "@/components/shells/marketing-shell";
import { ContactForm } from "@/components/contact-form";

export const metadata: Metadata = {
  title: "Contact",
  description: "Get in touch with the AHVI team.",
};

export default function ContactPage() {
  return (
    <MarketingShell>
      <div className="mx-auto max-w-[600px] px-5 py-16 sm:px-8 sm:py-24">
        <div className="mb-4.5 text-[11px] tracking-[0.26em] text-muted">Contact</div>
        <h1 className="mb-7.5 font-condensed text-[clamp(30px,4vw,42px)] font-semibold">Say hello.</h1>
        <ContactForm />
      </div>
    </MarketingShell>
  );
}
