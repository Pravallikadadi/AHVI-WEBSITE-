"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { ImageUploader } from "@/components/admin/image-uploader";
import { RichTextEditor } from "@/components/admin/rich-text-editor";
import { BLOG_CATEGORIES } from "@/lib/blog-types";
import type { Blog, BlogInput } from "@/lib/blog-types";
import { slugify } from "@/lib/blog-types";
import { useToast } from "@/lib/toast";

export function BlogEditor({ blog }: { blog?: Blog }) {
  const router = useRouter();
  const { push } = useToast();
  const [saving, setSaving] = useState<"draft" | "published" | null>(null);
  const [form, setForm] = useState<BlogInput>({
    title: blog?.title || "",
    excerpt: blog?.excerpt || "",
    content: blog?.content || "",
    coverImage: blog?.coverImage || "",
    category: blog?.category || BLOG_CATEGORIES[0],
    author: blog?.author || "AHVI Editorial",
    readingTime: blog?.readingTime || "4 min",
    featured: blog?.featured || false,
    tags: blog?.tags || [],
    status: blog?.status || "draft",
    slug: blog?.slug,
  });
  const [tagsText, setTagsText] = useState((blog?.tags || []).join(", "));
  const [slugTouched, setSlugTouched] = useState(!!blog);

  const set = <K extends keyof BlogInput>(key: K, value: BlogInput[K]) => setForm((f) => ({ ...f, [key]: value }));

  const submit = async (status: "draft" | "published") => {
    if (!form.title.trim()) return push("A title is required", "error");
    if (!form.content || form.content === "<p></p>") return push("Blog content is required", "error");
    if (status === "published") {
      if (!form.category) return push("A category is required to publish", "error");
      if (!form.coverImage) return push("A cover image is required to publish", "error");
    }
    setSaving(status);
    try {
      const tags = tagsText.split(",").map((t) => t.trim()).filter(Boolean);
      const payload = { ...form, tags, status };
      const url = blog ? "/api/admin/blogs/" + blog.id : "/api/admin/blogs";
      const res = await fetch(url, { method: blog ? "PUT" : "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Save failed");
      push(status === "published" ? "Blog published" : "Draft saved");
      router.push("/admin/blogs");
    } catch (e) {
      push(e instanceof Error ? e.message : "Save failed", "error");
    } finally {
      setSaving(null);
    }
  };

  return (
    <div className="grid gap-8" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 320px), 1fr))" }}>
      <div className="grid content-start gap-6">
        <div>
          <label className="mb-1.5 block text-[11px] tracking-[0.14em] text-muted">Blog cover image</label>
          <ImageUploader value={form.coverImage} onChange={(url) => set("coverImage", url)} />
        </div>
        <div>
          <label className="mb-1.5 block text-[11px] tracking-[0.14em] text-muted">Blog title</label>
          <input
            value={form.title}
            onChange={(e) => {
              set("title", e.target.value);
              if (!slugTouched) set("slug", slugify(e.target.value));
            }}
            className="w-full rounded-lg border border-ink/15 bg-bg px-4 py-3 text-[15px]"
            placeholder="How to Build a Capsule Wardrobe"
          />
        </div>
        <div>
          <label className="mb-1.5 block text-[11px] tracking-[0.14em] text-muted">URL slug</label>
          <input
            value={form.slug || ""}
            onChange={(e) => {
              setSlugTouched(true);
              set("slug", e.target.value);
            }}
            className="w-full rounded-lg border border-ink/15 bg-bg px-4 py-3 text-[15px]"
            placeholder="auto-generated-from-title"
          />
        </div>
        <div>
          <label className="mb-1.5 block text-[11px] tracking-[0.14em] text-muted">Short description / excerpt</label>
          <textarea
            value={form.excerpt}
            onChange={(e) => set("excerpt", e.target.value)}
            rows={3}
            className="w-full rounded-lg border border-ink/15 bg-bg px-4 py-3 text-[15px]"
          />
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1.5 block text-[11px] tracking-[0.14em] text-muted">Category</label>
            <select
              value={form.category}
              onChange={(e) => set("category", e.target.value)}
              className="w-full rounded-lg border border-ink/15 bg-bg px-4 py-3 text-[15px]"
            >
              {BLOG_CATEGORIES.map((c) => (
                <option key={c}>{c}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="mb-1.5 block text-[11px] tracking-[0.14em] text-muted">Reading time</label>
            <input
              value={form.readingTime}
              onChange={(e) => set("readingTime", e.target.value)}
              className="w-full rounded-lg border border-ink/15 bg-bg px-4 py-3 text-[15px]"
            />
          </div>
        </div>
        <div>
          <label className="mb-1.5 block text-[11px] tracking-[0.14em] text-muted">Author</label>
          <input
            value={form.author}
            onChange={(e) => set("author", e.target.value)}
            className="w-full rounded-lg border border-ink/15 bg-bg px-4 py-3 text-[15px]"
          />
        </div>
        <div>
          <label className="mb-1.5 block text-[11px] tracking-[0.14em] text-muted">Tags (comma separated)</label>
          <input
            value={tagsText}
            onChange={(e) => setTagsText(e.target.value)}
            className="w-full rounded-lg border border-ink/15 bg-bg px-4 py-3 text-[15px]"
            placeholder="Wardrobe, Style, Fashion"
          />
        </div>
        <label className="flex items-center gap-2.5 text-[14px]">
          <input type="checkbox" checked={form.featured} onChange={(e) => set("featured", e.target.checked)} className="h-4 w-4" />
          Featured blog (replaces the current featured article)
        </label>
      </div>

      <div className="grid content-start gap-3">
        <label className="text-[11px] tracking-[0.14em] text-muted">Blog content</label>
        <RichTextEditor value={form.content} onChange={(html) => set("content", html)} />
        <div className="mt-4 flex flex-wrap gap-3">
          <button
            onClick={() => submit("draft")}
            disabled={!!saving}
            className="flex items-center gap-2 rounded-full border border-ink/20 px-6 py-3 text-[13px] tracking-[0.06em] disabled:opacity-60"
          >
            {saving === "draft" && <Loader2 size={14} className="animate-spin" />} Save Draft
          </button>
          <button
            onClick={() => submit("published")}
            disabled={!!saving}
            className="flex items-center gap-2 rounded-full bg-ink px-6 py-3 text-[13px] tracking-[0.06em] text-bg hover:bg-black disabled:opacity-60"
          >
            {saving === "published" && <Loader2 size={14} className="animate-spin" />} Publish Blog
          </button>
          <button
            type="button"
            onClick={() => router.push("/admin/blogs")}
            className="rounded-full px-6 py-3 text-[13px] tracking-[0.06em] text-muted hover:text-ink"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
