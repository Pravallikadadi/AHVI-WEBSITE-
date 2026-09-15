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
