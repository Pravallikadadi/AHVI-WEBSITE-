"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Plus, Pencil, Trash2, Eye, EyeOff } from "lucide-react";
import { BlogStatusBadge } from "@/components/blog/blog-status-badge";
import { DeleteBlogModal } from "@/components/admin/delete-blog-modal";
import { BLOG_CATEGORIES } from "@/lib/blog-types";
import type { Blog } from "@/lib/blog-types";
import { useToast } from "@/lib/toast";

export function AdminBlogList() {
  const { push } = useToast();
  const [blogs, setBlogs] = useState<Blog[] | null>(null);
  const [q, setQ] = useState("");
  const [category, setCategory] = useState("All");
  const [status, setStatus] = useState("All");
  const [pendingDelete, setPendingDelete] = useState<Blog | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [busyId, setBusyId] = useState<string | null>(null);

  const load = () => {
    const params = new URLSearchParams();
    if (q) params.set("search", q);
    if (category !== "All") params.set("category", category);
    if (status !== "All") params.set("status", status);
    fetch("/api/admin/blogs?" + params.toString())
      .then((r) => r.json())
      .then((data) => setBlogs(data.blogs || []));
  };

  useEffect(() => {
    const t = setTimeout(load, 200);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [q, category, status]);

  const toggleStatus = async (b: Blog) => {
    setBusyId(b.id);
    const nextStatus = b.status === "published" ? "draft" : "published";
    await fetch("/api/admin/blogs/" + b.id, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ onlyStatus: true, status: nextStatus }),
    });
    push(nextStatus === "published" ? "Blog published" : "Blog unpublished");
    setBusyId(null);
    load();
  };

  const confirmDelete = async () => {
    if (!pendingDelete) return;
    setDeleting(true);
    await fetch("/api/admin/blogs/" + pendingDelete.id, { method: "DELETE" });
    push("Blog deleted");
    setDeleting(false);
    setPendingDelete(null);
    load();
  };

  return (
    <div>
      <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <div className="mb-2 text-[11px] tracking-[0.24em] text-muted">Admin</div>
          <h1 className="font-condensed text-[clamp(28px,3.6vw,40px)] font-semibold">Blog Management</h1>
        </div>
        <Link href="/admin/blogs/new" className="flex items-center gap-2 rounded-full bg-ink px-5 py-3 text-[13px] tracking-[0.06em] text-bg hover:bg-black">
          <Plus size={15} /> Add New Blog
        </Link>
      </div>

      <div className="mb-7 flex flex-wrap gap-3">
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search blogs..."
          className="min-w-[220px] flex-1 rounded-full border border-ink/15 bg-bg px-4 py-2.5 text-[13.5px]"
        />
        <select value={category} onChange={(e) => setCategory(e.target.value)} className="rounded-full border border-ink/15 bg-bg px-4 py-2.5 text-[13.5px]">
          <option>All</option>
          {BLOG_CATEGORIES.map((c) => (
            <option key={c}>{c}</option>
          ))}
        </select>
        <select value={status} onChange={(e) => setStatus(e.target.value)} className="rounded-full border border-ink/15 bg-bg px-4 py-2.5 text-[13.5px]">
          <option>All</option>
          <option value="published">Published</option>
          <option value="draft">Draft</option>
        </select>
      </div>

      {blogs === null ? (
        <div className="grid gap-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-20 animate-pulse rounded-xl bg-surface" />
          ))}
        </div>
      ) : blogs.length === 0 ? (
        <div className="rounded-2xl border border-ink/10 py-16 text-center">
          <p className="mb-4 text-[15px] text-muted">
            No blogs found.
            <br />
            Create your first AHVI story.
          </p>
          <Link href="/admin/blogs/new" className="inline-flex items-center gap-2 rounded-full bg-ink px-5 py-3 text-[13px] tracking-[0.06em] text-bg">
            <Plus size={14} /> Add New Blog
          </Link>
        </div>
      ) : (
        <div className="grid gap-3">
          {blogs.map((b) => (
            <div key={b.id} className="flex flex-wrap items-center gap-4 rounded-xl border border-ink/10 p-3.5">
              <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-lg bg-surface">
                {b.coverImage && <Image src={b.coverImage} alt={b.title} fill style={{ objectFit: "cover" }} />}
              </div>
              <div className="min-w-0 flex-1">
                <div className="truncate font-condensed text-[16px] font-semibold">{b.title}</div>
                <div className="mt-0.5 text-[12px] text-muted">
                  {b.category} · {b.author} · created {new Date(b.createdAt).toLocaleDateString()}
                  {b.publishedAt ? " · published " + new Date(b.publishedAt).toLocaleDateString() : ""}
                </div>
              </div>
              <BlogStatusBadge status={b.status} />
              <div className="flex items-center gap-2">
                <button
                  onClick={() => toggleStatus(b)}
                  disabled={busyId === b.id}
                  title={b.status === "published" ? "Unpublish" : "Publish"}
                  className="grid h-9 w-9 place-items-center rounded-full border border-ink/15 text-ink hover:bg-surface disabled:opacity-50"
                >
                  {b.status === "published" ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
                <Link href={"/admin/blogs/" + b.id + "/edit"} className="grid h-9 w-9 place-items-center rounded-full border border-ink/15 text-ink hover:bg-surface">
                  <Pencil size={15} />
                </Link>
                <button onClick={() => setPendingDelete(b)} className="grid h-9 w-9 place-items-center rounded-full border border-ink/15 text-error hover:bg-surface">
                  <Trash2 size={15} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {pendingDelete && (
        <DeleteBlogModal title={pendingDelete.title} deleting={deleting} onCancel={() => setPendingDelete(null)} onConfirm={confirmDelete} />
      )}
    </div>
  );
}
