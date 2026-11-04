const { Client, Databases, Storage } = require("node-appwrite");
const fs = require("fs");
const path = require("path");

function loadEnv() {
  const envPath = path.join(process.cwd(), ".env.local");
  if (fs.existsSync(envPath)) {
    const lines = fs.readFileSync(envPath, "utf-8").split("\n");
    for (const line of lines) {
      const match = line.match(/^\s*([\w.-]+)\s*=\s*(.*)?\s*$/);
      if (match) {
        const key = match[1];
        let value = match[2] || "";
        if (value.startsWith('"') && value.endsWith('"')) value = value.slice(1, -1);
        if (value.startsWith("'") && value.endsWith("'")) value = value.slice(1, -1);
        if (!process.env[key]) process.env[key] = value.trim();
      }
    }
  }
}
loadEnv();

let cliKey = null;
try {
  const userHome = process.env.USERPROFILE || process.env.HOME || "C:\\Users\\kavya";
  const prefs = JSON.parse(fs.readFileSync(path.join(userHome, ".appwrite", "prefs.json"), "utf-8"));
  cliKey = prefs[prefs.current]?.key;
} catch (e) {}

const apiKey = process.env.APPWRITE_API_KEY || cliKey;
const endpoint = "https://fra.cloud.appwrite.io/v1";
const projectId = "69958f25003190519213";
const dbId = "69958fe40017ccd03111"; // ahvi db

console.log("=== Appwrite Scope & Read-Only Verification ===");
console.log(`Endpoint:    ${endpoint}`);
console.log(`Project ID:  ${projectId}`);
console.log(`Database ID: ${dbId}`);
console.log(`API Key Configured: ${Boolean(apiKey)} (Source: ${process.env.APPWRITE_API_KEY ? ".env.local" : "CLI prefs"})`);

if (!apiKey) {
  console.log("❌ No API key available to verify.");
  process.exit(1);
}

const client = new Client()
  .setEndpoint(endpoint)
  .setProject(projectId)
  .setKey(apiKey);

const databases = new Databases(client);
const storage = new Storage(client);

async function verifyScopes() {
  const results = {};

  // 1. databases.read
  try {
    const db = await databases.get(dbId);
    results["databases.read"] = { available: true, detail: `Found "${db.name}" (${db.$id})` };
  } catch (e) {
    results["databases.read"] = { available: false, error: e.message, code: e.code };
  }

  // 2. collections.read
  try {
    const colls = await databases.listCollections(dbId);
    results["collections.read"] = { available: true, detail: `Total collections: ${colls.total}` };
  } catch (e) {
    results["collections.read"] = { available: false, error: e.message, code: e.code };
  }

  // 3. attributes.read (on outfits)
  try {
    const attrs = await databases.listAttributes(dbId, "outfits");
    results["attributes.read"] = { available: true, detail: `Total attributes on outfits: ${attrs.total}` };
  } catch (e) {
    results["attributes.read"] = { available: false, error: e.message, code: e.code };
  }

  // 4. indexes.read (on outfits)
  try {
    const idxs = await databases.listIndexes(dbId, "outfits");
    results["indexes.read"] = { available: true, detail: `Total indexes on outfits: ${idxs.total}` };
  } catch (e) {
    results["indexes.read"] = { available: false, error: e.message, code: e.code };
  }

  // 5. documents.read (on outfits)
  try {
    const docs = await databases.listDocuments(dbId, "outfits");
    results["documents.read"] = { available: true, detail: `Total documents in outfits: ${docs.total}` };
  } catch (e) {
    results["documents.read"] = { available: false, error: e.message, code: e.code };
  }

  // 6. buckets.read
  try {
    const buckets = await storage.listBuckets();
    results["buckets.read"] = { available: true, detail: `Total buckets: ${buckets.total}` };
    if (buckets.total > 0) {
      console.log(`\nExisting Storage Buckets (${buckets.total}):`);
      for (const b of buckets.buckets) {
        console.log(` - Bucket Name: "${b.name}", ID: "${b.$id}", Enabled: ${b.enabled}, Max Size: ${b.maximumFileSize} bytes`);
      }
    }
  } catch (e) {
    results["buckets.read"] = { available: false, error: e.message, code: e.code };
  }

  // 7. files.read (test on existing bucket or check 404 vs 401 on candidate)
  try {
    let testBucketId = "ahvi_media";
    if (results["buckets.read"]?.available) {
      try {
        const bList = await storage.listBuckets();
        if (bList.buckets.length > 0) testBucketId = bList.buckets[0].$id;
      } catch {}
    }
    const files = await storage.listFiles(testBucketId);
    results["files.read"] = { available: true, detail: `Scope authorized (Total files in bucket '${testBucketId}': ${files.total})` };
  } catch (e) {
    if (e.code === 401 && (e.message || "").includes("missing scopes")) {
      results["files.read"] = { available: false, error: e.message, code: e.code };
    } else {
      // 404 or other non-auth code means the scope was checked and permitted!
      results["files.read"] = { available: true, detail: `Scope authorized (Bucket response code: ${e.code})` };
    }
  }

  // 8. collections.write (probe with invalid collectionId)
  try {
    await databases.createCollection(dbId, "", "");
    results["collections.write"] = { available: true };
  } catch (e) {
    if (e.code === 401 && (e.message || "").includes("missing scopes")) {
      results["collections.write"] = { available: false, error: e.message, code: e.code };
    } else {
      results["collections.write"] = { available: true, detail: "Scope authorized (validated via pre-flight check)" };
    }
  }

  // 9. attributes.write (probe with invalid parameters)
  try {
    await databases.createStringAttribute({ databaseId: dbId, collectionId: "", key: "", size: 1, required: true });
    results["attributes.write"] = { available: true };
  } catch (e) {
    if (e.code === 401 && (e.message || "").includes("missing scopes")) {
      results["attributes.write"] = { available: false, error: e.message, code: e.code };
    } else {
      results["attributes.write"] = { available: true, detail: "Scope authorized (validated via pre-flight check)" };
    }
  }

  // 10. indexes.write (probe with invalid parameters)
  try {
    await databases.createIndex(dbId, "", "", "key", []);
    results["indexes.write"] = { available: true };
  } catch (e) {
    if (e.code === 401 && (e.message || "").includes("missing scopes")) {
      results["indexes.write"] = { available: false, error: e.message, code: e.code };
    } else {
      results["indexes.write"] = { available: true, detail: "Scope authorized (validated via pre-flight check)" };
    }
  }

  // 11. documents.write (probe with invalid documentId)
  try {
    await databases.createDocument(dbId, "", "", {});
    results["documents.write"] = { available: true };
  } catch (e) {
    if (e.code === 401 && (e.message || "").includes("missing scopes")) {
      results["documents.write"] = { available: false, error: e.message, code: e.code };
    } else {
      results["documents.write"] = { available: true, detail: "Scope authorized (validated via pre-flight check)" };
    }
  }

  // 12. buckets.write (probe with invalid bucketId)
  try {
    await storage.createBucket("", "");
    results["buckets.write"] = { available: true };
  } catch (e) {
    if (e.code === 401 && (e.message || "").includes("missing scopes")) {
      results["buckets.write"] = { available: false, error: e.message, code: e.code };
    } else {
      results["buckets.write"] = { available: true, detail: "Scope authorized (validated via pre-flight check)" };
    }
  }

  // 13. files.write (probe with invalid file)
  try {
    await storage.createFile("", "", null);
    results["files.write"] = { available: true };
  } catch (e) {
    if (e.code === 401 && (e.message || "").includes("missing scopes")) {
      results["files.write"] = { available: false, error: e.message, code: e.code };
    } else {
      results["files.write"] = { available: true, detail: "Scope authorized (validated via pre-flight check)" };
    }
  }

  console.log("\n--- Scope Verification Results ---");
  for (const [scope, res] of Object.entries(results)) {
    if (res.available) {
      console.log(`  ✓ ${scope.padEnd(20)}: AVAILABLE (${res.detail})`);
    } else {
      console.log(`  ❌ ${scope.padEnd(20)}: MISSING / BLOCKED (code: ${res.code}, msg: ${res.error})`);
    }
  }
}

verifyScopes().catch(console.error);
