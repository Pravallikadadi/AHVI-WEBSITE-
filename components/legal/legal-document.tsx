import type { LegalDetailedDoc } from "@/lib/legal-detailed-data";
import { highlightAhvi } from "@/lib/ahvi-text";

function slugify(heading: string) {
  return heading
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

/** Renders a fully-drafted legal document (Privacy, Terms, Payment Policy, Cookie Policy) — hero, a
    table of contents, numbered sections, sub-headings, lists and tables — from structured content, so
    every legal page shares one premium, consistent layout. */
export function LegalDocument({ doc }: { doc: LegalDetailedDoc }) {
  const toc = doc.sections.map((s) => ({ heading: s.heading, id: slugify(s.heading) }));

  return (
    <div>
      <div className="border-b border-ink/10 bg-surface">
        <div className="mx-auto max-w-[800px] px-5 pb-10 pt-14 sm:px-8 sm:pb-14 sm:pt-20">
          <div className="ahvi-wordmark ahvi-wordmark-light mb-5 text-[11px] tracking-[0.28em] text-muted sm:mb-6">AHVI</div>
          <h1 className="mb-5 font-condensed text-[clamp(32px,5.4vw,52px)] font-semibold leading-[1.03] sm:mb-6">
            {highlightAhvi(doc.title)}
          </h1>
          {doc.intro.map((p, i) => (
            <p key={i} className="mb-3.5 max-w-[62ch] text-[15px] leading-relaxed text-muted last:mb-0 sm:text-[16px]">
              {highlightAhvi(p)}
            </p>
          ))}
          <div className="mt-6 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-[11.5px] tracking-[0.04em] text-muted2 sm:mt-7">
            {doc.effectiveDate && <span>Effective Date: {doc.effectiveDate}</span>}
            {doc.effectiveDate && <span aria-hidden className="hidden sm:inline">·</span>}
            <span>Last Updated: {doc.lastUpdated}</span>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-[1000px] px-5 py-12 sm:px-8 sm:py-16 lg:grid lg:grid-cols-[200px_1fr] lg:items-start lg:gap-14">
        {/* Mobile/tablet: collapsible contents block */}
        <details className="group mb-10 rounded-lg border border-ink/10 lg:hidden">
          <summary className="flex cursor-pointer list-none items-center justify-between px-5 py-4 text-[12.5px] font-bold uppercase tracking-[0.12em] text-ink">
            Contents
            <span className="text-muted2 transition-transform duration-200 group-open:rotate-180">⌄</span>
          </summary>
          <nav className="border-t border-ink/10 px-5 py-3">
            <ul className="flex flex-col gap-1">
              {toc.map((t) => (
                <li key={t.id}>
                  <a href={`#${t.id}`} className="block py-1.5 text-[14px] leading-relaxed text-muted transition-colors hover:text-ink">
                    {t.heading}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </details>

        {/* Desktop: sticky sidebar TOC */}
        <nav className="sticky top-[95px] hidden max-h-[calc(100vh-120px)] overflow-y-auto pb-10 lg:block">
          <div className="mb-3 text-[11px] font-bold uppercase tracking-[0.14em] text-muted2">Contents</div>
          <ul className="flex flex-col gap-0.5 border-l border-ink/10">
            {toc.map((t) => (
              <li key={t.id}>
                <a
                  href={`#${t.id}`}
                  className="block border-l-2 border-transparent py-1.5 pl-4 text-[13px] leading-snug text-muted transition-colors hover:border-ink/30 hover:text-ink"
                >
                  {t.heading}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="min-w-0">
          {doc.sections.map((section, si) => (
            <section
              key={si}
              id={toc[si].id}
              className="scroll-mt-[100px] border-l-2 border-ink/10 py-1 pl-5 first:mt-0 [&:not(:first-child)]:mt-12 sm:[&:not(:first-child)]:mt-14"
            >
              <h2 className="mb-4 font-condensed text-[20px] font-bold leading-snug sm:text-[23px]">{section.heading}</h2>
              {section.blocks.map((block, bi) => {
                if (block.type === "p") {
                  return (
                    <p key={bi} className="mb-3.5 text-[14.5px] leading-[1.7] text-ink/80 sm:text-[15px]">
                      {highlightAhvi(block.text)}
                    </p>
                  );
                }
                if (block.type === "sub") {
                  return (
                    <div key={bi} className="mb-2.5 mt-6 text-[11px] font-bold uppercase tracking-[0.16em] text-muted2 first:mt-0">
                      {block.text}
                    </div>
                  );
                }
                if (block.type === "list") {
                  return (
                    <ul key={bi} className="mb-4 list-disc space-y-2 pl-5 text-[14.5px] leading-[1.65] text-ink/80 marker:text-ink/30 sm:text-[15px]">
                      {block.items.map((item, ii) => (
                        <li key={ii}>{item}</li>
                      ))}
                    </ul>
                  );
                }
                return (
                  <div key={bi} className="mb-4.5 overflow-x-auto rounded-lg border border-ink/10">
                    <table className="w-full min-w-[420px] border-collapse text-left text-[13.5px]">
                      <thead>
                        <tr className="border-b border-ink/10 bg-surface">
                          {block.headers.map((h, hi) => (
                            <th key={hi} className="px-4 py-2.5 font-semibold text-ink">
                              {h}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {block.rows.map((row, ri) => (
                          <tr key={ri} className="border-b border-ink/10 last:border-b-0">
                            {row.map((cell, ci) => (
                              <td key={ci} className="px-4 py-2.5 align-top text-ink/80">
                                {cell}
                              </td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                );
              })}
            </section>
          ))}

          <section className="mt-12 rounded-lg border border-ink/10 bg-surface px-6 py-7 sm:mt-14 sm:px-8 sm:py-8">
            <h2 className="mb-3 font-condensed text-[17px] font-bold uppercase tracking-[0.1em]">Contact</h2>
            <div className="text-[14.5px] font-semibold text-ink">{doc.contact.heading}</div>
            {doc.contact.lines.map((l, i) => (
              <p key={i} className="mt-1 text-[14.5px] leading-relaxed text-ink/80">
                {l}
              </p>
            ))}
          </section>
        </div>
      </div>
    </div>
  );
}
