import type { Metadata } from "next";
import { LEGAL_DETAILED } from "@/lib/legal-detailed-data";
import { LegalDocument } from "@/components/legal/legal-document";
import { LegalPageShell } from "@/components/legal/legal-page-shell";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "How AHVI collects, uses, stores, shares and protects your personal information.",
};

export default function Page() {
  return (
    <LegalPageShell>
      <LegalDocument doc={LEGAL_DETAILED["privacy"]} />
    </LegalPageShell>
  );
}
