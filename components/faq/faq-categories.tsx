"use client";
import { Search } from "lucide-react";
import { faqCategories } from "@/lib/faq-data";

export function FAQCategories({
  active,
  onChange,
  search,
  onSearch,
}: {
  active: string;
  onChange: (c: string) => void;
  search: string;
  onSearch: (v: string) => void;
}) {
  const cats = ["All", ...faqCategories];
  return (
    <div className="mb-9">
      <div className="relative mx-auto mb-6 max-w-[480px]">
        <Search size={15} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-muted2" />
        <input
          type="text"
          value={search}
          onChange={(e) => onSearch(e.target.value)}
          placeholder="Search questions..."
          aria-label="Search FAQs"
          className="w-full border border-ink/15 bg-bg py-3 pl-10 pr-4 text-[13.5px] text-ink placeholder:text-muted2 focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent"
        />
      </div>
      <div
        role="tablist"
        aria-label="FAQ categories"
        className="flex gap-2 overflow-x-auto pb-1"
        style={{ scrollbarWidth: "none" }}
      >
        {cats.map((c) => {
          const isActive = active === c;
          return (
            <button
              key={c}
              type="button"
              role="tab"
              aria-selected={isActive}
              onClick={() => onChange(c)}
              className={
                "shrink-0 whitespace-nowrap border px-4 py-2 text-[12.5px] tracking-[0.02em] transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent " +
                (isActive ? "border-goldsoft bg-ink text-goldsoft" : "border-ink/15 text-muted hover:border-ink/30")
              }
            >
              {c}
            </button>
          );
        })}
      </div>
    </div>
  );
}
