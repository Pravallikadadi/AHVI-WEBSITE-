/**
 * Minimal in-memory Appwrite stand-in for testing the end-user auth flow without real credentials.
 * Implements only what lib/user-auth.ts calls. Usage: node scripts/mock-appwrite.mjs [port]
 */
import http from "node:http";
import crypto from "node:crypto";

const port = Number(process.argv[2] || 4010);
const users = new Map(); // email -> {id,name,email,password}
const sessions = new Map(); // secret -> userId
const recoveries = new Map(); // secret -> userId
const recoveryLog = [];
const calls = [];

const json = (res, code, body) => {
  res.writeHead(code, { "Content-Type": "application/json" });
  res.end(JSON.stringify(body));
};
const err = (res, code, type, message) => json(res, code, { code, type, message });
const readBody = (req) =>
  new Promise((resolve) => {
    let d = "";
    req.on("data", (c) => (d += c));
    req.on("end", () => {
      try { resolve(d ? JSON.parse(d) : {}); } catch { resolve({}); }
    });
  });
const userById = (id) => [...users.values()].find((u) => u.id === id);

http
  .createServer(async (req, res) => {
    const url = new URL(req.url, "http://x");
    const path = url.pathname.replace(/^\/v1/, "");
    const body = await readBody(req);
    calls.push({ method: req.method, path, hasKey: Boolean(req.headers["x-appwrite-key"]), hasSession: Boolean(req.headers["x-appwrite-session"]) });

    if (path === "/__debug/state") return json(res, 200, { users: [...users.values()].map((u) => ({ email: u.email, name: u.name })), recoveryLog, calls, sessionCount: sessions.size });
    if (path === "/__debug/reset") { users.clear(); sessions.clear(); recoveries.clear(); recoveryLog.length = 0; calls.length = 0; return json(res, 200, {}); }
    if (path === "/__debug/fail" ) { globalThis.__fail = body.mode || null; return json(res, 200, {}); }
    if (globalThis.__fail === "down" && path === "/account") return err(res, 500, "general_server_error", "boom");

    const secretOf = () => req.headers["x-appwrite-session"];

    if (req.method === "POST" && path === "/users") {
      if (!req.headers["x-appwrite-key"]) return err(res, 401, "general_unauthorized_scope", "missing key");
      const email = String(body.email || "").toLowerCase();
      if (users.has(email)) return err(res, 409, "user_already_exists", "exists");
      if (String(body.password || "").length < 8) return err(res, 400, "general_argument_invalid", "bad password");
      const u = { id: body.userId, name: body.name || "", email, password: body.password };
      users.set(email, u);
      return json(res, 201, { $id: u.id, name: u.name, email: u.email });
    }
    if (req.method === "POST" && path === "/account/sessions/email") {
      const u = users.get(String(body.email || "").toLowerCase());
      if (!u || u.password !== body.password) return err(res, 401, "user_invalid_credentials", "Invalid credentials");
      const secret = crypto.randomBytes(24).toString("hex");
      sessions.set(secret, u.id);
      return json(res, 201, { $id: crypto.randomUUID(), userId: u.id, secret, expire: "2099-01-01T00:00:00.000+00:00" });
    }
    if (req.method === "GET" && path === "/account") {
      const uid = sessions.get(secretOf());
      const u = uid && userById(uid);
      if (!u) return err(res, 401, "user_unauthorized", "unauthorized");
      return json(res, 200, { $id: u.id, name: u.name, email: u.email });
    }
    if (req.method === "DELETE" && path === "/account/sessions/current") {
      if (!sessions.delete(secretOf())) return err(res, 401, "user_unauthorized", "unauthorized");
      return json(res, 204, {});
    }
    if (req.method === "POST" && path === "/account/recovery") {
      const u = users.get(String(body.email || "").toLowerCase());
      if (!u) return err(res, 404, "user_not_found", "not found");
      const secret = crypto.randomBytes(16).toString("hex");
      recoveries.set(secret, u.id);
      recoveryLog.push({ email: u.email, url: body.url, userId: u.id, secret });
      return json(res, 201, { $id: "t", userId: u.id, secret: "", expire: "2099" });
    }
    if (req.method === "PUT" && path === "/account/recovery") {
      const uid = recoveries.get(body.secret);
      if (!uid || uid !== body.userId) return err(res, 401, "user_invalid_token", "invalid token");
      userById(uid).password = body.password;
      recoveries.delete(body.secret);
      return json(res, 200, { $id: "t", userId: uid });
    }
    // Everything else (analytics/db) — behave like an unconfigured collection.
    return err(res, 404, "general_route_not_found", "not found");
  })
  .listen(port, "127.0.0.1", () => console.log(`mock-appwrite listening on ${port}`));
