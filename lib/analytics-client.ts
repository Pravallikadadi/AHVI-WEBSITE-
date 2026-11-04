"use client";

function generateId(prefix: string): string {
  if (typeof crypto !== "undefined" && crypto.randomUUID) {
    return prefix + "_" + crypto.randomUUID().replace(/-/g, "").slice(0, 16);
  }
  return prefix + "_" + Math.random().toString(36).slice(2, 10) + Date.now().toString(36);
}

export function getSessionId(): string {
  if (typeof window === "undefined") return "";
  try {
    let sid = sessionStorage.getItem("ahvi_sid");
    if (!sid) {
      sid = generateId("s");
      sessionStorage.setItem("ahvi_sid", sid);
    }
    return sid;
  } catch {
    return "s_anonymous";
  }
}

export function getVisitorId(): string {
  if (typeof window === "undefined") return "";
  try {
    let vid = localStorage.getItem("ahvi_vid");
    if (!vid) {
      vid = generateId("v");
      localStorage.setItem("ahvi_vid", vid);
    }
    return vid;
  } catch {
    return "v_anonymous";
  }
}

export function isDoNotTrackEnabled(): boolean {
  if (typeof window === "undefined" || typeof navigator === "undefined") return false;
  return navigator.doNotTrack === "1" || (window as any).doNotTrack === "1";
}

let eventQueue: any[] = [];
let flushTimeout: NodeJS.Timeout | null = null;

export function flushQueue() {
  if (eventQueue.length === 0) return;
  const batch = [...eventQueue];
  eventQueue = [];

  const body = JSON.stringify(batch);

  if (typeof navigator !== "undefined" && navigator.sendBeacon) {
    const blob = new Blob([body], { type: "application/json" });
    const success = navigator.sendBeacon("/api/analytics", blob);
    if (success) return;
  }

  fetch("/api/analytics", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body,
    keepalive: true,
  }).catch(() => {
    // Ignore network error in analytics
  });
}

export function trackEvent(
  eventType: "pageview" | "click" | "form_start" | "form_submit" | "session_start",
  details: {
    path?: string;
    target?: string;
    metadata?: Record<string, any>;
  } = {}
) {
  if (typeof window === "undefined") return;
  if (isDoNotTrackEnabled()) return;

  const url = new URL(window.location.href);
  const utmSource = url.searchParams.get("utm_source") || "";
  const utmMedium = url.searchParams.get("utm_medium") || "";
  const utmCampaign = url.searchParams.get("utm_campaign") || "";
  const utmTerm = url.searchParams.get("utm_term") || "";
  const utmContent = url.searchParams.get("utm_content") || "";

  const event = {
    eventType,
    path: details.path || window.location.pathname,
    referrer: document.referrer || "",
    utmSource,
    utmMedium,
    utmCampaign,
    utmTerm,
    utmContent,
    sessionId: getSessionId(),
    visitorId: getVisitorId(),
    target: details.target || "",
    metadata: details.metadata || {},
  };

  eventQueue.push(event);

  if (flushTimeout) clearTimeout(flushTimeout);
  flushTimeout = setTimeout(flushQueue, 300);
}

export function trackPageView(path: string) {
  trackEvent("pageview", { path });
}

export function trackClick(target: string, metadata?: Record<string, any>) {
  trackEvent("click", { target, metadata });
}

export function trackFormStart(formName: string) {
  trackEvent("form_start", { target: formName });
}

export function trackFormSubmit(formName: string, success: boolean) {
  trackEvent("form_submit", { target: formName, metadata: { success } });
}
