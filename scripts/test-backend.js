/**
 * Comprehensive Backend Test Suite for AHVI
 */

const {
  contactSubmissionSchema,
  waitlistEntrySchema,
  surveyResponseSchema,
  newsletterSchema,
  analyticsEventSchema,
  blogInputSchema,
} = require("../lib/validations.ts");

const crypto = require("crypto");

// Cryptographic token signing
const SECRET = process.env.ADMIN_SESSION_SECRET || "ahvi-dev-secret-session-key-32chars";
function sign(value) {
  return crypto.createHmac("sha256", SECRET).update(value).digest("hex");
}
function createSignedToken(payload) {
  const json = JSON.stringify(payload);
  const base64 = Buffer.from(json).toString("base64url");
  const signature = sign(base64);
  return `${base64}.${signature}`;
}
function parseSignedToken(token) {
  if (!token) return null;
  const parts = token.split(".");
  if (parts.length !== 2) return null;
  const [base64, signature] = parts;
  if (sign(base64) !== signature) return null;
  const payload = JSON.parse(Buffer.from(base64, "base64url").toString("utf8"));
  // Expire after 7 days
  if (Date.now() - payload.timestamp > 7 * 24 * 60 * 60 * 1000) return null;
  return payload;
}

// User-Agent & Traffic Parser tests
function parseUserAgent(ua) {
  const lower = ua.toLowerCase();
  let deviceType = "desktop";
  if (/ipad|tablet|(android(?!.*mobile))|(windows(?!.*phone)(.*touch))/i.test(lower)) deviceType = "tablet";
  else if (/mobile|iphone|ipod|blackberry/i.test(lower)) deviceType = "mobile";

  let browser = "Other";
  if (lower.includes("edg/")) browser = "Edge";
  else if (lower.includes("chrome/") || lower.includes("crios/")) browser = "Chrome";
  else if (lower.includes("firefox/")) browser = "Firefox";
  else if (lower.includes("safari/") && !lower.includes("chrome")) browser = "Safari";

  return { deviceType, browser };
}

function classifyTrafficSource(referrer, utmSource) {
  if (utmSource) return utmSource.toLowerCase();
  if (!referrer) return "direct";
  try {
    const host = new URL(referrer).hostname.toLowerCase();
    if (host.includes("google")) return "google";
    if (host.includes("instagram")) return "instagram";
    if (host.includes("twitter") || host.includes("x.com")) return "x/twitter";
    return host;
  } catch {
    return "referral";
  }
}

// In-memory rate limiter logic
const store = new Map();
function checkRateLimit(namespace, key, limit, windowMs) {
  const now = Date.now();
  const bucketKey = `${namespace}:${key}`;
  const record = store.get(bucketKey) || { timestamps: [] };
  const active = record.timestamps.filter((ts) => now - ts < windowMs);
  if (active.length >= limit) {
    return { success: false, remaining: 0 };
  }
  active.push(now);
  store.set(bucketKey, { timestamps: active });
  return { success: true, remaining: limit - active.length };
}

// CSV Formatter
function escapeCsvValue(val) {
  if (val === null || val === undefined) return '""';
  const str = Array.isArray(val) ? val.join("; ") : String(val);
  return `"${str.replace(/"/g, '""')}"`;
}
function toCsv(rows) {
  if (rows.length === 0) return "";
  const headers = Object.keys(rows[0]);
  const lines = [headers.join(",")];
  for (const row of rows) {
    lines.push(headers.map((h) => escapeCsvValue(row[h])).join(","));
  }
  return lines.join("\n");
}

let passed = 0;
let failed = 0;

function assert(condition, message) {
  if (condition) {
    console.log(`  ✓ ${message}`);
    passed++;
  } else {
    console.error(`  ❌ FAIL: ${message}`);
    failed++;
  }
}

console.log("==========================================");
console.log("   Running AHVI Backend Verification Tests");
console.log("==========================================\n");

// 1. Validation Tests
console.log("[1] Form Validations:");
const validContact = contactSubmissionSchema.safeParse({
  name: "John Doe",
  email: "john@example.com",
  subject: "Partnership",
  message: "Hello AHVI team, I'd like to partner with your AI styling platform.",
});
assert(validContact.success, "Valid contact submission accepted");

const invalidContact = contactSubmissionSchema.safeParse({
  email: "not-an-email",
  message: "hi",
});
assert(!invalidContact.success, "Invalid contact submission rejected (short message & bad email)");

const validWaitlist = waitlistEntrySchema.safeParse({
  name: "Jane Smith",
  email: "jane@ahvi.com",
  phone: "+1234567890",
  interests: ["Style", "Plan"],
});
assert(validWaitlist.success, "Valid waitlist entry accepted");

const botHoneypot = waitlistEntrySchema.safeParse({
  name: "Spam Bot",
  email: "bot@spam.com",
  honeypot: "http://spam.ru",
});
assert(!botHoneypot.success, "Honeypot caught and rejected spam bot input");

const validSurvey = surveyResponseSchema.safeParse({
  want: ["Style", "Wardrobe"],
  challenge: "Finding clothes that fit my body type comfortably.",
});
assert(validSurvey.success, "Valid survey response accepted");

const invalidSurvey = surveyResponseSchema.safeParse({
  want: [],
  challenge: "No interest selected",
});
assert(!invalidSurvey.success, "Survey response without interest categories rejected");

const validNewsletter = newsletterSchema.safeParse({ email: "subscriber@example.com" });
assert(validNewsletter.success, "Valid newsletter subscription accepted");

const invalidNewsletter = newsletterSchema.safeParse({ email: "invalid-email" });
assert(!invalidNewsletter.success, "Invalid newsletter email rejected");

// 2. Rate Limiting Tests
console.log("\n[2] Rate Limiting:");
const testIp = "192.168.1.100";
const r1 = checkRateLimit("test-action", testIp, 3, 10000);
const r2 = checkRateLimit("test-action", testIp, 3, 10000);
const r3 = checkRateLimit("test-action", testIp, 3, 10000);
const r4 = checkRateLimit("test-action", testIp, 3, 10000);

assert(r1.success && r2.success && r3.success, "Initial requests within limit allowed");
assert(!r4.success && r4.remaining === 0, "4th request exceeded limit and blocked");

// 3. Authentication & Signed Session Tokens
console.log("\n[3] Session Token Security:");
const token = createSignedToken({ email: "admin@ahvi.com", timestamp: Date.now() });
assert(typeof token === "string" && token.includes("."), "Signed session token generated");

const parsed = parseSignedToken(token);
assert(parsed?.email === "admin@ahvi.com", "Signed session token accurately parsed and verified");

const tamperedToken = token.slice(0, -3) + "xyz";
assert(parseSignedToken(tamperedToken) === null, "Tampered session token correctly rejected");

const expiredToken = createSignedToken({
  email: "admin@ahvi.com",
  timestamp: Date.now() - 8 * 24 * 60 * 60 * 1000, // 8 days ago
});
assert(parseSignedToken(expiredToken) === null, "Expired session token (> 7 days) correctly rejected");

// 4. Analytics Parsing
console.log("\n[4] Privacy-Conscious Analytics:");
const mobileUA = "Mozilla/5.0 (iPhone; CPU iPhone OS 16_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.0 Mobile/15E148 Safari/604.1";
const desktopUA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36";

const mobileParsed = parseUserAgent(mobileUA);
assert(mobileParsed.deviceType === "mobile" && mobileParsed.browser === "Safari", "iPhone user agent parsed correctly");

const desktopParsed = parseUserAgent(desktopUA);
assert(desktopParsed.deviceType === "desktop" && desktopParsed.browser === "Chrome", "Desktop Chrome parsed correctly");

assert(classifyTrafficSource("https://www.google.com/search?q=ahvi") === "google", "Google referrer classified");
assert(classifyTrafficSource("https://instagram.com") === "instagram", "Instagram referrer classified");
assert(classifyTrafficSource("https://x.com/ahvi") === "x/twitter", "X / Twitter referrer classified");
assert(classifyTrafficSource("", "twitter_campaign") === "twitter_campaign", "UTM source prioritised");
assert(classifyTrafficSource("") === "direct", "Direct traffic classified");

// 5. Blog Schema Validation
console.log("\n[5] Blog Schema Validation:");
const validPublishedBlog = blogInputSchema.safeParse({
  title: "The Future of Personal Styling",
  content: "<p>Artificial intelligence is redefining modern wardrobes.</p>",
  coverImage: "/images/blogs/blog-01.jpg",
  category: "Fashion",
  author: "AHVI Editorial",
  readingTime: "5 min",
  status: "published",
});
assert(validPublishedBlog.success, "Published blog with cover image accepted");

const validDraftBlogWithoutCover = blogInputSchema.safeParse({
  title: "Draft Article In Progress",
  content: "<p>Draft notes about minimalist dressing.</p>",
  category: "Tips",
  status: "draft",
});
assert(validDraftBlogWithoutCover.success, "Draft blog without cover image accepted");

const invalidPublishedBlogWithoutCover = blogInputSchema.safeParse({
  title: "Article Attempting to Publish Without Image",
  content: "<p>Some text here.</p>",
  coverImage: "",
  category: "Fashion",
  status: "published",
});
assert(!invalidPublishedBlogWithoutCover.success, "Published blog without cover image rejected by schema");

// 6. CSV Export Generator
console.log("\n[6] CSV Export Engine:");
const sampleRows = [
  { Name: "Jane Smith", Email: "jane@ahvi.com", Interests: ["Style", "Plan"], Note: 'Quoted "Text"' },
  { Name: "John Doe", Email: "john@example.com", Interests: [], Note: "Regular note" },
];
const csvResult = toCsv(sampleRows);
assert(csvResult.includes("Name,Email,Interests,Note"), "CSV header correctly generated");
assert(csvResult.includes('"Style; Plan"'), "Array values serialized with semicolon separator");
assert(csvResult.includes('"Quoted ""Text"""'), "Double quotes escaped according to RFC 4180");

console.log("\n==========================================");
console.log(`   Results: ${passed} Passed, ${failed} Failed`);
console.log("==========================================\n");

if (failed > 0) process.exit(1);
