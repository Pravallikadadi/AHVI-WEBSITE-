/**
 * AHVI - Safe, Non-Destructive Appwrite Backend Setup & Migration Script
 *
 * CRITICAL SAFETY RULES:
 * 1. REUSES existing database 'ahvi_db' (ID: 69958fe40017ccd03111) if it exists.
 * 2. NEVER deletes, recreates, or overwrites existing databases.
 * 3. NEVER drops or overwrites existing collections.
 * 4. NEVER deletes or modifies existing documents or data.
 * 5. Reuses existing collections and adds only missing attributes & indexes.
 * 6. Checks unique slugs before adding blog stories (zero duplication).
 * 7. Completely idempotent - safe to execute multiple times.
 */

const fs = require("fs");
const path = require("path");
const { Client, Databases, Storage, Users, ID, Permission, Role, Query } = require("node-appwrite");

// Load .env.local or .env
function loadEnv() {
  const envFiles = [".env.local", ".env"];
  for (const f of envFiles) {
    const full = path.join(process.cwd(), f);
    if (fs.existsSync(full)) {
      const lines = fs.readFileSync(full, "utf8").split("\n");
      for (const line of lines) {
        const trimmed = line.trim();
        if (!trimmed || trimmed.startsWith("#")) continue;
        const eqIdx = trimmed.indexOf("=");
        if (eqIdx !== -1) {
          const key = trimmed.slice(0, eqIdx).trim();
          const val = trimmed.slice(eqIdx + 1).trim().replace(/^["']|["']$/g, "");
          if (!process.env[key]) process.env[key] = val;
        }
      }
    }
  }
}

loadEnv();

// Also fallback to ~/.appwrite/prefs.json if available
try {
  const userHome = process.env.USERPROFILE || process.env.HOME || "C:\\Users\\kavya";
  const prefsPath = path.join(userHome, ".appwrite", "prefs.json");
  if (fs.existsSync(prefsPath)) {
    const prefs = JSON.parse(fs.readFileSync(prefsPath, "utf-8"));
    if (!process.env.APPWRITE_PROJECT_ID && prefs.current) {
      process.env.APPWRITE_PROJECT_ID = prefs.current;
    }
    if (!process.env.APPWRITE_API_KEY && prefs[prefs.current]?.key) {
      process.env.APPWRITE_API_KEY = prefs[prefs.current].key;
    }
    if (!process.env.APPWRITE_ENDPOINT && prefs[prefs.current]?.endpoint) {
      process.env.APPWRITE_ENDPOINT = prefs[prefs.current].endpoint;
    }
  }
} catch (e) {
  // ignore
}

const ENDPOINT = process.env.APPWRITE_ENDPOINT || "https://fra.cloud.appwrite.io/v1";
const PROJECT_ID = process.env.APPWRITE_PROJECT_ID || "69958f25003190519213";
const API_KEY = process.env.APPWRITE_API_KEY;
const TARGET_DB_ID = process.env.APPWRITE_DATABASE_ID || "69958fe40017ccd03111"; // Known existing ahvi_db
const BUCKET_ID = process.env.APPWRITE_STORAGE_BUCKET_ID || "ahvi_media";
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || "admin@ahvi.com";
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "ahvi-admin";

const COLLECTIONS = {
  contacts: process.env.APPWRITE_COLLECTION_CONTACTS || "contacts",
  waitlist: process.env.APPWRITE_COLLECTION_WAITLIST || "waitlist",
  surveys: process.env.APPWRITE_COLLECTION_SURVEYS || "surveys",
  subscribers: process.env.APPWRITE_COLLECTION_SUBSCRIBERS || "subscribers",
  analytics: process.env.APPWRITE_COLLECTION_ANALYTICS || "analytics_events",
  blogs: process.env.APPWRITE_COLLECTION_BLOGS || "blogs",
};

async function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function main() {
  console.log("==================================================");
  console.log("  AHVI - Non-Destructive Appwrite Integration     ");
  console.log("==================================================");

  if (!PROJECT_ID || !API_KEY) {
    console.error("\n❌ Error: Missing Appwrite configuration!");
    console.error("Please ensure APPWRITE_PROJECT_ID and APPWRITE_API_KEY are configured.");
    process.exit(1);
  }

  console.log(`Connecting to Appwrite:`);
  console.log(`• Endpoint:    ${ENDPOINT}`);
  console.log(`• Project ID:  ${PROJECT_ID}`);
  console.log(`• Target DB:   ${TARGET_DB_ID}\n`);

  const client = new Client().setEndpoint(ENDPOINT).setProject(PROJECT_ID).setKey(API_KEY);
  const databases = new Databases(client);
  const storage = new Storage(client);
  const users = new Users(client);

  const stats = {
    databasesReused: [],
    collectionsReused: [],
    collectionsCreated: [],
    attributesCreated: [],
    attributesSkipped: [],
    indexesCreated: [],
    indexesSkipped: [],
    blogsMigrated: 0,
    blogsSkipped: 0,
  };

  // 1. Locate and lock onto existing database
  let resolvedDbId = TARGET_DB_ID;
  try {
    const dbList = await databases.list();
    const existingDb = dbList.databases.find(
      (d) =>
        d.$id === TARGET_DB_ID ||
        d.name.toLowerCase() === "ahvi db" ||
        d.name.toLowerCase() === "ahvi_db"
    );

    if (existingDb) {
      resolvedDbId = existingDb.$id;
      stats.databasesReused.push(`${existingDb.name} (${existingDb.$id})`);
      console.log(`✓ Reusing existing database: "${existingDb.name}" [${existingDb.$id}]`);
    } else {
      console.log(`Creating database 'ahvi_db' [${TARGET_DB_ID}]...`);
      await databases.create(TARGET_DB_ID, "ahvi db");
      console.log(`✓ Database '${TARGET_DB_ID}' created.`);
    }
  } catch (err) {
    console.log(`Notice on database lookup: ${err.message}. Verifying direct access to ${resolvedDbId}...`);
    await databases.get(resolvedDbId);
    stats.databasesReused.push(resolvedDbId);
  }

  // 2. Collection helper functions
  async function ensureCollection(id, name, permissions = []) {
    try {
      const coll = await databases.getCollection(resolvedDbId, id);
      stats.collectionsReused.push(`${name} (${id})`);
      console.log(`✓ Reusing existing collection: '${name}' (${id})`);
      return coll;
    } catch (err) {
      if (err.code === 404) {
        console.log(`+ Creating missing collection: '${name}' (${id})...`);
        const coll = await databases.createCollection(resolvedDbId, id, name, permissions);
        stats.collectionsCreated.push(`${name} (${id})`);
        console.log(`✓ Collection '${name}' created.`);
        await sleep(1000);
        return coll;
      }
      throw err;
    }
  }

  async function ensureStringAttr(colId, key, size, required = false, isArray = false, def = undefined) {
    try {
      await databases.getAttribute(resolvedDbId, colId, key);
      stats.attributesSkipped.push(`${colId}.${key}`);
    } catch (err) {
      if (err.code === 404) {
        console.log(`  + Attribute '${key}' (${isArray ? "array" : "string"})`);
        await databases.createStringAttribute(resolvedDbId, colId, key, size, required, def, isArray);
        stats.attributesCreated.push(`${colId}.${key}`);
        await sleep(800);
      } else {
        throw err;
      }
    }
  }

  async function ensureEmailAttr(colId, key, required = false) {
    try {
      await databases.getAttribute(resolvedDbId, colId, key);
      stats.attributesSkipped.push(`${colId}.${key}`);
    } catch (err) {
      if (err.code === 404) {
        console.log(`  + Attribute '${key}' (email)`);
        await databases.createEmailAttribute(resolvedDbId, colId, key, required);
        stats.attributesCreated.push(`${colId}.${key}`);
        await sleep(800);
      } else {
        throw err;
      }
    }
  }

  async function ensureBoolAttr(colId, key, required = false, def = false) {
    try {
      await databases.getAttribute(resolvedDbId, colId, key);
      stats.attributesSkipped.push(`${colId}.${key}`);
    } catch (err) {
      if (err.code === 404) {
        console.log(`  + Attribute '${key}' (boolean)`);
        await databases.createBooleanAttribute(resolvedDbId, colId, key, required, def);
        stats.attributesCreated.push(`${colId}.${key}`);
        await sleep(800);
      } else {
        throw err;
      }
    }
  }

  async function ensureIndex(colId, key, type, attributes, orders = []) {
    try {
      await databases.getIndex(resolvedDbId, colId, key);
      stats.indexesSkipped.push(`${colId}.${key}`);
    } catch (err) {
      if (err.code === 404) {
        console.log(`  + Index '${key}' (${type}) on [${attributes.join(", ")}]`);
        try {
          await databases.createIndex(resolvedDbId, colId, key, type, attributes, orders);
          stats.indexesCreated.push(`${colId}.${key}`);
          await sleep(1000);
        } catch (idxErr) {
          console.warn(`    ⚠️ Notice on index '${key}': ${idxErr.message}`);
        }
      }
    }
  }

  // --- Collection: Contacts ---
  console.log("\nChecking 'contacts' collection...");
  await ensureCollection(COLLECTIONS.contacts, "Contact Inquiries");
  await ensureStringAttr(COLLECTIONS.contacts, "name", 100, false);
  await ensureEmailAttr(COLLECTIONS.contacts, "email", false);
  await ensureStringAttr(COLLECTIONS.contacts, "subject", 200, false);
  await ensureStringAttr(COLLECTIONS.contacts, "message", 5000, false);
  await ensureStringAttr(COLLECTIONS.contacts, "status", 50, false, false, "new");
  await ensureStringAttr(COLLECTIONS.contacts, "createdAt", 50, false);
  await ensureIndex(COLLECTIONS.contacts, "idx_status", "key", ["status"]);
  await ensureIndex(COLLECTIONS.contacts, "idx_createdAt", "key", ["createdAt"], ["DESC"]);

  // --- Collection: Waitlist ---
  console.log("\nChecking 'waitlist' collection...");
  await ensureCollection(COLLECTIONS.waitlist, "Waitlist Entries");
  await ensureStringAttr(COLLECTIONS.waitlist, "name", 100, true);
  await ensureEmailAttr(COLLECTIONS.waitlist, "email", true);
  await ensureStringAttr(COLLECTIONS.waitlist, "phone", 50, false);
  await ensureStringAttr(COLLECTIONS.waitlist, "interests", 50, false, true);
  await ensureStringAttr(COLLECTIONS.waitlist, "referralCode", 50, false);
  await ensureStringAttr(COLLECTIONS.waitlist, "status", 50, false, false, "pending");
  await ensureStringAttr(COLLECTIONS.waitlist, "createdAt", 50, true);
  await ensureIndex(COLLECTIONS.waitlist, "idx_email", "key", ["email"]);
  await ensureIndex(COLLECTIONS.waitlist, "idx_status", "key", ["status"]);
  await ensureIndex(COLLECTIONS.waitlist, "idx_createdAt", "key", ["createdAt"], ["DESC"]);

  // --- Collection: Surveys ---
  console.log("\nChecking 'surveys' collection...");
  await ensureCollection(COLLECTIONS.surveys, "Survey Responses");
  await ensureStringAttr(COLLECTIONS.surveys, "want", 50, true, true);
  await ensureStringAttr(COLLECTIONS.surveys, "challenge", 3000, false);
  await ensureStringAttr(COLLECTIONS.surveys, "createdAt", 50, true);
  await ensureIndex(COLLECTIONS.surveys, "idx_createdAt", "key", ["createdAt"], ["DESC"]);

  // --- Collection: Subscribers ---
  console.log("\nChecking 'subscribers' collection...");
  await ensureCollection(COLLECTIONS.subscribers, "Newsletter Subscribers");
  await ensureEmailAttr(COLLECTIONS.subscribers, "email", true);
  await ensureStringAttr(COLLECTIONS.subscribers, "status", 50, false, false, "subscribed");
  await ensureStringAttr(COLLECTIONS.subscribers, "createdAt", 50, true);
  await ensureIndex(COLLECTIONS.subscribers, "idx_email", "key", ["email"]);
  await ensureIndex(COLLECTIONS.subscribers, "idx_createdAt", "key", ["createdAt"], ["DESC"]);

  // --- Collection: Analytics Events ---
  console.log("\nChecking 'analytics_events' collection...");
  await ensureCollection(COLLECTIONS.analytics, "Website Analytics Events");
  await ensureStringAttr(COLLECTIONS.analytics, "eventType", 50, true);
  await ensureStringAttr(COLLECTIONS.analytics, "path", 300, true);
  await ensureStringAttr(COLLECTIONS.analytics, "referrer", 500, false);
  await ensureStringAttr(COLLECTIONS.analytics, "source", 100, false);
  await ensureStringAttr(COLLECTIONS.analytics, "utmSource", 100, false);
  await ensureStringAttr(COLLECTIONS.analytics, "utmMedium", 100, false);
  await ensureStringAttr(COLLECTIONS.analytics, "utmCampaign", 100, false);
  await ensureStringAttr(COLLECTIONS.analytics, "utmTerm", 100, false);
  await ensureStringAttr(COLLECTIONS.analytics, "utmContent", 100, false);
  await ensureStringAttr(COLLECTIONS.analytics, "sessionId", 100, true);
  await ensureStringAttr(COLLECTIONS.analytics, "visitorId", 100, true);
  await ensureStringAttr(COLLECTIONS.analytics, "deviceType", 50, false);
  await ensureStringAttr(COLLECTIONS.analytics, "browser", 100, false);
  await ensureStringAttr(COLLECTIONS.analytics, "target", 150, false);
  await ensureStringAttr(COLLECTIONS.analytics, "metadata", 5000, false);
  await ensureStringAttr(COLLECTIONS.analytics, "timestamp", 50, true);
  await ensureIndex(COLLECTIONS.analytics, "idx_timestamp", "key", ["timestamp"], ["DESC"]);
  await ensureIndex(COLLECTIONS.analytics, "idx_eventType", "key", ["eventType"]);

  // --- Collection: Blogs (Public Read) ---
  console.log("\nChecking 'blogs' collection...");
  await ensureCollection(COLLECTIONS.blogs, "Blog Stories", [Permission.read(Role.any())]);
  await ensureStringAttr(COLLECTIONS.blogs, "title", 255, true);
  await ensureStringAttr(COLLECTIONS.blogs, "slug", 255, true);
  await ensureStringAttr(COLLECTIONS.blogs, "excerpt", 1500, false);
  await ensureStringAttr(COLLECTIONS.blogs, "content", 100000, true);
  await ensureStringAttr(COLLECTIONS.blogs, "coverImage", 500, true);
  await ensureStringAttr(COLLECTIONS.blogs, "heroImage", 500, false);
  await ensureStringAttr(COLLECTIONS.blogs, "contentImages", 500, false, true);
  await ensureStringAttr(COLLECTIONS.blogs, "shapeCarousels", 20000, false);
  await ensureStringAttr(COLLECTIONS.blogs, "galleryCarousel", 20000, false);
  await ensureStringAttr(COLLECTIONS.blogs, "category", 100, true);
  await ensureStringAttr(COLLECTIONS.blogs, "author", 100, true);
  await ensureStringAttr(COLLECTIONS.blogs, "readingTime", 50, true);
  await ensureBoolAttr(COLLECTIONS.blogs, "featured", false, false);
  await ensureStringAttr(COLLECTIONS.blogs, "tags", 100, false, true);
  await ensureStringAttr(COLLECTIONS.blogs, "status", 50, true, false, "draft");
  await ensureStringAttr(COLLECTIONS.blogs, "publishedAt", 50, false);
  await ensureStringAttr(COLLECTIONS.blogs, "createdAt", 50, true);
  await ensureStringAttr(COLLECTIONS.blogs, "updatedAt", 50, true);
  await ensureIndex(COLLECTIONS.blogs, "idx_slug", "unique", ["slug"]);
  await ensureIndex(COLLECTIONS.blogs, "idx_status", "key", ["status"]);
  await ensureIndex(COLLECTIONS.blogs, "idx_category", "key", ["category"]);
  await ensureIndex(COLLECTIONS.blogs, "idx_createdAt", "key", ["createdAt"], ["DESC"]);

  // 3. Storage Bucket Setup
  console.log(`\nChecking Storage Bucket '${BUCKET_ID}'...`);
  try {
    await storage.getBucket(BUCKET_ID);
    console.log(`✓ Bucket '${BUCKET_ID}' exists.`);
  } catch (err) {
    if (err.code === 404) {
      console.log(`Creating bucket '${BUCKET_ID}'...`);
      await storage.createBucket(
        BUCKET_ID,
        "AHVI Media & Blog Assets",
        [Permission.read(Role.any())],
        false,
        true,
        8 * 1024 * 1024,
        ["jpg", "jpeg", "png", "webp"]
      );
      console.log(`✓ Bucket '${BUCKET_ID}' created.`);
    }
  }

  // 4. Non-Destructive Blog Migration (checks unique slug before writing)
  console.log("\nChecking blog stories from data/blogs.json...");
  const blogsPath = path.join(process.cwd(), "data", "blogs.json");
  if (fs.existsSync(blogsPath)) {
    const localBlogs = JSON.parse(fs.readFileSync(blogsPath, "utf8"));
    console.log(`Found ${localBlogs.length} articles to check.`);

    await sleep(2000);

    for (const blog of localBlogs) {
      try {
        const existing = await databases.listDocuments(resolvedDbId, COLLECTIONS.blogs, [
          Query.equal("slug", blog.slug),
          Query.limit(1),
        ]);

        if (existing.total > 0) {
          stats.blogsSkipped++;
          continue;
        }

        const payload = {
          title: blog.title,
          slug: blog.slug,
          excerpt: blog.excerpt || "",
          content: blog.content,
          coverImage: blog.coverImage,
          heroImage: blog.heroImage || "",
          contentImages: blog.contentImages || [],
          shapeCarousels: blog.shapeCarousels ? JSON.stringify(blog.shapeCarousels) : "",
          galleryCarousel: blog.galleryCarousel ? JSON.stringify(blog.galleryCarousel) : "",
          category: blog.category,
          author: blog.author,
          readingTime: blog.readingTime,
          featured: Boolean(blog.featured),
          tags: blog.tags || [],
          status: blog.status,
          publishedAt: blog.publishedAt || "",
          createdAt: blog.createdAt,
          updatedAt: blog.updatedAt,
        };

        await databases.createDocument(resolvedDbId, COLLECTIONS.blogs, ID.unique(), payload);
        stats.blogsMigrated++;
        process.stdout.write(`.`);
      } catch (err) {
        console.error(`\nFailed to migrate '${blog.slug}':`, err.message);
      }
    }
    console.log(`\n✓ Blog check complete: ${stats.blogsMigrated} new articles imported, ${stats.blogsSkipped} already present.`);
  }

  // 5. Summary
  console.log("\n==================================================");
  console.log("   Execution Summary                              ");
  console.log("==================================================");
  console.log(`• Database Reused:      ${stats.databasesReused.join(", ") || resolvedDbId}`);
  console.log(`• Collections Reused:   ${stats.collectionsReused.length} (${stats.collectionsReused.join(", ")})`);
  console.log(`• Collections Created:  ${stats.collectionsCreated.length} (${stats.collectionsCreated.join(", ")})`);
  console.log(`• Attributes Created:   ${stats.attributesCreated.length}`);
  console.log(`• Attributes Reused:    ${stats.attributesSkipped.length}`);
  console.log(`• Indexes Created:      ${stats.indexesCreated.length}`);
  console.log(`• Indexes Reused:       ${stats.indexesSkipped.length}`);
  console.log(`• Blogs Migrated:       ${stats.blogsMigrated}`);
  console.log(`• Blogs Reused/Skipped: ${stats.blogsSkipped}`);
  console.log("==================================================\n");
}

main().catch((err) => {
  console.error("\n❌ Fatal setup error:", err);
  process.exit(1);
});
