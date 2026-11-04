"use client";
import { useEffect, useState } from "react";
import { AdminShell } from "@/components/admin/admin-shell";
import { Search, Download, Trash2, Send, Loader2 } from "lucide-react";
import { useToast } from "@/lib/toast";

export default function AdminSubscribersPage() {
  const { push } = useToast();
  const [items, setItems] = useState<any[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const limit = 20;

  const loadData = () => {
    setLoading(true);
    const params = new URLSearchParams({
      search,
      page: String(page),
      limit: String(limit),
    });

    fetch(`/api/admin/subscribers?${params.toString()}`)
      .then((r) => r.json())
      .then((res) => {
        setItems(res.items || []);
        setTotal(res.total || 0);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  };

  useEffect(() => {
    const t = setTimeout(loadData, 250);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search, page]);

  const handleDelete = async (id: string) => {
    if (!confirm("Remove this subscriber?")) return;
    try {
      await fetch(`/api/admin/subscribers?id=${id}`, { method: "DELETE" });
      push("Subscriber removed");
      loadData();
    } catch {
      push("Failed to remove subscriber", "error");
    }
  };

  const totalPages = Math.ceil(total / limit) || 1;

  return (
    <AdminShell>
      {/* Header */}
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="mb-1 text-[11px] uppercase tracking-[0.24em] text-muted">Audience</div>
          <h1 className="font-condensed text-[clamp(26px,3.2vw,36px)] font-semibold">
            Newsletter Subscribers ({total})
          </h1>
        </div>
        <a
          href="/api/admin/export?type=subscribers"
          className="flex items-center gap-2 rounded-lg border border-ink/15 bg-surface px-4 py-2 text-[12.5px] font-medium text-ink transition-colors hover:border-ink"
        >
          <Download size={14} /> Export CSV
        </a>
      </div>

      {/* Search Bar */}
      <div className="mb-6 max-w-md">
        <div className="relative">
          <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted" />
          <input
            type="text"
            placeholder="Search subscribers by email..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            className="w-full rounded-lg border border-ink/15 bg-bg py-2 pl-9 pr-4 text-[13px] placeholder:text-muted"
          />
        </div>
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-xl border border-ink/10 bg-surface">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-[13px]">
            <thead className="border-b border-ink/10 bg-ink/5 text-[10.5px] uppercase tracking-[0.14em] text-muted">
              <tr>
                <th className="px-5 py-3.5">Email Address</th>
                <th className="px-5 py-3.5">Status</th>
                <th className="px-5 py-3.5">Subscribed Date</th>
                <th className="px-5 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-ink/5">
              {loading ? (
                <tr>
                  <td colSpan={4} className="py-12 text-center text-muted">
                    <Loader2 size={20} className="mx-auto mb-2 animate-spin text-muted" />
                    Loading subscribers...
                  </td>
                </tr>
              ) : items.length === 0 ? (
                <tr>
                  <td colSpan={4} className="py-12 text-center text-muted">
                    No newsletter subscribers found.
                  </td>
                </tr>
              ) : (
                items.map((row) => (
                  <tr key={row.id} className="hover:bg-ink/[0.02]">
                    <td className="px-5 py-3.5 font-mono text-[13px] text-ink">{row.email}</td>
                    <td className="px-5 py-3.5">
                      <span className="rounded-full bg-green-500/10 px-2.5 py-0.5 text-[11px] font-semibold text-green-700 dark:text-green-400 capitalize">
                        {row.status || "subscribed"}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-[11.5px] text-muted whitespace-nowrap">
                      {row.createdAt ? new Date(row.createdAt).toLocaleDateString() : "—"}
                    </td>
                    <td className="px-5 py-3.5 text-right">
                      <button
                        onClick={() => handleDelete(row.id)}
                        title="Delete"
                        className="rounded p-1 text-muted hover:bg-ink/5 hover:text-error"
                      >
                        <Trash2 size={14} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between border-t border-ink/10 px-5 py-3 text-[12.5px] text-muted">
            <div>
              Page {page} of {totalPages} ({total} items)
            </div>
            <div className="flex gap-2">
              <button
                disabled={page <= 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                className="rounded border border-ink/15 px-3 py-1 disabled:opacity-40 hover:bg-ink/5"
              >
                Previous
              </button>
              <button
                disabled={page >= totalPages}
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                className="rounded border border-ink/15 px-3 py-1 disabled:opacity-40 hover:bg-ink/5"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </AdminShell>
  );
}
