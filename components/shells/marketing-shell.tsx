import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { FinalWaitlistCTA } from "@/components/final-waitlist-cta";

export function MarketingShell({ children, hideFinalCta = false }: { children: React.ReactNode; hideFinalCta?: boolean }) {
  return (
    <>
      <Navbar />
      <main className="pt-[71px]">{children}</main>
      {!hideFinalCta && <FinalWaitlistCTA />}
      <Footer />
    </>
  );
}
