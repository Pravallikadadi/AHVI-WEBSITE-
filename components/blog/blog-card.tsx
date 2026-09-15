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

export function BlogCard({ blog, large = false }: { blog: Blog; large?: boolean }) {
  return (
    <Link href={"/blog/" + blog.slug} className="group flex flex-col">
      <AnimatedCard>
        <ImageReveal className="border border-ink/10">
          <Photo src={blog.coverImage} alt={blog.title} ratio={large ? "16/10" : "4/3"} className="transition-transform duration-500 group-hover:scale-[1.03]" />
        </ImageReveal>
        <div className="pt-4">
          <div className="mb-2 text-[11px] tracking-[0.14em] text-accent">{blog.category}</div>
          <div className={"mb-2 font-condensed font-semibold leading-tight text-ink " + (large ? "text-[26px]" : "text-[21px]")}>{blog.title}</div>
          <p className="mb-3 text-[14px] leading-relaxed text-muted">{blog.excerpt}</p>
          <div className="mb-2.5 text-[11px] tracking-[0.1em] text-muted2">
            {formatDate(blog.publishedAt)} · {blog.readingTime} read
          </div>
          <span className="inline-flex items-center gap-1.5 text-[13px] tracking-[0.06em] text-ink">
            Read Story <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
          </span>
        </div>
      </AnimatedCard>
    </Link>
  );
}

