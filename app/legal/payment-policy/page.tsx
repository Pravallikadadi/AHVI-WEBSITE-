import type { Metadata } from "next";
import { LEGAL_DETAILED } from "@/lib/legal-detailed-data";
import { LegalDocument } from "@/components/legal/legal-document";

export const metadata: Metadata = {
  title: "Payment Policy",
  description: "AHVI's payment and subscription policy — pricing, renewals, cancellations and refunds.",
};

export default function Page() {
  return <LegalDocument doc={LEGAL_DETAILED["payment-policy"]} />;
}
