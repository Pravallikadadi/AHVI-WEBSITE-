import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { AhviCtaBlock } from "@/components/ahvi-cta-block";

/** Shared chrome for every legal page (Privacy, Terms, Payment Policy, Cookies) — same navbar, the homepage's "Style. Prep. Plan." CTA, and the full footer, so all four stay in sync. */
export function LegalPageShell({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Navbar />
      <main className="pt-[71px]">{children}</main>
      <AhviCtaBlock />
      <Footer />
    </>
  );
}
