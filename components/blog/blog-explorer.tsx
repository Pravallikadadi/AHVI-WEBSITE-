"use client";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Search } from "lucide-react";
import { BlogCard } from "@/components/blog/blog-card";
import { BLOG_CATEGORIES } from "@/lib/blog-types";
import type { Blog } from "@/lib/blog-types";

const PAGE_SIZE = 6;

export function BlogExplorer({ initialBlogs, excludeId }: { initialBlogs: Blog[]; excludeId?: string }) {
  const searchParams = useSearchParams();
  const [blogs, setBlogs] = useState(initialBlogs.filter((b) => b.id !== excludeId));
  const [q, setQ] = useState("");
  const [category, setCategory] = useState(searchParams.get("category") || "All");
  const [loading, setLoading] = useState(false);
  const [visible, setVisible] = useState(PAGE_SIZE);

  useEffect(() => {
    const controller = new AbortController();
    setLoading(true);
    const params = new URLSearchParams();
    if (q) params.set("search", q);
    if (category !== "All") params.set("category", category);
    const t = setTimeout(() => {
      fetch("/api/blogs?" + params.toString(), { signal: controller.signal })
        .then((r) => r.json())
        .then((data) => {
          setBlogs((data.blogs || []).filter((b: Blog) => b.id !== excludeId));
          setVisible(PAGE_SIZE);
        })
        .catch(() => {})
        .finally(() => setLoading(false));
    }, 220);
    return () => {
      clearTimeout(t);
      controller.abort();
    };
  }, [q, category, excludeId]);

  const shown = blogs.slice(0, visible);

  return (
    <div>
      <div className="mb-8 flex flex-wrap gap-x-7 gap-y-2.5 border-b border-ink/10 pb-4">
        {["All", ...BLOG_CATEGORIES].map((c) => (
          <button
            key={c}
            onClick={() => setCategory(c)}
            aria-pressed={category === c}
            className={
              "relative pb-2.5 text-[12.5px] tracking-[0.14em] transition-colors " +
              (category === c ? "text-ink after:absolute after:inset-x-0 after:-bottom-[1px] after:h-[2px] after:bg-ink" : "text-muted2 hover:text-ink")
            }
          >
            {c}
          </button>
        ))}
      </div>
      <div className="relative mb-9 max-w-[460px]">
        <Search size={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted2" />
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search articles, styling tips, trends..."
          aria-label="Search blog posts"
          className="w-full border border-ink/15 bg-bg py-3 pl-11 pr-4 text-[14px] placeholder:text-muted"
        />
      </div>
      {loading ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="animate-pulse border border-ink/10">
              <div className="aspect-[16/9] bg-surface" />
              <div className="p-5">
                <div className="h-3 w-1/4 bg-surface" />
                <div className="mt-3 h-4 w-5/6 bg-surface" />
                <div className="mt-2 h-4 w-2/3 bg-surface" />
              </div>
            </div>
          ))}
        </div>
      ) : blogs.length === 0 ? (
        <div className="py-16 text-center">
          <p className="mb-4 text-[15px] text-muted">
            {q || category !== "All" ? "No articles found. Try a different search or category." : "No stories yet. We're preparing something worth reading."}
          </p>
          <Link href="/waitlist" className="text-[13px] tracking-[0.1em] text-accent">
            Join the Waitlist
          </Link>
        </div>
      ) : (
        <>
          <AnimatePresence mode="wait">
            <motion.div
              key={category + q}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3"
            >
              {shown.map((b, i) => (
                <motion.div
                  key={b.id}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-8%" }}
                  transition={{ duration: 0.4, delay: (i % PAGE_SIZE) * 0.05 }}
                  className="h-full"
                >
                  <BlogCard blog={b} />
                </motion.div>
              ))}
            </motion.div>
          </AnimatePresence>
          {visible < blogs.length && (
            <div className="mt-11 text-center">
              <button
                onClick={() => setVisible((v) => v + PAGE_SIZE)}
                className="border border-ink/20 px-7 py-3 text-[12.5px] tracking-[0.1em] text-ink transition-colors hover:border-ink hover:bg-ink hover:text-bg"
              >
                Load More Stories →
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
