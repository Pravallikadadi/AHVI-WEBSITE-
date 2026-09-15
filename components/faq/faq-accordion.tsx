"use client";
import { useMemo, useState } from "react";
import { faqData } from "@/lib/faq-data";
import { FAQItem } from "@/components/faq/faq-item";
import { FAQCategories } from "@/components/faq/faq-categories";

export function FAQAccordion() {
  const [category, setCategory] = useState("All");
  const [search, setSearch] = useState("");
  const [openId, setOpenId] = useState<string | null>(null);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return faqData.filter((f) => {
      const matchesCategory = category === "All" || f.category === category;
      const matchesSearch = !q || f.question.toLowerCase().includes(q) || f.answer.toLowerCase().includes(q);
      return matchesCategory && matchesSearch;
    });
  }, [category, search]);

  return (
    <div className="mx-auto max-w-[720px] px-5 pb-20 sm:px-8">
      <FAQCategories active={category} onChange={setCategory} search={search} onSearch={setSearch} />
      {filtered.length === 0 ? (
        <div className="py-14 text-center">
          <p className="mb-1.5 text-[15px] font-medium text-ink">No questions found.</p>
          <p className="text-[13.5px] text-muted">Try a different search or browse another category.</p>
        </div>
      ) : (
        <div>
          {filtered.map((item) => (
            <FAQItem key={item.id} item={item} open={openId === item.id} onToggle={() => setOpenId((cur) => (cur === item.id ? null : item.id))} />
          ))}
        </div>
      )}
    </div>
  );
}
