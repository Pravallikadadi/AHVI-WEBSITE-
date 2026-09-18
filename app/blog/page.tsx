import type { Metadata } from "next";
import { MarketingShell } from "@/components/shells/marketing-shell";
import { Newsletter } from "@/components/blog/newsletter";
import { FeaturedBlog } from "@/components/blog/featured-blog";
import { BlogExplorer } from "@/components/blog/blog-explorer";
import { TextReveal } from "@/components/motion/text-reveal";
import { listPublished } from "@/lib/blog-store";
import { highlightAhvi } from "@/lib/ahvi-text";

export const metadata: Metadata = {
  title: "Blog",
  description: "Wardrobe tips, styling ideas, and conscious living — all in one place.",
};

export default function BlogPage() {
  const listed = listPublished();
  const featured = listed.find((b) => b.featured) || listed[0] || null;
  const blogs = listed.filter((b) => b.id !== featured?.id);

  return (
    <MarketingShell>
      <section className="overflow-hidden bg-ink text-bg">
        <div className="mx-auto max-w-[720px] px-5 py-14 text-center sm:px-8 sm:py-20">
          <div className="mb-4 text-[11px] tracking-[0.24em] text-bg/50">{highlightAhvi("The AHVI Journal")}</div>
          <h1 className="mb-4 font-condensed text-[clamp(34px,4.6vw,52px)] font-semibold leading-tight">
            <TextReveal text="Style, prep and" /><br /><TextReveal text="plan, explained." delay={0.1} />
          </h1>
          <p className="mx-auto max-w-[46ch] text-[15px] leading-relaxed text-bg/60">
            {highlightAhvi(
              "Notes on wardrobes, AI styling, and the everyday prep and planning that make up a more put-together day with AHVI."
            )}
          </p>
          <a href="#journal" className="mt-6 inline-flex items-center gap-2.5 text-[12.5px] tracking-[0.1em] text-bg underline-offset-4 hover:underline">
            Explore the Journal →
          </a>
        </div>
      </section>

      <section className="mx-auto max-w-[1200px] px-5 py-14 sm:px-8 sm:py-20">
        {featured && (
          <div className="mb-12">
            <FeaturedBlog blog={featured} />
          </div>
        )}
        <BlogExplorer initialBlogs={blogs} excludeId={featured?.id} />
      </section>

      <Newsletter />
    </MarketingShell>
  );
}
