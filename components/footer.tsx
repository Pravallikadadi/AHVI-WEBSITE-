import Link from "next/link";
import { footerColumns } from "@/lib/site-data";
import { AhviLogo } from "@/components/ahvi-logo";

const currentYear = new Date().getFullYear();
console.log(currentYear);

export function Footer({ simple = false }: { simple?: boolean }) {
  const columns = simple ? footerColumns.filter((c) => c.heading === "Legal") : footerColumns;

  return (
    <footer className="border-t border-bg/10 bg-ink text-bg">
      <div className="mx-auto max-w-[1600px] px-5 py-14 sm:px-8 sm:py-20">
        <div className="grid gap-12 sm:grid-cols-2 lg:grid-cols-[1.3fr_1fr_1fr_1fr]">
          <div>
            <Link href="/" className="ahvi-wordmark flex items-center gap-1.5 font-condensed text-[34px] tracking-[0.1em] text-bg">
              <AhviLogo size={28} className="text-bg" />
              AHVI
            </Link>
            <p className="mt-4 max-w-[300px] text-[13.5px] leading-relaxed text-bg/50">
              Your personal AI stylist — deciding what to wear, what to prepare and what&apos;s next.
            </p>
          </div>
          {columns.map((col) => (
            <div key={col.heading}>
              <div className="mb-4 text-[10.5px] tracking-[0.2em] text-bg/40">{col.heading}</div>
              <nav className="flex flex-col gap-2.5">
                {col.links.map((l) => (
                  <Link key={l.label} href={l.href} className="text-[13.5px] text-bg/75 transition-colors hover:text-bg">
                    {l.label}
                  </Link>
                ))}
              </nav>
            </div>
          ))}
        </div>
        <div className="mt-14 flex flex-wrap items-center justify-between gap-4 border-t border-bg/10 pt-6 text-[11.5px] tracking-[0.06em] text-bg/40">
          <span>{currentYear} AHVI.</span>
          <span className="flex flex-wrap gap-4">
            <span>App Store — coming soon</span>
            <span>Google Play — coming soon</span>
          </span>
        </div>
      </div>
    </footer>
  );
}
