const { Client, Databases } = require("node-appwrite");
const fs = require("fs");
const path = require("path");

// Load .env.local if present
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

// Read Appwrite CLI prefs if available
let cliPrefs = null;
try {
  const userHome = process.env.USERPROFILE || process.env.HOME || "C:\\Users\\kavya";
  const prefsPath = path.join(userHome, ".appwrite", "prefs.json");
  if (fs.existsSync(prefsPath)) {
    cliPrefs = JSON.parse(fs.readFileSync(prefsPath, "utf-8"));
  }
} catch (e) {
  // ignore
}

const endpoint = process.env.APPWRITE_ENDPOINT || "https://fra.cloud.appwrite.io/v1";
const key = process.env.APPWRITE_API_KEY || (cliPrefs && cliPrefs[cliPrefs.current]?.key);
const candidateProjects = [
  process.env.APPWRITE_PROJECT_ID,
  cliPrefs?.current,
  "6a624b76001f34bbbe4d",
  "69958f25003190519213"
].filter(Boolean);

// Unique candidate projects
const projectsToTry = [...new Set(candidateProjects)];

console.log("=== AHVI Appwrite Read-Only Inspector ===");
console.log(`Endpoint: ${endpoint}`);
console.log(`API Key available: ${Boolean(key)}`);
console.log(`Projects to probe: ${JSON.stringify(projectsToTry)}`);

async function inspectProject(projectId) {
  console.log(`\n======================================================`);
  console.log(`Probing Project: ${projectId}`);
  console.log(`======================================================`);

  const client = new Client()
    .setEndpoint(endpoint)
    .setProject(projectId)
    .setKey(key);

  const databases = new Databases(client);

  try {
    const dbList = await databases.list();
    console.log(`[OK] Successfully connected to project: ${projectId}`);
    console.log(`Found ${dbList.total} database(s):`);

    for (const db of dbList.databases) {
      console.log(`\n  --------------------------------------------------`);
      console.log(`  Database Name: "${db.name}"`);
      console.log(`  Database ID:   "${db.$id}"`);
      console.log(`  Created At:    ${db.$createdAt}`);
      console.log(`  Updated At:    ${db.$updatedAt}`);
      console.log(`  --------------------------------------------------`);

      // List collections in this database
      try {
        const collList = await databases.listCollections(db.$id);
        console.log(`  Collections (${collList.total}):`);

        for (const col of collList.collections) {
          console.log(`\n    -> Collection Name: "${col.name}" | ID: "${col.$id}"`);
          console.log(`       Enabled: ${col.enabled} | Document Security: ${col.documentSecurity}`);

          // Count documents
          try {
            const docList = await databases.listDocuments(db.$id, col.$id);
            console.log(`       Document Count: ${docList.total}`);
            if (docList.total > 0) {
              const sample = docList.documents[0];
              const sampleKeys = Object.keys(sample).filter(k => !k.startsWith("$"));
              console.log(`       Sample Record Keys: ${JSON.stringify(sampleKeys)}`);
            }
          } catch (docErr) {
            console.log(`       Document Count Error: ${docErr.message}`);
          }

          // Attributes
          try {
            const attrList = await databases.listAttributes(db.$id, col.$id);
            console.log(`       Attributes (${attrList.total}):`);
            for (const attr of attrList.attributes) {
              const req = attr.required ? "required" : "optional";
              console.log(`         * ${attr.key} (${attr.type}, ${req}, status: ${attr.status})`);
            }
          } catch (attrErr) {
            console.log(`       Attributes Error: ${attrErr.message}`);
          }

          // Indexes
          try {
            const idxList = await databases.listIndexes(db.$id, col.$id);
            console.log(`       Indexes (${idxList.total}):`);
            for (const idx of idxList.indexes) {
              console.log(`         * ${idx.key} (${idx.type}, attributes: [${idx.attributes.join(", ")}], status: ${idx.status})`);
            }
          } catch (idxErr) {
            console.log(`       Indexes Error: ${idxErr.message}`);
          }
        }
      } catch (collErr) {
        console.log(`  Failed to list collections for db ${db.$id}: ${collErr.message}`);
      }
    }

    return true;
  } catch (err) {
    console.log(`[FAIL] Could not access project ${projectId}: ${err.message}`);
    return false;
  }
}

async function main() {
  if (!key) {
    console.error("ERROR: No API key found in .env.local or ~/.appwrite/prefs.json!");
    process.exit(1);
  }

  for (const pid of projectsToTry) {
    await inspectProject(pid);
  }
}

main().catch(err => {
  console.error("Fatal error:", err);
  process.exit(1);
});
