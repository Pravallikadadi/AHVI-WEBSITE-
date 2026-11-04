import fs from "fs";
import path from "path";
import type { Blog, BlogInput } from "@/lib/blog-types";
import { slugify } from "@/lib/blog-types";
import { isAppwriteConfigured, createAdminClient, APPWRITE_CONFIG, ID, Query } from "@/lib/appwrite";
import { Permission, Role } from "node-appwrite";

const DATA_DIR = path.join(process.cwd(), "data");
const DATA_FILE = path.join(DATA_DIR, "blogs.json");

function ensureLocalFile() {
  if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
  if (!fs.existsSync(DATA_FILE)) fs.writeFileSync(DATA_FILE, "[]", "utf8");
}

function readAllLocal(): Blog[] {
  ensureLocalFile();
  try {
    return JSON.parse(fs.readFileSync(DATA_FILE, "utf8"));
  } catch {
    return [];
  }
}

function writeAllLocal(blogs: Blog[]) {
  ensureLocalFile();
  fs.writeFileSync(DATA_FILE, JSON.stringify(blogs, null, 2), "utf8");
}

function toBlog(doc: any): Blog {
  let shapeCarousels = doc.shapeCarousels;
  if (typeof shapeCarousels === "string" && shapeCarousels.trim()) {
    try {
      shapeCarousels = JSON.parse(shapeCarousels);
    } catch {
      shapeCarousels = undefined;
    }
  }

  let galleryCarousel = doc.galleryCarousel;
  if (typeof galleryCarousel === "string" && galleryCarousel.trim()) {
    try {
      galleryCarousel = JSON.parse(galleryCarousel);
    } catch {
      galleryCarousel = undefined;
    }
  }

  return {
    id: doc.$id || doc.id,
    title: doc.title,
    slug: doc.slug,
    excerpt: doc.excerpt || "",
    content: doc.content || "",
    coverImage: doc.coverImage,
    heroImage: doc.heroImage || undefined,
    contentImages: Array.isArray(doc.contentImages) ? doc.contentImages : [],
    shapeCarousels,
    galleryCarousel,
    category: doc.category,
    author: doc.author,
    readingTime: doc.readingTime,
    featured: Boolean(doc.featured),
    tags: Array.isArray(doc.tags) ? doc.tags : [],
    status: doc.status || "draft",
    publishedAt: doc.publishedAt || null,
    createdAt: doc.createdAt || doc.$createdAt || new Date().toISOString(),
    updatedAt: doc.updatedAt || doc.$updatedAt || new Date().toISOString(),
  };
}

function uniqueSlug(base: string, existingSlugs: string[], excludeId?: string) {
  let slug = base || "post";
  let n = 2;
  while (existingSlugs.includes(slug)) {
    slug = base + "-" + n;
    n++;
  }
  return slug;
}

export async function listAll(): Promise<Blog[]> {
  if (isAppwriteConfigured()) {
    try {
      const { databases } = createAdminClient();
      const res = await databases.listDocuments(
        APPWRITE_CONFIG.databaseId,
        APPWRITE_CONFIG.collections.blogs,
        [Query.orderDesc("createdAt"), Query.limit(100)]
      );
      if (res.documents.length > 0) {
        return res.documents.map(toBlog);
      }
    } catch (err: any) {
      console.warn("Appwrite listAll error, falling back to local:", err?.message);
    }
  }

  return readAllLocal().sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1));
}

export async function listPublished(opts?: { search?: string; category?: string }): Promise<Blog[]> {
  if (isAppwriteConfigured()) {
    try {
      const { databases } = createAdminClient();
      const queries = [
        Query.equal("status", "published"),
        Query.orderDesc("publishedAt"),
        Query.limit(100),
      ];

      if (opts?.category && opts.category !== "All") {
        queries.push(Query.equal("category", opts.category));
      }

      if (opts?.search) {
        queries.push(Query.search("title", opts.search.trim()));
      }

      const res = await databases.listDocuments(
        APPWRITE_CONFIG.databaseId,
        APPWRITE_CONFIG.collections.blogs,
        queries
      );

      if (res.documents.length > 0) {
        let list = res.documents.map(toBlog);
        const q = opts?.search?.trim().toLowerCase();
        if (q) {
          list = list.filter((b) =>
            (b.title + " " + b.excerpt + " " + b.category + " " + b.content + " " + (b.tags || []).join(" "))
              .toLowerCase()
              .includes(q)
          );
        }
        return list;
      }
    } catch (err: any) {
      console.warn("Appwrite listPublished error, falling back to local:", err?.message);
    }
  }

  // Local fallback
  let list = readAllLocal().filter((b) => b.status === "published");
  if (opts?.category && opts.category !== "All") list = list.filter((b) => b.category === opts.category);
  const q = opts?.search?.trim().toLowerCase();
  if (q) {
    list = list.filter((b) =>
      (b.title + " " + b.excerpt + " " + b.category + " " + b.content + " " + (b.tags || []).join(" "))
        .toLowerCase()
        .includes(q)
    );
  }
  return list.sort((a, b) => ((b.publishedAt || b.createdAt) > (a.publishedAt || a.createdAt) ? 1 : -1));
}

export async function getFeatured(): Promise<Blog | null> {
  const published = await listPublished();
  return published.find((b) => b.featured) || published[0] || null;
}

export async function getBySlug(slug: string): Promise<Blog | null> {
  if (isAppwriteConfigured()) {
    try {
      const { databases } = createAdminClient();
      const res = await databases.listDocuments(
        APPWRITE_CONFIG.databaseId,
        APPWRITE_CONFIG.collections.blogs,
        [Query.equal("slug", slug), Query.limit(1)]
      );
      if (res.documents.length > 0 && res.documents[0]) {
        return toBlog(res.documents[0]);
      }
    } catch (err: any) {
      console.warn("Appwrite getBySlug error, falling back to local:", err?.message);
    }
  }

  return readAllLocal().find((b) => b.slug === slug) || null;
}

export async function getById(id: string): Promise<Blog | null> {
  if (isAppwriteConfigured()) {
    try {
      const { databases } = createAdminClient();
      const doc = await databases.getDocument(
        APPWRITE_CONFIG.databaseId,
        APPWRITE_CONFIG.collections.blogs,
        id
      );
      return toBlog(doc);
    } catch (err: any) {
      console.warn("Appwrite getById error, falling back to local:", err?.message);
    }
  }

  return readAllLocal().find((b) => b.id === id) || null;
}

export async function getRelated(blog: Blog, count = 3): Promise<Blog[]> {
  const pool = (await listPublished()).filter((b) => b.id !== blog.id);
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

export async function create(input: BlogInput): Promise<Blog> {
  const now = new Date().toISOString();
  const baseSlug = input.slug ? slugify(input.slug) : slugify(input.title);

  const localBlogs = readAllLocal();
  const slug = uniqueSlug(baseSlug, localBlogs.map((b) => b.slug));

  const blogPayload: any = {
    title: input.title,
    slug,
    excerpt: input.excerpt || "",
    content: input.content,
    coverImage: input.coverImage,
    heroImage: input.heroImage || "",
    contentImages: input.contentImages || [],
    shapeCarousels: input.shapeCarousels ? JSON.stringify(input.shapeCarousels) : "",
    galleryCarousel: input.galleryCarousel ? JSON.stringify(input.galleryCarousel) : "",
    category: input.category,
    author: input.author || "AHVI Editorial",
    readingTime: input.readingTime || "4 min",
    featured: Boolean(input.featured),
    tags: input.tags || [],
    status: input.status || "draft",
    publishedAt: input.status === "published" ? now : "",
    createdAt: now,
    updatedAt: now,
  };

  if (isAppwriteConfigured()) {
    try {
      const { databases } = createAdminClient();
      const docId = ID.unique();
      const permissions =
        (input.status || "draft") === "published" ? [Permission.read(Role.any())] : [];
      const doc = await databases.createDocument(
        APPWRITE_CONFIG.databaseId,
        APPWRITE_CONFIG.collections.blogs,
        docId,
        blogPayload,
        permissions
      );
      const created = toBlog(doc);
      // Keep local in sync
      localBlogs.unshift(created);
      writeAllLocal(localBlogs);
      return created;
    } catch (err: any) {
      console.error("Appwrite create blog error:", err?.message);
    }
  }

  // Local fallback
  const fallbackBlog: Blog = {
    id: "b_" + Date.now().toString(36) + Math.random().toString(36).slice(2, 7),
    ...input,
    slug,
    publishedAt: input.status === "published" ? now : null,
    createdAt: now,
    updatedAt: now,
  };
  if (fallbackBlog.featured) {
    for (const b of localBlogs) b.featured = false;
  }
  localBlogs.unshift(fallbackBlog);
  writeAllLocal(localBlogs);
  return fallbackBlog;
}

export async function update(id: string, input: BlogInput): Promise<Blog | null> {
  const now = new Date().toISOString();
  const baseSlug = input.slug ? slugify(input.slug) : slugify(input.title);

  if (isAppwriteConfigured()) {
    try {
      const { databases } = createAdminClient();
      const existingDoc = await databases.getDocument(
        APPWRITE_CONFIG.databaseId,
        APPWRITE_CONFIG.collections.blogs,
        id
      );

      const wasPublished = existingDoc.status === "published";
      const nowPublished = input.status === "published";

      const updateData: any = {
        title: input.title,
        slug: baseSlug || existingDoc.slug,
        excerpt: input.excerpt || "",
        content: input.content,
        coverImage: input.coverImage,
        heroImage: input.heroImage || existingDoc.heroImage || "",
        contentImages: input.contentImages || existingDoc.contentImages || [],
        shapeCarousels: input.shapeCarousels ? JSON.stringify(input.shapeCarousels) : existingDoc.shapeCarousels || "",
        galleryCarousel: input.galleryCarousel ? JSON.stringify(input.galleryCarousel) : existingDoc.galleryCarousel || "",
        category: input.category,
        author: input.author,
        readingTime: input.readingTime,
        featured: Boolean(input.featured),
        tags: input.tags || [],
        status: input.status,
        publishedAt: nowPublished ? existingDoc.publishedAt || now : wasPublished ? existingDoc.publishedAt : "",
        updatedAt: now,
      };

      const permissions =
        (input.status || existingDoc.status) === "published"
          ? [Permission.read(Role.any())]
          : [];
      const updated = await databases.updateDocument(
        APPWRITE_CONFIG.databaseId,
        APPWRITE_CONFIG.collections.blogs,
        id,
        updateData,
        permissions
      );

      const result = toBlog(updated);
      // Sync local
      const local = readAllLocal();
      const idx = local.findIndex((b) => b.id === id);
      if (idx !== -1) {
        local[idx] = result;
        writeAllLocal(local);
      }
      return result;
    } catch (err: any) {
      console.error("Appwrite update blog error:", err?.message);
    }
  }

  // Local fallback
  const local = readAllLocal();
  const ix = local.findIndex((b) => b.id === id);
  if (ix === -1) return null;
  const existing = local[ix];
  const slug = baseSlug === existing.slug ? existing.slug : uniqueSlug(baseSlug, local.map((b) => b.slug), id);
  const wasPublished = existing.status === "published";
  const nowPublished = input.status === "published";

  const updatedBlog: Blog = {
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
    featured: Boolean(input.featured),
    tags: input.tags || [],
    status: input.status,
    publishedAt: nowPublished ? existing.publishedAt || now : wasPublished ? existing.publishedAt : null,
    updatedAt: now,
  };
  if (updatedBlog.featured) {
    for (const b of local) if (b.id !== id) b.featured = false;
  }
  local[ix] = updatedBlog;
  writeAllLocal(local);
  return updatedBlog;
}

export async function setStatus(id: string, status: Blog["status"]): Promise<Blog | null> {
  const now = new Date().toISOString();

  if (isAppwriteConfigured()) {
    try {
      const { databases } = createAdminClient();
      const existing = await databases.getDocument(
        APPWRITE_CONFIG.databaseId,
        APPWRITE_CONFIG.collections.blogs,
        id
      );

      const publishedAt = status === "published" && !existing.publishedAt ? now : existing.publishedAt || "";
      const updated = await databases.updateDocument(
        APPWRITE_CONFIG.databaseId,
        APPWRITE_CONFIG.collections.blogs,
        id,
        { status, publishedAt, updatedAt: now }
      );
      return toBlog(updated);
    } catch (err: any) {
      console.error("Appwrite setStatus error:", err?.message);
    }
  }

  // Local fallback
  const local = readAllLocal();
  const ix = local.findIndex((b) => b.id === id);
  if (ix === -1) return null;
  local[ix].status = status;
  if (status === "published" && !local[ix].publishedAt) local[ix].publishedAt = now;
  local[ix].updatedAt = now;
  writeAllLocal(local);
  return local[ix];
}

export async function remove(id: string): Promise<boolean> {
  if (isAppwriteConfigured()) {
    try {
      const { databases } = createAdminClient();
      await databases.deleteDocument(
        APPWRITE_CONFIG.databaseId,
        APPWRITE_CONFIG.collections.blogs,
        id
      );
    } catch (err: any) {
      console.error("Appwrite delete error:", err?.message);
    }
  }

  const local = readAllLocal();
  const next = local.filter((b) => b.id !== id);
  writeAllLocal(next);
  return true;
}
