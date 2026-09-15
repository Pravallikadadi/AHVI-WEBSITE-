import { AdminShell } from "@/components/admin/admin-shell";
import { AdminBlogList } from "@/components/admin/admin-blog-list";

export default function AdminBlogsPage() {
  return (
    <AdminShell>
      <AdminBlogList />
    </AdminShell>
  );
}
