import { AdminShell } from "@/components/admin/admin-shell";
import { BlogEditor } from "@/components/admin/blog-editor";

export default function NewBlogPage() {
  return (
    <AdminShell>
      <div className="mb-8">
        <div className="mb-2 text-[11px] tracking-[0.24em] text-muted">Admin</div>
        <h1 className="font-condensed text-[clamp(28px,3.6vw,40px)] font-semibold">Add New Blog</h1>
      </div>
      <BlogEditor />
    </AdminShell>
  );
}
