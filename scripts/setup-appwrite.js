/**
 * AHVI - Automated Appwrite Backend Setup & Migration Script
 *
 * This script:
 * 1. Connects to your Appwrite project via node-appwrite
 * 2. Creates the Database (ahvi_db)
 * 3. Creates all Collections with required attributes, types, and indexes:
 *    - contacts
 *    - waitlist
 *    - surveys
 *    - subscribers
 *    - analytics
 *    - blogs (with public read permission)
 * 4. Creates the Storage Bucket (ahvi_media) for blog images (public read, JPG/PNG/WebP, 8MB max)
 * 5. Migrates all 30 articles from data/blogs.json into Appwrite Database
 * 6. Sets up the initial Admin user account in Appwrite
 *
 * Usage:
 *   node scripts/setup-appwrite.js
 */

const fs = require("fs");
const path = require("path");
const { Client, Databases, Storage, Users, ID, Permission, Role, Query } = require("node-appwrite");

// Simple dotenv parser
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

const ENDPOINT = process.env.APPWRITE_ENDPOINT || "https://cloud.appwrite.io/v1";
const PROJECT_ID = process.env.APPWRITE_PROJECT_ID;
const API_KEY = process.env.APPWRITE_API_KEY;
const DATABASE_ID = process.env.APPWRITE_DATABASE_ID || "ahvi_db";
const BUCKET_ID = process.env.APPWRITE_STORAGE_BUCKET_ID || "ahvi_media";
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || "admin@ahvi.com";
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "ahvi-admin";

const COLLECTIONS = {
  contacts: process.env.APPWRITE_COLLECTION_CONTACTS || "contacts",
  waitlist: process.env.APPWRITE_COLLECTION_WAITLIST || "waitlist",
  surveys: process.env.APPWRITE_COLLECTION_SURVEYS || "surveys",
  subscribers: process.env.APPWRITE_COLLECTION_SUBSCRIBERS || "subscribers",
  analytics: process.env.APPWRITE_COLLECTION_ANALYTICS || "analytics",
  blogs: process.env.APPWRITE_COLLECTION_BLOGS || "blogs",
};

async function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function main() {
  console.log("==================================================");
  console.log("   AHVI - Appwrite Backend Setup & Migration");
  console.log("==================================================");

  if (!PROJECT_ID || !API_KEY) {
    console.error("\n❌ Error: Missing Appwrite configuration!");
    console.error("Please ensure .env or environment contains:");
    console.error("  APPWRITE_PROJECT_ID=your_project_id");
    console.error("  APPWRITE_API_KEY=your_server_api_key");
    console.error("  APPWRITE_ENDPOINT=https://cloud.appwrite.io/v1\n");
    process.exit(1);
  }

  console.log(`\nConnecting to Appwrite:`);
  console.log(`• Endpoint:   ${ENDPOINT}`);
  console.log(`• Project ID: ${PROJECT_ID}`);
  console.log(`• Database:   ${DATABASE_ID}`);
  console.log(`• Bucket:     ${BUCKET_ID}\n`);

  const client = new Client().setEndpoint(ENDPOINT).setProject(PROJECT_ID).setKey(API_KEY);
  const databases = new Databases(client);
  const storage = new Storage(client);
  const users = new Users(client);

  // 1. Ensure Database exists
  try {
    await databases.get(DATABASE_ID);
    console.log(`✓ Database '${DATABASE_ID}' already exists.`);
  } catch (err) {
    console.log(`Creating database '${DATABASE_ID}'...`);
    await databases.create(DATABASE_ID, "AHVI Database");
    console.log(`✓ Database '${DATABASE_ID}' created.`);
  }

  // 2. Setup Collections
  async function ensureCollection(id, name, permissions = []) {
    try {
      await databases.getCollection(DATABASE_ID, id);
      console.log(`✓ Collection '${name}' (${id}) exists.`);
    } catch {
      console.log(`Creating collection '${name}' (${id})...`);
      await databases.createCollection(DATABASE_ID, id, name, permissions);
      console.log(`✓ Collection '${name}' created.`);
      await sleep(1000);
    }
  }

  async function ensureStringAttr(colId, key, size, required = false, isArray = false, def = undefined) {
    try {
      await databases.getAttribute(DATABASE_ID, colId, key);
    } catch {
      console.log(`  + Attribute '${key}' (${isArray ? "array" : "string"})`);
      await databases.createStringAttribute(DATABASE_ID, colId, key, size, required, def, isArray);
      await sleep(800);
    }
  }

  async function ensureEmailAttr(colId, key, required = false) {
    try {
      await databases.getAttribute(DATABASE_ID, colId, key);
    } catch {
      console.log(`  + Attribute '${key}' (email)`);
      await databases.createEmailAttribute(DATABASE_ID, colId, key, required);
      await sleep(800);
    }
  }

  async function ensureBoolAttr(colId, key, required = false, def = false) {
    try {
      await databases.getAttribute(DATABASE_ID, colId, key);
    } catch {
      console.log(`  + Attribute '${key}' (boolean)`);
      await databases.createBooleanAttribute(DATABASE_ID, colId, key, required, def);
      await sleep(800);
    }
  }

  // --- Collection: Contacts ---
  console.log("\nConfiguring 'contacts' collection...");
  await ensureCollection(COLLECTIONS.contacts, "Contact Inquiries");
  await ensureStringAttr(COLLECTIONS.contacts, "name", 100, false);
  await ensureEmailAttr(COLLECTIONS.contacts, "email", true);
  await ensureStringAttr(COLLECTIONS.contacts, "subject", 200, false);
  await ensureStringAttr(COLLECTIONS.contacts, "message", 5000, true);
  await ensureStringAttr(COLLECTIONS.contacts, "status", 50, false, false, "new");
  await ensureStringAttr(COLLECTIONS.contacts, "createdAt", 50, true);

  // --- Collection: Waitlist ---
  console.log("\nConfiguring 'waitlist' collection...");
  await ensureCollection(COLLECTIONS.waitlist, "Waitlist Entries");
  await ensureStringAttr(COLLECTIONS.waitlist, "name", 100, true);
  await ensureEmailAttr(COLLECTIONS.waitlist, "email", true);
  await ensureStringAttr(COLLECTIONS.waitlist, "phone", 50, false);
  await ensureStringAttr(COLLECTIONS.waitlist, "interests", 50, false, true);
  await ensureStringAttr(COLLECTIONS.waitlist, "referralCode", 50, false);
  await ensureStringAttr(COLLECTIONS.waitlist, "status", 50, false, false, "pending");
  await ensureStringAttr(COLLECTIONS.waitlist, "createdAt", 50, true);

  // --- Collection: Surveys ---
  console.log("\nConfiguring 'surveys' collection...");
  await ensureCollection(COLLECTIONS.surveys, "Survey Responses");
  await ensureStringAttr(COLLECTIONS.surveys, "want", 50, true, true);
  await ensureStringAttr(COLLECTIONS.surveys, "challenge", 3000, false);
  await ensureStringAttr(COLLECTIONS.surveys, "createdAt", 50, true);

  // --- Collection: Subscribers ---
  console.log("\nConfiguring 'subscribers' collection...");
  await ensureCollection(COLLECTIONS.subscribers, "Newsletter Subscribers");
  await ensureEmailAttr(COLLECTIONS.subscribers, "email", true);
  await ensureStringAttr(COLLECTIONS.subscribers, "status", 50, false, false, "subscribed");
  await ensureStringAttr(COLLECTIONS.subscribers, "createdAt", 50, true);

  // --- Collection: Analytics ---
  console.log("\nConfiguring 'analytics' collection...");
  await ensureCollection(COLLECTIONS.analytics, "Website Analytics");
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

  // --- Collection: Blogs (Public Read) ---
  console.log("\nConfiguring 'blogs' collection...");
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

  // 3. Storage Bucket Setup
  console.log(`\nConfiguring Storage Bucket '${BUCKET_ID}'...`);
  try {
    await storage.getBucket(BUCKET_ID);
    console.log(`✓ Bucket '${BUCKET_ID}' exists.`);
  } catch {
    console.log(`Creating bucket '${BUCKET_ID}'...`);
    await storage.createBucket(
      BUCKET_ID,
      "AHVI Media & Blog Assets",
      [Permission.read(Role.any())], // public can view images
      false, // fileSecurity
      true, // enabled
      8 * 1024 * 1024, // 8MB limit
      ["jpg", "jpeg", "png", "webp"]
    );
    console.log(`✓ Bucket '${BUCKET_ID}' created.`);
  }

  // 4. Migrate Blog Stories from data/blogs.json
  console.log("\nMigrating blog stories from data/blogs.json to Appwrite...");
  const blogsPath = path.join(process.cwd(), "data", "blogs.json");
  if (fs.existsSync(blogsPath)) {
    const localBlogs = JSON.parse(fs.readFileSync(blogsPath, "utf8"));
    console.log(`Found ${localBlogs.length} articles to check.`);

    // Wait a brief moment for Appwrite attributes to index
    await sleep(2000);

    let migrated = 0;
    for (const blog of localBlogs) {
      try {
        const existing = await databases.listDocuments(DATABASE_ID, COLLECTIONS.blogs, [
          Query.equal("slug", blog.slug),
          Query.limit(1),
        ]);

        if (existing.total > 0) {
          continue; // Already migrated
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

        await databases.createDocument(DATABASE_ID, COLLECTIONS.blogs, ID.unique(), payload);
        migrated++;
        process.stdout.write(`.`);
      } catch (err) {
        console.error(`\nFailed to migrate '${blog.slug}':`, err.message);
      }
    }
    console.log(`\n✓ Migration complete: ${migrated} new articles uploaded (${localBlogs.length - migrated} already present).`);
  }

  // 5. Setup Admin User Account
  console.log(`\nSetting up Admin account in Appwrite: ${ADMIN_EMAIL}...`);
  try {
    const userList = await users.list([Query.equal("email", ADMIN_EMAIL)]);
    if (userList.total === 0) {
      await users.create(ID.unique(), ADMIN_EMAIL, null, ADMIN_PASSWORD, "AHVI Admin");
      console.log(`✓ Admin user '${ADMIN_EMAIL}' created successfully.`);
    } else {
      console.log(`✓ Admin user '${ADMIN_EMAIL}' already exists.`);
    }
  } catch (err) {
    console.warn(`Admin user notice: ${err.message}`);
  }

  console.log("\n==================================================");
  console.log("   🎉 Appwrite Backend Setup Successfully Complete!   ");
  console.log("==================================================\n");
}

main().catch((err) => {
  console.error("\n❌ Fatal setup error:", err);
  process.exit(1);
});
