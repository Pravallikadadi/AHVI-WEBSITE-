import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Photo } from "@/components/media/photo";
import type { Blog } from "@/lib/blog-types";

function formatDate(d: string | null) {
  if (!d) return "";
  return new Date(d).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

export function FeaturedBlog({ blog }: { blog: Blog }) {
  return (
    <Link
      href={"/blog/" + blog.slug}
      className="group grid overflow-hidden border border-ink/10 bg-surface text-ink"
      style={{ gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 420px), 1fr))" }}
    >
      <div className="overflow-hidden">
        <Photo src={blog.coverImage} alt={blog.title} ratio="4/3" className="transition-transform duration-700 ease-out group-hover:scale-[1.04]" />
      </div>
      <div className="flex flex-col justify-center p-8 sm:p-11">
        <span className="mb-5 w-fit text-[11px] tracking-[0.2em] text-accent">Featured · {blog.category}</span>
        <div className="mb-4 font-condensed text-[clamp(28px,3.6vw,42px)] font-semibold leading-[1.08]">{blog.title}</div>
        <p className="mb-5 max-w-[46ch] text-[15px] leading-relaxed text-muted">{blog.excerpt}</p>
        <div className="mb-6 text-[11.5px] tracking-[0.12em] text-muted2">
          {formatDate(blog.publishedAt)} · {blog.readingTime} read
        </div>
        <span className="inline-flex items-center gap-2.5 text-[13px] tracking-[0.1em] text-ink">
          Read Story <ArrowRight size={14} className="transition-transform duration-300 group-hover:translate-x-1" />
        </span>
      </div>
    </Link>
  );
}
