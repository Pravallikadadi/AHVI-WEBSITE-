/**
 * End-to-end test of the signup/login popup. Requires: mock Appwrite on MOCK_PORT and the site on SITE_URL
 * (started by scripts/run-auth-e2e.sh). Uses system Chrome via Playwright.
 */
import { chromium } from "playwright";

const SITE = process.env.SITE_URL || "http://localhost:3100";
const MOCK = `http://127.0.0.1:${process.env.MOCK_PORT || 4010}`;
const CHROME = process.env.CHROME_PATH || "/usr/bin/google-chrome";
const SHOTS = process.env.SHOTS_DIR || "/tmp/auth-shots";

let pass = 0, fail = 0;
const ok = (c, m) => { if (c) { pass++; console.log("  ✓", m); } else { fail++; console.log("  ✗ FAIL:", m); } };
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const state = () => fetch(`${MOCK}/v1/__debug/state`).then((r) => r.json());
const popup = (p) => p.locator('[data-testid="auth-popup"]');
const visible = (p) => popup(p).isVisible().catch(() => false);

const browser = await chromium.launch({ executablePath: CHROME, args: ["--no-sandbox"] });
const newCtx = (opts = {}) => browser.newContext({ viewport: { width: 1280, height: 800 }, ...opts });
await fetch(`${MOCK}/v1/__debug/reset`);

async function openNewVisit(ctx) {
  const page = await ctx.newPage();
  const t0 = Date.now();
  await page.goto(SITE, { waitUntil: "domcontentloaded" });
  return { page, t0 };
}

console.log("\n[1] Popup timing for a logged-out visitor");
{
  const ctx = await newCtx();
  const { page, t0 } = await openNewVisit(ctx);
  await sleep(500);
  ok(!(await visible(page)), "not visible at ~0.5s");
  await popup(page).waitFor({ state: "visible", timeout: 5000 });
  const shown = Date.now() - t0;
  console.log("    appeared after ~" + shown + "ms from navigation start");
  ok(shown >= 1000 && shown <= 2600, "appears roughly 1–2s after load (measured incl. page load)");
  ok(await page.getByRole("tab", { name: "Create account" }).isVisible(), "Create account tab present");
  ok(await page.getByRole("tab", { name: "Log in" }).isVisible(), "Log in tab present");
  await sleep(600);
  await page.screenshot({ path: `${SHOTS}/desktop-signup.png` });
  await page.getByRole("tab", { name: "Log in" }).click();
  await sleep(500);
  await page.screenshot({ path: `${SHOTS}/desktop-login.png` });
  await page.getByRole("button", { name: "Forgot password?" }).click();
  await sleep(500);
  ok(await page.getByText("Reset your password").first().isVisible(), "Forgot password view opens inside popup");
  await page.screenshot({ path: `${SHOTS}/desktop-forgot.png` });
  await ctx.close();
}

console.log("\n[2] Dismissal persists nothing; popup returns on next visit");
{
  const ctx = await newCtx();
  let { page } = await openNewVisit(ctx);
  await popup(page).waitFor({ state: "visible", timeout: 5000 });
  await page.locator('[data-testid="auth-popup-close"]').click();
  await sleep(700);
  ok(!(await visible(page)), "closes via X");
  const store = await page.evaluate(() => ({ l: Object.keys(localStorage).filter((k) => /auth|popup|dismiss|signup|login/i.test(k)), s: Object.keys(sessionStorage).filter((k) => /auth|popup|dismiss|signup|login/i.test(k)) }));
  ok(store.l.length === 0 && store.s.length === 0, "no dismissal flag in localStorage/sessionStorage");
  const cookies = (await ctx.cookies()).filter((c) => /auth|popup|dismiss|ahvi_user/i.test(c.name));
  ok(cookies.length === 0, "no dismissal cookie");
  await page.getByRole("link", { name: /pricing/i }).first().click().catch(() => {});
  await sleep(2200);
  ok(!(await visible(page)), "client-side navigation within the visit doesn't re-open it");
  await page.reload({ waitUntil: "domcontentloaded" });
  await popup(page).waitFor({ state: "visible", timeout: 5000 });
  ok(true, "shows again on next visit (reload)");
  await page.keyboard.press("Escape");
  await sleep(600);
  ok(!(await visible(page)), "Escape closes");
  await page.reload({ waitUntil: "domcontentloaded" });
  await popup(page).waitFor({ state: "visible", timeout: 5000 });
  await sleep(700); // let the entrance animation settle
  await page.mouse.click(8, 8);
  await sleep(600);
  ok(!(await visible(page)), "backdrop click closes");
  await ctx.close();
}

console.log("\n[3] Signup validation, success, duplicate, persistence");
const ctx = await newCtx();
let { page } = await openNewVisit(ctx);
await popup(page).waitFor({ state: "visible", timeout: 5000 });
const form = page.locator('[data-testid="auth-form-signup"]');
await form.getByRole("button", { name: "Create account" }).click();
ok(await page.getByText("Please enter your name").isVisible(), "empty name rejected");
ok(await page.getByText("Please enter a valid email address").isVisible(), "empty email rejected");
await form.getByPlaceholder("Your name").fill("Asha Rao");
await form.getByPlaceholder("you@example.com").fill("asha@example.com");
await form.getByPlaceholder("At least 8 characters").fill("short");
await form.getByRole("button", { name: "Create account" }).click();
ok(await page.getByText("Use at least 8 characters").isVisible(), "short password rejected");
await form.getByPlaceholder("At least 8 characters").fill("Str0ng!Passw0rd");
await form.getByRole("button", { name: "Create account" }).click();
await page.getByText(/your account is ready/i).waitFor({ timeout: 5000 });
ok(true, "signup success screen shown");
await sleep(2400);
ok(!(await visible(page)), "popup auto-closes after success");
const cookie = (await ctx.cookies()).find((c) => c.name === "ahvi_user_session");
ok(!!cookie && cookie.httpOnly && cookie.sameSite === "Lax", "httpOnly SameSite=Lax session cookie set");
ok(!!cookie && cookie.expires > Date.now() / 1000 + 86400 * 20, "cookie is persistent (~30 days)");
ok((await state()).users.some((u) => u.email === "asha@example.com" && u.name === "Asha Rao"), "user stored in Appwrite (name+email)");
ok(await page.locator('[data-testid="navbar-account"]').isVisible(), "navbar shows account button");
await page.reload({ waitUntil: "domcontentloaded" });
await sleep(3500);
ok(!(await visible(page)), "popup NOT shown on later visit while authenticated (session persists)");
ok(await page.locator('[data-testid="navbar-account"]').isVisible(), "still authenticated after reload");
const sess = await (await page.request.get(`${SITE}/api/user/session`)).json();
ok(sess.authenticated === true && sess.user.email === "asha@example.com", "/api/user/session reports user");

console.log("\n[4] Admin isolation");
{
  const r = await page.request.get(`${SITE}/admin`, { maxRedirects: 0 });
  ok([301, 302, 303, 307, 308].includes(r.status()), "user session cannot open /admin (redirected)");
  await ctx.addCookies([{ name: "ahvi_admin_session", value: cookie.value, url: SITE }]);
  const r2 = await page.request.get(`${SITE}/admin`, { maxRedirects: 0 });
  ok([301, 302, 303, 307, 308].includes(r2.status()), "user cookie copied into admin cookie is rejected");
  await ctx.clearCookies({ name: "ahvi_admin_session" });
  const adm = await page.request.post(`${SITE}/api/auth/login`, { data: { password: "wrong-pass" } });
  ok(adm.status() === 401, "existing admin login endpoint still works (401 on bad password)");
}

console.log("\n[5] Logout");
await page.locator('[data-testid="navbar-account"]').click();
await page.locator('[data-testid="navbar-logout"]').click();
await page.locator('[data-testid="navbar-login"]').waitFor({ timeout: 5000 });
ok(true, "navbar returns to logged-out state");
ok((await (await page.request.get(`${SITE}/api/user/session`)).json()).authenticated === false, "server session cleared");
ok((await state()).sessionCount === 0, "Appwrite session deleted");
await page.reload({ waitUntil: "domcontentloaded" });
await popup(page).waitFor({ state: "visible", timeout: 5000 });
ok(true, "popup returns on next visit after logout");

console.log("\n[6] Duplicate signup + login errors");
await page.getByRole("tab", { name: "Create account" }).click();
const f2 = page.locator('[data-testid="auth-form-signup"]');
await f2.getByPlaceholder("Your name").fill("Other");
await f2.getByPlaceholder("you@example.com").fill("ASHA@example.com");
await f2.getByPlaceholder("At least 8 characters").fill("Another!Pass1");
await f2.getByRole("button", { name: "Create account" }).click();
await page.getByText(/already exists/i).waitFor({ timeout: 5000 });
ok(true, "duplicate email (case-insensitive) rejected with message");
await page.getByRole("tab", { name: "Log in" }).click();
const lf = page.locator('[data-testid="auth-form-login"]');
await lf.getByPlaceholder("you@example.com").fill("asha@example.com");
await lf.getByPlaceholder("Your password").fill("wrong-password");
await lf.getByRole("button", { name: "Log in" }).click();
await page.getByText("Incorrect email or password.").waitFor({ timeout: 5000 });
ok(true, "wrong password shows generic error");
await lf.getByPlaceholder("Your password").fill("Str0ng!Passw0rd");
await lf.getByRole("button", { name: "Log in" }).click();
await page.getByText("You're signed in.").waitFor({ timeout: 5000 });
ok(true, "login success");
await sleep(2200);
ok(!(await visible(page)), "popup closed after login");
ok(await page.locator('[data-testid="navbar-account"]').isVisible(), "navbar shows account after login");
await ctx.close();

console.log("\n[7] Forgot / reset password");
{
  const c = await newCtx();
  const { page: p } = await openNewVisit(c);
  await popup(p).waitFor({ state: "visible", timeout: 5000 });
  await p.getByRole("tab", { name: "Log in" }).click();
  await p.getByRole("button", { name: "Forgot password?" }).click();
  const ff = p.locator('[data-testid="auth-form-forgot"]');
  await ff.getByPlaceholder("you@example.com").fill("nobody@example.com");
  await ff.getByRole("button", { name: "Send reset link" }).click();
  await p.getByText("Check your inbox").first().waitFor({ timeout: 5000 });
  ok(true, "unknown email gets same generic confirmation (no enumeration)");
  await p.getByRole("button", { name: "Back to log in" }).click();
  await p.getByRole("button", { name: "Forgot password?" }).click();
  await ff.getByPlaceholder("you@example.com").fill("asha@example.com");
  await ff.getByRole("button", { name: "Send reset link" }).click();
  await p.getByText("Check your inbox").first().waitFor({ timeout: 5000 });
  const log = (await state()).recoveryLog;
  ok(log.length === 1 && log[0].email === "asha@example.com", "recovery requested only for the real account");
  ok(log[0].url.endsWith("/reset-password"), "recovery URL targets /reset-password: " + log[0].url);
  await p.goto(`${SITE}/reset-password?userId=${log[0].userId}&secret=${log[0].secret}`, { waitUntil: "domcontentloaded" });
  await sleep(2600);
  ok(!(await visible(p)), "auto popup is suppressed on /reset-password");
  const rf = p.locator('[data-testid="reset-form"]');
  await rf.getByLabel("NEW PASSWORD").fill("Brand-New-Pass9");
  await rf.getByLabel("CONFIRM PASSWORD").fill("different");
  await rf.getByRole("button", { name: "Update password" }).click();
  ok(await p.getByText("Passwords don't match").isVisible(), "mismatched confirmation rejected");
  await rf.getByLabel("CONFIRM PASSWORD").fill("Brand-New-Pass9");
  await rf.getByRole("button", { name: "Update password" }).click();
  await p.locator('[data-testid="reset-success"]').waitFor({ timeout: 5000 });
  ok(true, "password reset succeeds");
  const reuse = await p.request.post(`${SITE}/api/user/reset-password`, { data: { userId: log[0].userId, secret: log[0].secret, password: "Another-Pass-1" } });
  ok(reuse.status() === 400, "reset link is single-use");
  const oldLogin = await p.request.post(`${SITE}/api/user/login`, { data: { email: "asha@example.com", password: "Str0ng!Passw0rd" } });
  const newLogin = await p.request.post(`${SITE}/api/user/login`, { data: { email: "asha@example.com", password: "Brand-New-Pass9" } });
  ok(oldLogin.status() === 401 && newLogin.status() === 200, "old password rejected, new password works");
  await c.close();
}

console.log("\n[8] Auth check gates display");
{
  // Verification failure (503) must not be treated as logged-out.
  const c = await newCtx();
  const p = await c.newPage();
  await p.route("**/api/user/session", (r) => r.fulfill({ status: 503, contentType: "application/json", body: '{"authenticated":null}' }));
  await p.goto(SITE, { waitUntil: "domcontentloaded" });
  await sleep(3500);
  ok(!(await visible(p)), "popup stays hidden when auth status cannot be verified");
  await c.close();

  // Popup must wait for the check: delay it 3s, popup must not appear before it resolves.
  const c2 = await newCtx();
  const p2 = await c2.newPage();
  let resolvedAt = 0;
  await p2.route("**/api/user/session", async (r) => { await sleep(3000); resolvedAt = Date.now(); await r.continue(); });
  await p2.goto(SITE, { waitUntil: "domcontentloaded" });
  await sleep(2400);
  ok(!(await visible(p2)), "no popup while the auth check is still pending (even after 2s)");
  await popup(p2).waitFor({ state: "visible", timeout: 6000 });
  ok(Date.now() >= resolvedAt, "popup only appears after the check returns 'logged out'");
  await c2.close();
}

console.log("\n[9] Admin pages unaffected");
{
  const c = await newCtx();
  const p = await c.newPage();
  await p.goto(`${SITE}/admin/login`, { waitUntil: "domcontentloaded" });
  await sleep(3000);
  ok(!(await visible(p)), "no signup popup on /admin/login");
  await c.close();
}

console.log("\n[10] Mobile + dark theme layout");
{
  const c = await newCtx({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true });
  const { page: p } = await openNewVisit(c);
  await popup(p).waitFor({ state: "visible", timeout: 5000 });
  await sleep(700);
  const m = await p.evaluate(() => {
    const d = document.querySelector('[data-testid="auth-popup"]').getBoundingClientRect();
    return { w: d.width, bottom: d.bottom, vh: innerHeight, vw: innerWidth, sw: document.documentElement.scrollWidth };
  });
  ok(m.w <= m.vw + 1 && m.sw <= m.vw + 1, "no horizontal overflow on mobile");
  ok(Math.abs(m.bottom - m.vh) < 2, "renders as bottom sheet on mobile");
  await p.screenshot({ path: `${SHOTS}/mobile-signup.png` });
  await p.evaluate(() => document.documentElement.setAttribute("data-theme", "dark"));
  await sleep(300);
  await p.screenshot({ path: `${SHOTS}/mobile-dark.png` });
  await c.close();
  const c2 = await newCtx({ colorScheme: "dark" });
  const { page: p2 } = await openNewVisit(c2);
  await popup(p2).waitFor({ state: "visible", timeout: 5000 });
  await sleep(700);
  await p2.screenshot({ path: `${SHOTS}/desktop-dark.png` });
  await c2.close();
}

await browser.close();
console.log(`\n==== ${pass} passed, ${fail} failed ====`);
process.exit(fail ? 1 : 0);
