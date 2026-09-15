import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";

export function PlainShell({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Navbar />
      <main className="min-h-[60vh] pt-[71px]">{children}</main>
      <Footer />
    </>
  );
}
