"use client";
import { useEffect, useState } from "react";
import { AdminShell } from "@/components/admin/admin-shell";
import {
  Users,
  Mail,
  HelpCircle,
  Eye,
  Activity,
  Download,
  Send,
  Smartphone,
  Monitor,
  Tablet,
  Globe,
  Loader2,
} from "lucide-react";
import Link from "next/link";

export default function AdminOverviewPage() {
  const [range, setRange] = useState<"today" | "week" | "month" | "all">("week");
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const fetchStats = (timeRange: string) => {
    setLoading(true);
    fetch(`/api/admin/overview?range=${timeRange}`)
      .then((r) => r.json())
      .then((res) => {
        setData(res);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  };

  useEffect(() => {
    fetchStats(range);
  }, [range]);

  return (
    <AdminShell>
      {/* Header & Controls */}
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="mb-1 text-[11px] tracking-[0.24em] text-muted uppercase">Admin Console</div>
          <h1 className="font-condensed text-[clamp(26px,3.2vw,36px)] font-semibold">
            Overview & Analytics
          </h1>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {/* Time range buttons */}
          <div className="flex rounded-lg border border-ink/15 bg-surface p-1">
            {(
              [
                ["today", "Today"],
                ["week", "7 Days"],
                ["month", "30 Days"],
                ["all", "All Time"],
              ] as const
            ).map(([key, label]) => (
              <button
                key={key}
                onClick={() => setRange(key)}
                className={`rounded px-3 py-1 text-[12px] font-medium transition-colors ${
                  range === key ? "bg-ink text-bg" : "text-muted hover:text-ink"
                }`}
              >
                {label}
              </button>
            ))}
          </div>

          <a
            href={`/api/admin/export?type=analytics`}
            className="flex items-center gap-1.5 rounded-lg border border-ink/15 px-3 py-1.5 text-[12px] font-medium text-ink transition-colors hover:border-ink"
          >
            <Download size={13} /> Export Raw Log
          </a>
        </div>
      </div>

      {loading && !data ? (
        <div className="flex h-64 items-center justify-center">
          <Loader2 size={24} className="animate-spin text-muted" />
        </div>
      ) : (
        <>
          {/* KPI Metrics Grid */}
          <div className="mb-8 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
            <div className="rounded-xl border border-ink/10 bg-surface p-4">
              <div className="flex items-center justify-between text-muted">
                <span className="text-[11px] uppercase tracking-[0.14em]">Waitlist</span>
                <Users size={16} />
              </div>
              <div className="mt-2 font-condensed text-[28px] font-bold text-ink">
                {data?.waitlistTotal || 0}
              </div>
              <Link href="/admin/waitlist" className="mt-1 block text-[11px] text-accent hover:underline">
                View list →
              </Link>
            </div>

            <div className="rounded-xl border border-ink/10 bg-surface p-4">
              <div className="flex items-center justify-between text-muted">
                <span className="text-[11px] uppercase tracking-[0.14em]">Contacts</span>
                <Mail size={16} />
              </div>
              <div className="mt-2 font-condensed text-[28px] font-bold text-ink">
                {data?.contactsTotal || 0}
              </div>
              <Link href="/admin/contacts" className="mt-1 block text-[11px] text-accent hover:underline">
                View submissions →
              </Link>
            </div>

            <div className="rounded-xl border border-ink/10 bg-surface p-4">
              <div className="flex items-center justify-between text-muted">
                <span className="text-[11px] uppercase tracking-[0.14em]">Surveys</span>
                <HelpCircle size={16} />
              </div>
              <div className="mt-2 font-condensed text-[28px] font-bold text-ink">
                {data?.surveysTotal || 0}
              </div>
              <Link href="/admin/surveys" className="mt-1 block text-[11px] text-accent hover:underline">
                View feedback →
              </Link>
            </div>

            <div className="rounded-xl border border-ink/10 bg-surface p-4">
              <div className="flex items-center justify-between text-muted">
                <span className="text-[11px] uppercase tracking-[0.14em]">Subscribers</span>
                <Send size={16} />
              </div>
              <div className="mt-2 font-condensed text-[28px] font-bold text-ink">
                {data?.subscribersTotal || 0}
              </div>
              <Link href="/admin/subscribers" className="mt-1 block text-[11px] text-accent hover:underline">
                View list →
              </Link>
            </div>

            <div className="rounded-xl border border-ink/10 bg-surface p-4">
              <div className="flex items-center justify-between text-muted">
                <span className="text-[11px] uppercase tracking-[0.14em]">Pageviews</span>
                <Eye size={16} />
              </div>
              <div className="mt-2 font-condensed text-[28px] font-bold text-ink">
                {data?.totalPageviews || 0}
              </div>
              <span className="mt-1 block text-[11px] text-muted">in selected period</span>
            </div>

            <div className="rounded-xl border border-ink/10 bg-surface p-4">
              <div className="flex items-center justify-between text-muted">
                <span className="text-[11px] uppercase tracking-[0.14em]">Unique Visitors</span>
                <Activity size={16} />
              </div>
              <div className="mt-2 font-condensed text-[28px] font-bold text-ink">
                {data?.uniqueVisitors || 0}
              </div>
              <span className="mt-1 block text-[11px] text-muted">anonymous sessions</span>
            </div>
          </div>

          {/* Activity Timeline Bar Chart */}
          {data?.timeline && data.timeline.length > 0 && (
            <div className="mb-8 rounded-xl border border-ink/10 bg-surface p-6">
              <div className="mb-4 flex items-center justify-between">
                <div>
                  <h3 className="font-condensed text-[18px] font-semibold">Traffic Activity</h3>
                  <p className="text-[12px] text-muted">Page views and unique visitors over time</p>
                </div>
              </div>
              <div className="flex items-end gap-2 pt-6 pb-2" style={{ height: "180px" }}>
                {data.timeline.map((item: any) => {
                  const maxVal = Math.max(...data.timeline.map((t: any) => t.views), 1);
                  const heightPercent = Math.max(8, (item.views / maxVal) * 100);
                  return (
                    <div key={item.date} className="flex-1 flex flex-col items-center gap-1 group">
                      <div className="text-[10px] text-muted opacity-0 group-hover:opacity-100 transition-opacity">
                        {item.views}
                      </div>
                      <div
                        className="w-full bg-ink/75 group-hover:bg-ink rounded-t transition-all"
                        style={{ height: `${heightPercent}%` }}
                      />
                      <div className="mt-1 text-[10px] text-muted2 truncate w-full text-center">
                        {item.date.slice(5)}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* 3-Column Analytics Breakdown */}
          <div className="mb-8 grid gap-6 md:grid-cols-3">
            {/* Top Visited Pages */}
            <div className="rounded-xl border border-ink/10 bg-surface p-5">
              <h3 className="mb-3 font-condensed text-[17px] font-semibold">Top Visited Pages</h3>
              <div className="space-y-2.5">
                {data?.topPages?.length > 0 ? (
                  data.topPages.map((p: any) => (
                    <div key={p.path} className="flex items-center justify-between text-[13px]">
                      <span className="truncate max-w-[200px] font-mono text-[12px] text-ink">{p.path}</span>
                      <span className="rounded-full bg-ink/5 px-2.5 py-0.5 text-[11px] font-semibold text-muted">
                        {p.count}
                      </span>
                    </div>
                  ))
                ) : (
                  <div className="py-4 text-center text-[12.5px] text-muted">No pageviews recorded yet</div>
                )}
              </div>
            </div>

            {/* Traffic & Referral Sources */}
            <div className="rounded-xl border border-ink/10 bg-surface p-5">
              <h3 className="mb-3 font-condensed text-[17px] font-semibold">Traffic & Referrals</h3>
              <div className="space-y-2.5">
                {data?.topSources?.length > 0 ? (
                  data.topSources.map((s: any) => (
                    <div key={s.source} className="flex items-center justify-between text-[13px]">
                      <div className="flex items-center gap-2 truncate max-w-[200px]">
                        <Globe size={13} className="text-muted" />
                        <span className="capitalize">{s.source}</span>
                      </div>
                      <span className="rounded-full bg-ink/5 px-2.5 py-0.5 text-[11px] font-semibold text-muted">
                        {s.count}
                      </span>
                    </div>
                  ))
                ) : (
                  <div className="py-4 text-center text-[12.5px] text-muted">No referral data yet</div>
                )}
              </div>
            </div>

            {/* Devices & Browsers */}
            <div className="rounded-xl border border-ink/10 bg-surface p-5">
              <h3 className="mb-3 font-condensed text-[17px] font-semibold">Devices & Browsers</h3>
              <div className="mb-4 flex justify-around border-b border-ink/5 pb-4 text-center">
                <div>
                  <Monitor size={18} className="mx-auto mb-1 text-muted" />
                  <div className="font-semibold text-[13px]">{data?.deviceCounts?.desktop || 0}</div>
                  <div className="text-[10px] text-muted uppercase">Desktop</div>
                </div>
                <div>
                  <Smartphone size={18} className="mx-auto mb-1 text-muted" />
                  <div className="font-semibold text-[13px]">{data?.deviceCounts?.mobile || 0}</div>
                  <div className="text-[10px] text-muted uppercase">Mobile</div>
                </div>
                <div>
                  <Tablet size={18} className="mx-auto mb-1 text-muted" />
                  <div className="font-semibold text-[13px]">{data?.deviceCounts?.tablet || 0}</div>
                  <div className="text-[10px] text-muted uppercase">Tablet</div>
                </div>
              </div>

              <div className="space-y-2">
                <div className="text-[11px] text-muted uppercase tracking-wider">Top Browsers</div>
                {data?.topBrowsers?.map((b: any) => (
                  <div key={b.browser} className="flex items-center justify-between text-[12.5px]">
                    <span>{b.browser}</span>
                    <span className="text-muted text-[11px]">{b.count}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Recent Activity Log */}
          <div className="rounded-xl border border-ink/10 bg-surface p-6">
            <h3 className="mb-4 font-condensed text-[18px] font-semibold">Recent Activity Log</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-[12.5px]">
                <thead>
                  <tr className="border-b border-ink/10 text-[10.5px] uppercase tracking-[0.14em] text-muted">
                    <th className="pb-3">Time</th>
                    <th className="pb-3">Event</th>
                    <th className="pb-3">Target / Path</th>
                    <th className="pb-3">Source</th>
                    <th className="pb-3">Device</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-ink/5">
                  {data?.recentEvents?.map((ev: any, idx: number) => (
                    <tr key={idx} className="hover:bg-ink/5">
                      <td className="py-2.5 text-muted">
                        {ev.timestamp ? new Date(ev.timestamp).toLocaleTimeString() : "—"}
                      </td>
                      <td className="py-2.5 font-medium">
                        <span className="inline-block rounded bg-ink/10 px-2 py-0.5 text-[11px]">
                          {ev.eventType}
                        </span>
                      </td>
                      <td className="py-2.5 font-mono text-[11.5px] truncate max-w-[280px]">
                        {ev.target || ev.path}
                      </td>
                      <td className="py-2.5 capitalize text-muted">{ev.source || "direct"}</td>
                      <td className="py-2.5 capitalize text-muted">{ev.deviceType || "desktop"}</td>
                    </tr>
                  ))}
                  {(!data?.recentEvents || data.recentEvents.length === 0) && (
                    <tr>
                      <td colSpan={5} className="py-6 text-center text-muted">
                        No activity recorded yet. Browse the site to see events live!
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </AdminShell>
  );
}
