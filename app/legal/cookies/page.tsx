import type { Metadata } from "next";
import { LEGAL_DETAILED } from "@/lib/legal-detailed-data";
import { LegalDocument } from "@/components/legal/legal-document";

export const metadata: Metadata = {
  title: "Cookie Policy",
  description: "How AHVI uses cookies and similar technologies across its website, app and services.",
};

export default function Page() {
  return <LegalDocument doc={LEGAL_DETAILED["cookies"]} />;
}
