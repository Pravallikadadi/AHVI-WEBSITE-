import fs from "fs";
import path from "path";
import type { Blog, BlogInput } from "@/lib/blog-types";
import { slugify } from "@/lib/blog-types";

// File-based persistence: data/blogs.json is the "database". Survives page refresh,
// dev-server restarts and deploys (as long as the deploy target has a writable filesystem —
// swap readAll/writeAll for a real DB client later without touching any calling code).
const DATA_DIR = path.join(process.cwd(), "data");
const DATA_FILE = path.join(DATA_DIR, "blogs.json");

function ensureFile() {
  if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
  if (!fs.existsSync(DATA_FILE)) fs.writeFileSync(DATA_FILE, "[]", "utf8");
}

function readAll(): Blog[] {
  ensureFile();
  try {
    return JSON.parse(fs.readFileSync(DATA_FILE, "utf8"));
  } catch {
    return [];
  }
}

function writeAll(blogs: Blog[]) {
  ensureFile();
  fs.writeFileSync(DATA_FILE, JSON.stringify(blogs, null, 2), "utf8");
}

function uniqueSlug(base: string, blogs: Blog[], excludeId?: string) {
  let slug = base || "post";
  let n = 2;
  while (blogs.some((b) => b.slug === slug && b.id !== excludeId)) {
    slug = base + "-" + n;
    n++;
  }
  return slug;
}

export function listAll(): Blog[] {
  return readAll().sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1));
}

export function listPublished(opts?: { search?: string; category?: string }): Blog[] {
  let list = listAll().filter((b) => b.status === "published");
  if (opts?.category && opts.category !== "All") list = list.filter((b) => b.category === opts.category);
  const q = opts?.search?.trim().toLowerCase();
  if (q) {
    list = list.filter((b) =>
      (b.title + " " + b.excerpt + " " + b.category + " " + b.content + " " + (b.tags || []).join(" ")).toLowerCase().includes(q)
    );
  }
  return list;
}

export function getFeatured(): Blog | null {
  const published = listPublished();
  return published.find((b) => b.featured) || published[0] || null;
}

export function getBySlug(slug: string): Blog | null {
  return readAll().find((b) => b.slug === slug) || null;
}

export function getById(id: string): Blog | null {
  return readAll().find((b) => b.id === id) || null;
}

export function getRelated(blog: Blog, count = 3): Blog[] {
  const pool = listPublished().filter((b) => b.id !== blog.id);
  const scored = pool.map((b) => {
    const tagOverlap = (b.tags || []).filter((t) => (blog.tags || []).includes(t)).length;
    const sameCategory = b.category === blog.category ? 1 : 0;
    return { b, score: tagOverlap * 2 + sameCategory };
  });
  return scored
    .filter((s) => s.score > 0)
    .sort((a, c) => c.score - a.score)
    .slice(0, count)
    .map((s) => s.b);
}

export function create(input: BlogInput): Blog {
  const blogs = readAll();
  const now = new Date().toISOString();
  const slug = uniqueSlug(input.slug ? slugify(input.slug) : slugify(input.title), blogs);
  const blog: Blog = {
    id: "b_" + Date.now().toString(36) + Math.random().toString(36).slice(2, 7),
    title: input.title,
    slug,
    excerpt: input.excerpt,
    content: input.content,
    coverImage: input.coverImage,
    heroImage: input.heroImage || undefined,
    contentImages: input.contentImages || [],
    shapeCarousels: input.shapeCarousels || undefined,
    galleryCarousel: input.galleryCarousel || undefined,
    category: input.category,
    author: input.author,
    readingTime: input.readingTime,
    featured: !!input.featured,
    tags: input.tags || [],
    status: input.status,
    publishedAt: input.status === "published" ? now : null,
    createdAt: now,
    updatedAt: now,
  };
  if (blog.featured) for (const b of blogs) b.featured = false;
  blogs.push(blog);
  writeAll(blogs);
  return blog;
}

export function update(id: string, input: BlogInput): Blog | null {
  const blogs = readAll();
  const ix = blogs.findIndex((b) => b.id === id);
  if (ix === -1) return null;
  const existing = blogs[ix];
  const now = new Date().toISOString();
  const newSlug = input.slug ? slugify(input.slug) : slugify(input.title);
  const slug = newSlug === existing.slug ? existing.slug : uniqueSlug(newSlug, blogs, id);
  const wasPublished = existing.status === "published";
  const nowPublished = input.status === "published";
  const updated: Blog = {
    ...existing,
    title: input.title,
    slug,
    excerpt: input.excerpt,
    content: input.content,
    coverImage: input.coverImage,
    heroImage: input.heroImage || existing.heroImage,
    contentImages: input.contentImages || existing.contentImages || [],
    shapeCarousels: input.shapeCarousels || existing.shapeCarousels,
    galleryCarousel: input.galleryCarousel || existing.galleryCarousel,
    category: input.category,
    author: input.author,
    readingTime: input.readingTime,
    featured: !!input.featured,
    tags: input.tags || [],
    status: input.status,
    publishedAt: nowPublished ? existing.publishedAt || now : wasPublished ? existing.publishedAt : null,
    updatedAt: now,
  };
  if (updated.featured) for (const b of blogs) if (b.id !== id) b.featured = false;
  blogs[ix] = updated;
  writeAll(blogs);
  return updated;
}

export function setStatus(id: string, status: Blog["status"]): Blog | null {
  const blogs = readAll();
  const ix = blogs.findIndex((b) => b.id === id);
  if (ix === -1) return null;
  const now = new Date().toISOString();
  blogs[ix].status = status;
  if (status === "published" && !blogs[ix].publishedAt) blogs[ix].publishedAt = now;
  blogs[ix].updatedAt = now;
  writeAll(blogs);
  return blogs[ix];
}

export function remove(id: string): boolean {
  const blogs = readAll();
  const next = blogs.filter((b) => b.id !== id);
  if (next.length === blogs.length) return false;
  writeAll(next);
  return true;
}
