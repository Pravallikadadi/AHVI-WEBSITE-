import type { Metadata } from "next";
import { MarketingShell } from "@/components/shells/marketing-shell";
import { Newsletter } from "@/components/blog/newsletter";
import { FeaturedBlog } from "@/components/blog/featured-blog";
import { BlogExplorer } from "@/components/blog/blog-explorer";
import { Photo } from "@/components/media/photo";
import { TextReveal } from "@/components/motion/text-reveal";
import { ImageReveal } from "@/components/motion/image-reveal";
import { getFeatured, listPublished } from "@/lib/blog-store";

export const metadata: Metadata = {
  title: "Blog",
  description: "Wardrobe tips, styling ideas, and conscious living — all in one place.",
};

export default function BlogPage() {
  const featured = getFeatured();
  const blogs = listPublished().filter((b) => b.id !== featured?.id);

  return (
    <MarketingShell>
      <section className="overflow-hidden bg-ink text-bg">
        <div className="mx-auto grid max-w-[1600px] items-center gap-8 px-5 py-14 sm:px-8 sm:py-16 lg:grid-cols-2">
          <div>
            <div className="mb-4 text-[11px] tracking-[0.24em] text-bg/50">The AHVI Journal</div>
            <h1 className="mb-4 font-condensed text-[clamp(34px,4.6vw,52px)] font-semibold leading-tight">
              <TextReveal text="Style, prep and" /><br /><TextReveal text="plan, explained." delay={0.1} />
            </h1>
            <p className="max-w-[46ch] text-[15px] leading-relaxed text-bg/60">
              Notes on wardrobes, AI styling, and the everyday prep and planning that make up a more put-together day
              with AHVI.
            </p>
            <a href="#journal" className="mt-6 inline-flex items-center gap-2.5 text-[12.5px] tracking-[0.1em] text-bg underline-offset-4 hover:underline">
              Explore the Journal →
            </a>
          </div>
          <div className="relative overflow-hidden">
            <ImageReveal>
              <Photo src="/images/blog-hero.webp" alt="The AHVI Journal — style, prep and plan" ratio="16/9" className="bg-surface " />
            </ImageReveal>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-[1600px] px-5 py-14 sm:px-8 sm:py-20">
        {featured && (
          <div className="mb-12">
            <FeaturedBlog blog={featured} />
          </div>
        )}
        <BlogExplorer initialBlogs={blogs} />
      </section>

      <Newsletter />
    </MarketingShell>
  );
}
