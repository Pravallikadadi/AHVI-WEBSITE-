"use client";
import { useEffect, useState } from "react";
import { AdminShell } from "@/components/admin/admin-shell";
import { Search, Download, Trash2, Mail, Eye, X, Loader2 } from "lucide-react";
import { useToast } from "@/lib/toast";

export default function AdminContactsPage() {
  const { push } = useToast();
  const [items, setItems] = useState<any[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("All");
  const [page, setPage] = useState(1);
  const [activeMessage, setActiveMessage] = useState<any | null>(null);
  const limit = 15;

  const loadData = () => {
    setLoading(true);
    const params = new URLSearchParams({
      search,
      status,
      page: String(page),
      limit: String(limit),
    });

    fetch(`/api/admin/contacts?${params.toString()}`)
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
  }, [search, status, page]);

  const handleStatusChange = async (id: string, newStatus: string) => {
    try {
      await fetch("/api/admin/contacts", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status: newStatus }),
      });
      push(`Contact status: ${newStatus}`);
      loadData();
    } catch {
      push("Failed to update status", "error");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this contact submission?")) return;
    try {
      await fetch(`/api/admin/contacts?id=${id}`, { method: "DELETE" });
      push("Submission deleted");
      if (activeMessage?.id === id) setActiveMessage(null);
      loadData();
    } catch {
      push("Failed to delete", "error");
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
            Contact Inquiries ({total})
          </h1>
        </div>
        <a
          href="/api/admin/export?type=contacts"
          className="flex items-center gap-2 rounded-lg border border-ink/15 bg-surface px-4 py-2 text-[12.5px] font-medium text-ink transition-colors hover:border-ink"
        >
          <Download size={14} /> Export CSV
        </a>
      </div>

      {/* Filter and Search Bar */}
      <div className="mb-6 grid gap-3 sm:grid-cols-2">
        <div className="relative">
          <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted" />
          <input
            type="text"
            placeholder="Search inquiries by name, email, text..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            className="w-full rounded-lg border border-ink/15 bg-bg py-2 pl-9 pr-4 text-[13px] placeholder:text-muted"
          />
        </div>

        <select
          value={status}
          onChange={(e) => {
            setStatus(e.target.value);
            setPage(1);
          }}
          className="rounded-lg border border-ink/15 bg-bg px-3 py-2 text-[13px] text-ink"
        >
          <option value="All">All Statuses</option>
          <option value="new">New</option>
          <option value="read">Read</option>
          <option value="replied">Replied</option>
          <option value="archived">Archived</option>
        </select>
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-xl border border-ink/10 bg-surface">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-[13px]">
            <thead className="border-b border-ink/10 bg-ink/5 text-[10.5px] uppercase tracking-[0.14em] text-muted">
              <tr>
                <th className="px-5 py-3.5">Sender</th>
                <th className="px-5 py-3.5">Subject</th>
                <th className="px-5 py-3.5">Message Preview</th>
                <th className="px-5 py-3.5">Date</th>
                <th className="px-5 py-3.5">Status</th>
                <th className="px-5 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-ink/5">
              {loading ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-muted">
                    <Loader2 size={20} className="mx-auto mb-2 animate-spin text-muted" />
                    Loading messages...
                  </td>
                </tr>
              ) : items.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-muted">
                    No contact submissions found.
                  </td>
                </tr>
              ) : (
                items.map((row) => (
                  <tr key={row.id} className="hover:bg-ink/[0.02]">
                    <td className="px-5 py-3">
                      <div className="font-medium text-ink">{row.name || "Anonymous"}</div>
                      <div className="font-mono text-[11px] text-muted">{row.email}</div>
                    </td>
                    <td className="px-5 py-3 font-medium text-ink max-w-[180px] truncate">
                      {row.subject || "No subject"}
                    </td>
                    <td className="px-5 py-3 text-[12.5px] text-muted max-w-[280px] truncate">
                      {row.message}
                    </td>
                    <td className="px-5 py-3 text-[11.5px] text-muted whitespace-nowrap">
                      {row.createdAt ? new Date(row.createdAt).toLocaleDateString() : "—"}
                    </td>
                    <td className="px-5 py-3">
                      <select
                        value={row.status || "new"}
                        onChange={(e) => handleStatusChange(row.id, e.target.value)}
                        className={`rounded px-2.5 py-1 text-[11.5px] font-medium border capitalize ${
                          row.status === "new"
                            ? "border-accent/30 bg-accent/10 text-accent font-semibold"
                            : row.status === "replied"
                            ? "border-green-600/30 bg-green-500/10 text-green-700 dark:text-green-400"
                            : "border-ink/15 bg-bg text-muted"
                        }`}
                      >
                        <option value="new">New</option>
                        <option value="read">Read</option>
                        <option value="replied">Replied</option>
                        <option value="archived">Archived</option>
                      </select>
                    </td>
                    <td className="px-5 py-3 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => {
                            setActiveMessage(row);
                            if (row.status === "new") handleStatusChange(row.id, "read");
                          }}
                          title="View Message"
                          className="rounded p-1 text-muted hover:bg-ink/5 hover:text-ink"
                        >
                          <Eye size={15} />
                        </button>
                        <button
                          onClick={() => handleDelete(row.id)}
                          title="Delete"
                          className="rounded p-1 text-muted hover:bg-ink/5 hover:text-error"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
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

      {/* Message Modal */}
      {activeMessage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div className="w-full max-w-[560px] rounded-2xl border border-ink/15 bg-bg p-6 sm:p-8 shadow-2xl">
            <div className="mb-4 flex items-start justify-between">
              <div>
                <span className="text-[11px] uppercase tracking-wider text-muted">Contact Submission</span>
                <h3 className="font-condensed text-[24px] font-semibold text-ink">
                  {activeMessage.subject || "No subject"}
                </h3>
              </div>
              <button
                onClick={() => setActiveMessage(null)}
                className="rounded-full p-1 text-muted hover:bg-ink/10 hover:text-ink"
              >
                <X size={18} />
              </button>
            </div>

            <div className="mb-6 space-y-2 border-b border-ink/10 pb-4 text-[13px]">
              <div>
                <span className="text-muted">From: </span>
                <span className="font-medium text-ink">{activeMessage.name}</span>{" "}
                <a
                  href={`mailto:${activeMessage.email}`}
                  className="font-mono text-accent hover:underline"
                >
                  ({activeMessage.email})
                </a>
              </div>
              <div>
                <span className="text-muted">Date: </span>
                <span>{new Date(activeMessage.createdAt).toLocaleString()}</span>
              </div>
            </div>

            <div className="mb-6 max-h-[300px] overflow-y-auto whitespace-pre-wrap rounded-lg border border-ink/10 bg-surface p-4 text-[14px] leading-relaxed text-ink">
              {activeMessage.message}
            </div>

            <div className="flex flex-wrap items-center justify-between gap-3">
              <a
                href={`mailto:${activeMessage.email}?subject=Re: ${encodeURIComponent(activeMessage.subject || "AHVI Inquiry")}`}
                className="flex items-center gap-1.5 rounded-lg bg-ink px-4 py-2 text-[12.5px] font-medium text-bg hover:bg-black"
              >
                <Mail size={14} /> Reply via Email
              </a>
              <button
                onClick={() => setActiveMessage(null)}
                className="rounded-lg border border-ink/20 px-4 py-2 text-[12.5px] text-muted hover:text-ink"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </AdminShell>
  );
}
