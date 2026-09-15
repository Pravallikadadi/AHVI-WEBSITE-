import { notFound } from "next/navigation";
import { AdminShell } from "@/components/admin/admin-shell";
import { BlogEditor } from "@/components/admin/blog-editor";
import { getById } from "@/lib/blog-store";

export default async function EditBlogPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const blog = getById(id);
  if (!blog) notFound();

  return (
    <AdminShell>
      <div className="mb-8">
        <div className="mb-2 text-[11px] uppercase tracking-[0.24em] text-muted">Admin</div>
        <h1 className="font-condensed text-[clamp(28px,3.6vw,40px)] font-semibold">Edit Blog</h1>
      </div>
      <BlogEditor blog={blog} />
    </AdminShell>
  );
}
