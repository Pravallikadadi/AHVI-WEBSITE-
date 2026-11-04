"use client";
import { useEffect, useState } from "react";
import { AdminShell } from "@/components/admin/admin-shell";
import { Search, Download, Trash2, CheckCircle2, Clock, Loader2 } from "lucide-react";
import { useToast } from "@/lib/toast";

export default function AdminWaitlistPage() {
  const { push } = useToast();
  const [items, setItems] = useState<any[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [interest, setInterest] = useState("All");
  const [status, setStatus] = useState("All");
  const [page, setPage] = useState(1);
  const limit = 15;

  const loadData = () => {
    setLoading(true);
    const params = new URLSearchParams({
      search,
      interest,
      status,
      page: String(page),
      limit: String(limit),
    });

    fetch(`/api/admin/waitlist?${params.toString()}`)
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
  }, [search, interest, status, page]);

  const handleStatusChange = async (id: string, newStatus: string) => {
    try {
      await fetch("/api/admin/waitlist", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status: newStatus }),
      });
      push(`Status updated to ${newStatus}`);
      loadData();
    } catch {
      push("Failed to update status", "error");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Remove this entry from the waitlist?")) return;
    try {
      await fetch(`/api/admin/waitlist?id=${id}`, { method: "DELETE" });
      push("Entry removed");
      loadData();
    } catch {
      push("Failed to remove entry", "error");
    }
  };

  const totalPages = Math.ceil(total / limit) || 1;

  return (
    <AdminShell>
      {/* Header */}
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="mb-1 text-[11px] uppercase tracking-[0.24em] text-muted">Submissions</div>
          <h1 className="font-condensed text-[clamp(26px,3.2vw,36px)] font-semibold">
            Waitlist Entries ({total})
          </h1>
        </div>
        <a
          href="/api/admin/export?type=waitlist"
          className="flex items-center gap-2 rounded-lg border border-ink/15 bg-surface px-4 py-2 text-[12.5px] font-medium text-ink transition-colors hover:border-ink"
        >
          <Download size={14} /> Export CSV
        </a>
      </div>

      {/* Filter and Search Bar */}
      <div className="mb-6 grid gap-3 sm:grid-cols-3">
        <div className="relative">
          <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted" />
          <input
            type="text"
            placeholder="Search name, email, phone..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            className="w-full rounded-lg border border-ink/15 bg-bg py-2 pl-9 pr-4 text-[13px] placeholder:text-muted"
          />
        </div>

        <select
          value={interest}
          onChange={(e) => {
            setInterest(e.target.value);
            setPage(1);
          }}
          className="rounded-lg border border-ink/15 bg-bg px-3 py-2 text-[13px] text-ink"
        >
          <option value="All">All Interests</option>
          <option value="Style">Style</option>
          <option value="Prep">Prep</option>
          <option value="Plan">Plan</option>
        </select>

        <select
          value={status}
          onChange={(e) => {
            setStatus(e.target.value);
            setPage(1);
          }}
          className="rounded-lg border border-ink/15 bg-bg px-3 py-2 text-[13px] text-ink"
        >
          <option value="All">All Statuses</option>
          <option value="pending">Pending</option>
          <option value="invited">Invited</option>
          <option value="approved">Approved</option>
        </select>
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-xl border border-ink/10 bg-surface">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-[13px]">
            <thead className="border-b border-ink/10 bg-ink/5 text-[10.5px] uppercase tracking-[0.14em] text-muted">
              <tr>
                <th className="px-5 py-3.5">Name</th>
                <th className="px-5 py-3.5">Email</th>
                <th className="px-5 py-3.5">Phone</th>
                <th className="px-5 py-3.5">Interests</th>
                <th className="px-5 py-3.5">Date</th>
                <th className="px-5 py-3.5">Status</th>
                <th className="px-5 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-ink/5">
              {loading ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-muted">
                    <Loader2 size={20} className="mx-auto mb-2 animate-spin text-muted" />
                    Loading entries...
                  </td>
                </tr>
              ) : items.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-muted">
                    No waitlist entries found.
                  </td>
                </tr>
              ) : (
                items.map((row) => (
                  <tr key={row.id} className="hover:bg-ink/[0.02]">
                    <td className="px-5 py-3 font-medium text-ink">{row.name}</td>
                    <td className="px-5 py-3 font-mono text-[12px] text-muted">{row.email}</td>
                    <td className="px-5 py-3 text-[12px] text-muted">{row.phone || "—"}</td>
                    <td className="px-5 py-3">
                      <div className="flex flex-wrap gap-1">
                        {row.interests && row.interests.length > 0 ? (
                          row.interests.map((i: string) => (
                            <span
                              key={i}
                              className="rounded border border-ink/15 bg-bg px-2 py-0.5 text-[10.5px] font-medium tracking-wide text-ink"
                            >
                              {i}
                            </span>
                          ))
                        ) : (
                          <span className="text-muted text-[11px]">—</span>
                        )}
                      </div>
                    </td>
                    <td className="px-5 py-3 text-[11.5px] text-muted whitespace-nowrap">
                      {row.createdAt ? new Date(row.createdAt).toLocaleDateString() : "—"}
                    </td>
                    <td className="px-5 py-3">
                      <select
                        value={row.status || "pending"}
                        onChange={(e) => handleStatusChange(row.id, e.target.value)}
                        className={`rounded px-2.5 py-1 text-[11.5px] font-medium border capitalize ${
                          row.status === "approved"
                            ? "border-green-600/30 bg-green-500/10 text-green-700 dark:text-green-400"
                            : row.status === "invited"
                            ? "border-accent/30 bg-accent/10 text-accent"
                            : "border-ink/15 bg-bg text-muted"
                        }`}
                      >
                        <option value="pending">Pending</option>
                        <option value="invited">Invited</option>
                        <option value="approved">Approved</option>
                      </select>
                    </td>
                    <td className="px-5 py-3 text-right">
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
