import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Photo } from "@/components/media/photo";
import { AnimatedCard } from "@/components/motion/animated-card";
import { ImageReveal } from "@/components/motion/image-reveal";
import type { Blog } from "@/lib/blog-types";

function formatDate(d: string | null) {
  if (!d) return "";
  return new Date(d).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

/** Every card renders at an identical size regardless of title/excerpt length: a fixed 3:2 image box
    (measured against the actual uploaded cover photos, which cluster around a 3:2 ratio — much closer
    than 16:9, so "contain" only letterboxes slightly instead of leaving large empty bands), a
    title/excerpt clamped to a consistent number of lines, and "Read Story" pinned to the bottom via
    mt-auto. All cards share one size — there is no "large"/featured variant in the grid. */
export function BlogCard({ blog }: { blog: Blog }) {
  return (
    <Link href={"/blog/" + blog.slug} className="group flex h-full flex-col">
      <AnimatedCard className="flex h-full flex-col border border-ink/10 bg-bg transition-colors duration-300 hover:border-ink/25">
        <ImageReveal>
          <Photo
            src={blog.coverImage}
            alt={blog.title}
            ratio="3/2"
            fit="contain"
            className="bg-bg transition-transform duration-500 group-hover:scale-[1.03]"
          />
        </ImageReveal>
        <div className="flex flex-1 flex-col p-5">
          <div className="mb-2 text-[11px] font-semibold tracking-[0.14em] text-accent">{blog.category}</div>
          <div className="mb-2 line-clamp-2 min-h-[48px] font-condensed text-[19px] font-semibold leading-tight text-ink">{blog.title}</div>
          <p className="mb-4 line-clamp-3 min-h-[66px] text-[13.5px] leading-relaxed text-muted">{blog.excerpt}</p>
          <div className="mt-auto">
            <div className="mb-2.5 text-[11px] tracking-[0.1em] text-muted2">
              {formatDate(blog.publishedAt)} · {blog.readingTime} read
            </div>
            <span className="inline-flex items-center gap-1.5 text-[13px] font-medium tracking-[0.06em] text-ink">
              Read More <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
            </span>
          </div>
        </div>
      </AnimatedCard>
    </Link>
  );
}
