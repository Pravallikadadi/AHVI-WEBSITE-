import { LegalPageShell } from "@/components/legal/legal-page-shell";

export default function LegalLayout({ children }: { children: React.ReactNode }) {
  return <LegalPageShell>{children}</LegalPageShell>;
}
