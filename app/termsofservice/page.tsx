import type { Metadata } from "next";
import { LEGAL_DETAILED } from "@/lib/legal-detailed-data";
import { LegalDocument } from "@/components/legal/legal-document";
import { LegalPageShell } from "@/components/legal/legal-page-shell";

export const metadata: Metadata = {
  title: "Terms of Service",
  description: "AHVI's Terms of Service — eligibility, accounts, AI recommendations, subscriptions and more.",
};

export default function Page() {
  return (
    <LegalPageShell>
      <LegalDocument doc={LEGAL_DETAILED["terms"]} />
    </LegalPageShell>
  );
}
