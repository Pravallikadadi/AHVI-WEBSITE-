export const BLOG_CATEGORIES = ["Fashion", "Lifestyle", "Wellness", "Tips"] as const;

export type BlogCategory = (typeof BLOG_CATEGORIES)[number];
export type BlogStatus = "draft" | "published";

export type Blog = {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  coverImage: string;
  /** Wide hero image for the story detail page. Falls back to coverImage when unset. */
  heroImage?: string;
  /** Editorial images interleaved between article sections on the story detail page. */
  contentImages?: string[];
  /** Optional men's/women's shape carousels — used only by posts that need a 5-card swipeable
      comparison grid (e.g. the body shape guide) instead of the standard content images. */
  shapeCarousels?: {
    men: { label: string; image: string }[];
    women: { label: string; image: string }[];
  };
  /** Generic single-set image carousel (e.g. the 6 AHVI style personas) — rendered right after
      the article section whose heading matches `afterHeading`. */
  galleryCarousel?: {
    title: string;
    afterHeading: string;
    items: { label: string; image: string }[];
  };
  category: string;
  author: string;
  readingTime: string;
  featured: boolean;
  tags: string[];
  status: BlogStatus;
  publishedAt: string | null;
  createdAt: string;
  updatedAt: string;
};

export type BlogInput = {
  title: string;
  excerpt: string;
  content: string;
  coverImage: string;
  heroImage?: string;
  contentImages?: string[];
  shapeCarousels?: {
    men: { label: string; image: string }[];
    women: { label: string; image: string }[];
  };
  galleryCarousel?: {
    title: string;
    afterHeading: string;
    items: { label: string; image: string }[];
  };
  category: string;
  author: string;
  readingTime: string;
  featured: boolean;
  tags: string[];
  status: BlogStatus;
  slug?: string;
};

export function slugify(title: string) {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}
