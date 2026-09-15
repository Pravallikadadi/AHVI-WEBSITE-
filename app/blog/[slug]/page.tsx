import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { MarketingShell } from "@/components/shells/marketing-shell";
import { BlueprintFrame } from "@/components/blueprint-frame";
import { Photo } from "@/components/media/photo";
import { BlogCard } from "@/components/blog/blog-card";
import { getBySlug, getRelated } from "@/lib/blog-store";

type Params = { slug: string };

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { slug } = await params;
  const blog = getBySlug(slug);
  if (!blog || blog.status !== "published") return { title: "Article not found" };
  return { title: blog.title, description: blog.excerpt };
}

export default async function BlogArticlePage({ params }: { params: Promise<Params> }) {
  const { slug } = await params;
  const blog = getBySlug(slug);
  if (!blog || blog.status !== "published") notFound();

  const related = getRelated(blog);

  return (
    <MarketingShell>
      <section className="mx-auto max-w-[760px] px-5 pb-6 pt-16 sm:px-8 sm:pt-24">
        <span className="mb-5 inline-flex w-fit border border-ink/20 px-3.5 py-1 text-[10.5px] tracking-[0.14em]">
          {blog.category}
        </span>
        <h1 className="mb-4.5 font-condensed text-[clamp(30px,4.6vw,48px)] font-semibold leading-tight">{blog.title}</h1>
        <div className="text-[12.5px] tracking-[0.06em] text-muted2">
          By {blog.author} · {blog.publishedAt ? new Date(blog.publishedAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : ""} ·{" "}
          {blog.readingTime}
        </div>
      </section>
      <section className="mx-auto max-w-[900px] px-5 pb-7 sm:px-8 sm:pb-11">
        <BlueprintFrame>
          <Photo src={blog.coverImage} alt={blog.title} ratio="16/9" />
        </BlueprintFrame>
      </section>
      <section
        className="prose mx-auto max-w-[680px] px-5 pb-16 text-[16.5px] leading-[1.75] text-ink/85 sm:px-8 sm:pb-24 [&_h2]:font-condensed [&_h2]:text-[26px] [&_h2]:font-semibold [&_h2]:mt-8 [&_h2]:mb-3.5 [&_blockquote]:border-l-2 [&_blockquote]:border-gold [&_blockquote]:pl-5.5 [&_blockquote]:italic [&_blockquote]:my-7 [&_ul]:list-disc [&_ul]:pl-5.5 [&_ul]:mb-5 [&_p]:mb-5 [&_a]:text-accent [&_a]:underline"
        dangerouslySetInnerHTML={{ __html: blog.content }}
      />
      {blog.tags?.length > 0 && (
        <div className="mx-auto flex max-w-[680px] flex-wrap gap-2 px-5 pb-10 sm:px-8">
          {blog.tags.map((t) => (
            <span key={t} className="border border-ink/15 px-3 py-1 text-[11px] tracking-[0.08em] text-muted">
              #{t}
            </span>
          ))}
        </div>
      )}
      {related.length > 0 && (
        <section className="mx-auto max-w-[1600px] border-t border-ink/[0.12] px-5 pb-16 pt-9 sm:px-8 sm:pb-24">
          <div className="mb-5.5 text-[11px] tracking-[0.24em] text-muted">More in this category</div>
          <div className="grid gap-8" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 260px), 1fr))" }}>
            {related.map((b) => (
              <BlogCard key={b.id} blog={b} />
            ))}
          </div>
        </section>
      )}
    </MarketingShell>
  );
}
