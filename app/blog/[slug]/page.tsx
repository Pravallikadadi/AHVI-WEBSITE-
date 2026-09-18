import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { MarketingShell } from "@/components/shells/marketing-shell";
import { Photo } from "@/components/media/photo";
import { BlogCard } from "@/components/blog/blog-card";
import { ShapeCarousel } from "@/components/blog/shape-carousel";
import { getBySlug, getRelated, listPublished } from "@/lib/blog-store";
import type { Blog } from "@/lib/blog-types";

type Params = { slug: string };

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { slug } = await params;
  const blog = getBySlug(slug);
  if (!blog || blog.status !== "published") return { title: "Article not found" };
  return { title: blog.title, description: blog.excerpt };
}

function formatDate(d: string | null) {
  if (!d) return "";
  return new Date(d).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

/** Splits the stored content HTML into per-<h2> chunks so editorial images can be interleaved
    between sections instead of dumped as one long block. The first chunk (intro paragraphs before
    the first <h2>) is kept as its own section. */
function splitSections(html: string): string[] {
  return html.split(/(?=<h2>)/g).filter(Boolean);
}

function sectionHeading(section: string): string | null {
  const m = section.match(/<h2>(.*?)<\/h2>/);
  return m ? m[1].replace(/<[^>]+>/g, "") : null;
}

function extractQuote(html: string): string | null {
  const m = html.match(/<blockquote>([\s\S]*?)<\/blockquote>/);
  return m ? m[1].replace(/<[^>]+>/g, "") : null;
}

const proseClasses =
  "[&_h2]:font-condensed [&_h2]:text-[24px] sm:[&_h2]:text-[27px] [&_h2]:font-semibold [&_h2]:leading-snug [&_h2]:mt-2 [&_h2]:mb-4 " +
  "[&_blockquote]:border-l-2 [&_blockquote]:border-gold [&_blockquote]:pl-5.5 [&_blockquote]:italic [&_blockquote]:my-7 [&_blockquote]:text-[19px] [&_blockquote]:leading-relaxed [&_blockquote]:text-ink " +
  "[&_ul]:list-disc [&_ul]:pl-5.5 [&_ul]:mb-5 [&_ul]:space-y-2 [&_p]:mb-5 [&_a]:text-accent [&_a]:underline [&_strong]:text-ink";

export default async function BlogArticlePage({ params }: { params: Promise<Params> }) {
  const { slug } = await params;
  const blog = getBySlug(slug);
  if (!blog || blog.status !== "published") notFound();

  const related = getRelated(blog);
  const all = listPublished();
  const idx = all.findIndex((b) => b.id === blog.id);
  const prevStory = idx > 0 ? all[idx - 1] : null;
  const nextStory = idx >= 0 && idx < all.length - 1 ? all[idx + 1] : null;

  const sections = splitSections(blog.content);
  const contentImages = blog.contentImages || [];
  const keyQuote = extractQuote(blog.content) || blog.excerpt;
  const exploreLinks = related.slice(0, 3);

  return (
    <MarketingShell>
      {/* Header — left-aligned editorial title/meta block (no hero image) */}
      <section className="border-b border-ink/10 bg-bg">
        <div className="mx-auto max-w-[1200px] px-5 pb-12 pt-14 sm:px-8 sm:pb-16 sm:pt-20">
          <Link
            href="/blog"
            className="mb-7 inline-flex items-center gap-2 text-[12.5px] tracking-[0.08em] text-muted transition-colors hover:text-ink"
          >
            <ArrowLeft size={14} /> Back to Stories
          </Link>

          <span className="mb-5 inline-flex w-fit border border-ink/20 px-3.5 py-1 text-[10.5px] tracking-[0.14em]">{blog.category}</span>
          <h1 className="mb-5 max-w-[20ch] font-condensed text-[clamp(32px,5vw,56px)] font-semibold leading-[1.05]">{blog.title}</h1>
          <p className="mb-6 max-w-[62ch] text-[16px] leading-relaxed text-muted sm:text-[17px]">{blog.excerpt}</p>
          <div className="text-[12.5px] tracking-[0.06em] text-muted2">
            By {blog.author} · {formatDate(blog.publishedAt)} · {blog.readingTime} read
          </div>
        </div>
      </section>

      {/* Content — main story on the left, sticky exploratory sidebar on the right */}
      <section className="mx-auto max-w-[1200px] px-5 py-12 sm:px-8 sm:py-16 lg:grid lg:grid-cols-[minmax(0,1fr)_300px] lg:items-start lg:gap-14">
        <article className={"min-w-0 max-w-[680px] text-[16.5px] leading-[1.75] text-ink/85 " + proseClasses}>
          {sections.map((section, i) => {
            const heading = sectionHeading(section);
            const carousel =
              blog.shapeCarousels && heading === "Men's Body Shapes"
                ? { title: "Men's Body Shapes", items: blog.shapeCarousels.men, ratio: "2/3" }
                : blog.shapeCarousels && heading === "Women's Body Shapes"
                  ? { title: "Women's Body Shapes", items: blog.shapeCarousels.women, ratio: "2/3" }
                  : blog.galleryCarousel && heading === blog.galleryCarousel.afterHeading
                    ? { title: blog.galleryCarousel.title, items: blog.galleryCarousel.items, ratio: "1/1" }
                    : null;
            const image = !carousel && i > 0 && i % 2 === 0 ? contentImages[Math.floor(i / 2) - 1] : null;
            return (
              <div key={i}>
                <div dangerouslySetInnerHTML={{ __html: section }} />
                {carousel && <ShapeCarousel title={carousel.title} items={carousel.items} ratio={carousel.ratio} />}
                {image && (
                  <figure className="not-prose -mx-5 my-9 sm:mx-0">
                    <Photo src={image} alt={heading ? `${blog.title} — ${heading}` : blog.title} ratio="4/3" fit="contain" className="border border-ink/10 bg-bg" />
                    {heading && <figcaption className="mt-2.5 text-[12px] tracking-[0.04em] text-muted2">{heading}</figcaption>}
                  </figure>
                )}
              </div>
            );
          })}

          {blog.tags?.length > 0 && (
            <div className="mt-10 flex flex-wrap gap-2 border-t border-ink/10 pt-8">
              {blog.tags.map((t) => (
                <span key={t} className="border border-ink/15 px-3 py-1 text-[11px] tracking-[0.08em] text-muted">
                  #{t}
                </span>
              ))}
            </div>
          )}
        </article>

        <aside className="mt-12 space-y-8 lg:sticky lg:top-[100px] lg:mt-0">
          {contentImages[0] && (
            <div>
              <Photo src={contentImages[0]} alt={`${blog.title} — visual highlight`} ratio="4/5" fit="contain" className="border border-ink/10 bg-bg" />
            </div>
          )}
          <div className="border border-ink/10 bg-surface px-5 py-6">
            <div className="mb-2.5 text-[11px] font-bold uppercase tracking-[0.12em] text-muted2">Key Insight</div>
            <p className="font-condensed text-[17px] font-medium leading-snug text-ink">{keyQuote}</p>
          </div>
          {exploreLinks.length > 0 && (
            <div className="border border-ink/10 px-5 py-6">
              <div className="mb-3.5 text-[11px] font-bold uppercase tracking-[0.12em] text-muted2">Explore More</div>
              <ul className="space-y-3.5">
                {exploreLinks.map((b) => (
                  <li key={b.id}>
                    <Link href={"/blog/" + b.slug} className="group flex items-start justify-between gap-2 text-[13.5px] leading-snug text-ink">
                      <span className="transition-colors group-hover:text-accent">{b.title}</span>
                      <ArrowRight size={13} className="mt-0.5 shrink-0 text-muted2 transition-transform group-hover:translate-x-1" />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </aside>
      </section>

      {/* Previous / Next story navigation */}
      {(prevStory || nextStory) && (
        <section className="border-t border-ink/10 bg-surface">
          <div className="mx-auto grid max-w-[1200px] grid-cols-1 gap-px bg-ink/10 px-5 sm:grid-cols-2 sm:px-8">
            <StoryNavLink story={prevStory} direction="prev" />
            <StoryNavLink story={nextStory} direction="next" />
          </div>
        </section>
      )}

      {related.length > 0 && (
        <section className="mx-auto max-w-[1200px] border-t border-ink/[0.12] px-5 pb-16 pt-9 sm:px-8 sm:pb-24">
          <div className="mb-5.5 text-[11px] tracking-[0.24em] text-muted">Explore More Stories</div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3">
            {related.map((b) => (
              <BlogCard key={b.id} blog={b} />
            ))}
          </div>
        </section>
      )}
    </MarketingShell>
  );
}

function StoryNavLink({ story, direction }: { story: Blog | null; direction: "prev" | "next" }) {
  if (!story) return <div className="hidden bg-surface sm:block sm:px-8 sm:py-8" />;
  return (
    <Link
      href={"/blog/" + story.slug}
      className={"group flex flex-col bg-surface px-5 py-8 sm:px-8 " + (direction === "next" ? "sm:items-end sm:text-right" : "")}
    >
      <span className="mb-2 inline-flex items-center gap-1.5 text-[11px] tracking-[0.12em] text-muted2">
        {direction === "prev" ? (
          <>
            <ArrowLeft size={12} /> Previous Story
          </>
        ) : (
          <>
            Next Story <ArrowRight size={12} />
          </>
        )}
      </span>
      <span className="max-w-[36ch] font-condensed text-[19px] font-semibold leading-snug text-ink transition-colors group-hover:text-accent">
        {story.title}
      </span>
    </Link>
  );
}
