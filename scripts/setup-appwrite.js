/**
 * AHVI - Non-Destructive, Idempotent Appwrite Backend Setup & Migration Script
 *
 * MANDATORY SAFETY GUARDS:
 * 1. STRICT LOCK: Uses ONLY existing database 'ahvi db' (ID: 69958fe40017ccd03111).
 * 2. ZERO WRITES IN DRY-RUN: Default mode is --dry-run. No modifications are executed
 *    unless explicitly passed with --apply.
 * 3. MOBILE DATA GUARD: Strictly isolates and protects all 20+ mobile collections
 *    (outfits, style_assets, users, saved_boards, contacts, etc.). Never modifies them.
 * 4. DRAFT BLOG SECURITY: Blogs collection uses documentSecurity: true with NO
 *    collection-level public read. Only published documents receive public read.
 * 5. LEAST-PRIVILEGE MEDIA: ahvi_media bucket allows public read only. File writes
 *    restricted to authenticated server-side admins.
 * 6. IDEMPOTENT & SLUG-SAFE: Verifies existing slugs and collections before proposing additions.
 */

const fs = require("fs");
const path = require("path");
const { Client, Databases, Storage, ID, Permission, Role, Query } = require("node-appwrite");

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

// Fallback to CLI prefs for read-only inspection if needed
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
} catch (e) {}

const isApply = process.argv.includes("--apply") || process.argv.includes("--execute");
const isDryRun = !isApply;

const ENDPOINT = process.env.APPWRITE_ENDPOINT || "https://fra.cloud.appwrite.io/v1";
const PROJECT_ID = process.env.APPWRITE_PROJECT_ID || "69958f25003190519213";
const API_KEY = process.env.APPWRITE_API_KEY;
const TARGET_DB_ID = "69958fe40017ccd03111"; // STRICT: locked to existing ahvi db
const BUCKET_ID = process.env.APPWRITE_STORAGE_BUCKET_ID || "ahvi_media";

// Mobile collections that must NEVER be modified
const MOBILE_COLLECTIONS_GUARD = new Set([
  "outfits",
  "style_assets",
  "users",
  "saved_boards",
  "workout_outfits",
  "calendar_events",
  "med_logs",
  "skincare_profiles",
  "meds",
  "bills",
  "meal_plans",
  "coupons",
  "life_goals",
  "plans",
  "chat_threads",
  "chat_messages",
  "contacts", // Mobile contacts phonebook
  "skincare_logs",
  "fitness_logs",
  "style_board_states",
  "wardrobe_style_metadata",
  "upload_batches",
  "prepared_items",
  "wear_events",
  "orders",
  "email_review_queue",
  "inbound_webhook_raw",
]);

// Website collections (Option 2: website_contacts)
const COLLECTIONS = {
  contacts: process.env.APPWRITE_COLLECTION_CONTACTS || "website_contacts",
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
  console.log("================================================================================");
  console.log(
    isDryRun
      ? "  AHVI - Appwrite Dry-Run Inspector (SAFETY MODE: ZERO WRITES PERFORMED)        "
      : "  AHVI - Safe Non-Destructive Appwrite Provisioning (--apply)                   "
  );
  console.log("================================================================================");
  console.log(`• Mode:               ${isDryRun ? "DRY-RUN (Read-Only Simulation)" : "EXECUTE / APPLY"}`);
  console.log(`• Endpoint:           ${ENDPOINT}`);
  console.log(`• Project ID:         ${PROJECT_ID}`);
  console.log(`• Database Target ID: ${TARGET_DB_ID} (Name: "ahvi db")`);
  console.log(`• Storage Bucket ID:  ${BUCKET_ID}`);
  console.log(`• API Key Configured: ${Boolean(API_KEY)}\n`);

  if (!PROJECT_ID || !API_KEY) {
    console.error("❌ Error: Missing APPWRITE_PROJECT_ID or APPWRITE_API_KEY.");
    process.exit(1);
  }

  // Safety Assertion 1: Guard against modifying any mobile collections
  for (const [key, colId] of Object.entries(COLLECTIONS)) {
    if (MOBILE_COLLECTIONS_GUARD.has(colId)) {
      console.error(
        `❌ CRITICAL SAFETY VIOLATION: Collection mapping '${key}: ${colId}' points to a protected mobile collection!`
      );
      console.error(`Mobile collection '${colId}' must remain completely untouched.`);
      process.exit(1);
    }
  }

  const client = new Client().setEndpoint(ENDPOINT).setProject(PROJECT_ID).setKey(API_KEY);
  const databases = new Databases(client);
  const storage = new Storage(client);

  const dryRunReport = {
    database: null,
    mobileCollectionsConfirmedUntouched: [],
    existingWebsiteCollections: [],
    proposedNewCollections: [],
    proposedAttributes: [],
    proposedIndexes: [],
    storageBucketAction: null,
    blogsChecked: 0,
    blogsProposedForImport: 0,
    blogsAlreadyPresent: 0,
  };

  // 1. Verify Target Database
  console.log("--- 1. Database Verification ---");
  try {
    const db = await databases.get(TARGET_DB_ID);
    dryRunReport.database = { id: db.$id, name: db.name, created: db.$createdAt };
    console.log(`✓ Locked onto existing database: "${db.name}" [ID: ${db.$id}]`);
    console.log(`✓ Creation timestamp: ${db.$createdAt}`);
    console.log(`✓ Safety Guarantee: Databases will NEVER be recreated, renamed, or modified.\n`);
  } catch (err) {
    console.error(`❌ Could not access target database ${TARGET_DB_ID}: ${err.message}`);
    process.exit(1);
  }

  // 2. Confirm Mobile Collections are Excluded and Untouched
  console.log("--- 2. Mobile Collections Guard Confirmation ---");
  console.log(`The following ${MOBILE_COLLECTIONS_GUARD.size} mobile collections are STRICTLY EXCLUDED from modification:`);
  for (const mobCol of MOBILE_COLLECTIONS_GUARD) {
    dryRunReport.mobileCollectionsConfirmedUntouched.push(mobCol);
    console.log(`  [PROTECTED & EXCLUDED] ${mobCol}`);
  }
  console.log("");

  // 3. Inspect Existing vs Proposed Website Collections
  console.log("--- 3. Website Collections Inspection ---");
  const websiteCollectionSpecs = [
    {
      id: COLLECTIONS.contacts,
      name: "Website Contact Inquiries",
      documentSecurity: false,
      permissions: [],
      attributes: [
        { key: "name", type: "string", size: 100, required: false },
        { key: "email", type: "email", required: true },
        { key: "subject", type: "string", size: 200, required: false },
        { key: "message", type: "string", size: 5000, required: true },
        { key: "status", type: "string", size: 50, required: false, default: "new" },
        { key: "createdAt", type: "string", size: 50, required: true },
      ],
      indexes: [
        { key: "idx_status", type: "key", attributes: ["status"] },
        { key: "idx_createdAt", type: "key", attributes: ["createdAt"], orders: ["DESC"] },
      ],
    },
    {
      id: COLLECTIONS.waitlist,
      name: "Waitlist Entries",
      documentSecurity: false,
      permissions: [],
      attributes: [
        { key: "name", type: "string", size: 100, required: true },
        { key: "email", type: "email", required: true },
        { key: "phone", type: "string", size: 50, required: false },
        { key: "interests", type: "string", size: 50, required: false, isArray: true },
        { key: "referralCode", type: "string", size: 50, required: false },
        { key: "status", type: "string", size: 50, required: false, default: "pending" },
        { key: "createdAt", type: "string", size: 50, required: true },
      ],
      indexes: [
        { key: "idx_email", type: "key", attributes: ["email"] },
        { key: "idx_status", type: "key", attributes: ["status"] },
        { key: "idx_createdAt", type: "key", attributes: ["createdAt"], orders: ["DESC"] },
      ],
    },
    {
      id: COLLECTIONS.surveys,
      name: "Survey Responses",
      documentSecurity: false,
      permissions: [],
      attributes: [
        { key: "want", type: "string", size: 50, required: true, isArray: true },
        { key: "challenge", type: "string", size: 3000, required: false },
        { key: "createdAt", type: "string", size: 50, required: true },
      ],
      indexes: [
        { key: "idx_createdAt", type: "key", attributes: ["createdAt"], orders: ["DESC"] },
      ],
    },
    {
      id: COLLECTIONS.subscribers,
      name: "Newsletter Subscribers",
      documentSecurity: false,
      permissions: [],
      attributes: [
        { key: "email", type: "email", required: true },
        { key: "status", type: "string", size: 50, required: false, default: "subscribed" },
        { key: "createdAt", type: "string", size: 50, required: true },
      ],
      indexes: [
        { key: "idx_email", type: "key", attributes: ["email"] },
        { key: "idx_createdAt", type: "key", attributes: ["createdAt"], orders: ["DESC"] },
      ],
    },
    {
      id: COLLECTIONS.analytics,
      name: "Website Analytics Events",
      documentSecurity: false,
      permissions: [],
      attributes: [
        { key: "eventType", type: "string", size: 50, required: true },
        { key: "path", type: "string", size: 300, required: true },
        { key: "referrer", type: "string", size: 500, required: false },
        { key: "source", type: "string", size: 100, required: false },
        { key: "utmSource", type: "string", size: 100, required: false },
        { key: "utmMedium", type: "string", size: 100, required: false },
        { key: "utmCampaign", type: "string", size: 100, required: false },
        { key: "utmTerm", type: "string", size: 100, required: false },
        { key: "utmContent", type: "string", size: 100, required: false },
        { key: "sessionId", type: "string", size: 100, required: true },
        { key: "visitorId", type: "string", size: 100, required: true },
        { key: "deviceType", type: "string", size: 50, required: false },
        { key: "browser", type: "string", size: 100, required: false },
        { key: "target", type: "string", size: 150, required: false },
        { key: "metadata", type: "string", size: 5000, required: false },
        { key: "timestamp", type: "string", size: 50, required: true },
      ],
      indexes: [
        { key: "idx_timestamp", type: "key", attributes: ["timestamp"], orders: ["DESC"] },
        { key: "idx_eventType", type: "key", attributes: ["eventType"] },
      ],
    },
    {
      id: COLLECTIONS.blogs,
      name: "Blog Stories",
      // SECURITY MANDATE 4: No collection-level public read. documentSecurity = true ensures
      // that drafts are strictly admin-only and only published documents get public read!
      documentSecurity: true,
      permissions: [],
      attributes: [
        { key: "title", type: "string", size: 255, required: true },
        { key: "slug", type: "string", size: 255, required: true },
        { key: "excerpt", type: "string", size: 1500, required: false },
        { key: "content", type: "string", size: 100000, required: true },
        { key: "coverImage", type: "string", size: 500, required: true },
        { key: "heroImage", type: "string", size: 500, required: false },
        { key: "contentImages", type: "string", size: 500, required: false, isArray: true },
        { key: "shapeCarousels", type: "string", size: 20000, required: false },
        { key: "galleryCarousel", type: "string", size: 20000, required: false },
        { key: "category", type: "string", size: 100, required: true },
        { key: "author", type: "string", size: 100, required: true },
        { key: "readingTime", type: "string", size: 50, required: true },
        { key: "featured", type: "boolean", required: false, default: false },
        { key: "tags", type: "string", size: 100, required: false, isArray: true },
        { key: "status", type: "string", size: 50, required: true, default: "draft" },
        { key: "publishedAt", type: "string", size: 50, required: false },
        { key: "createdAt", type: "string", size: 50, required: true },
        { key: "updatedAt", type: "string", size: 50, required: true },
      ],
      indexes: [
        { key: "idx_slug", type: "unique", attributes: ["slug"] },
        { key: "idx_status", type: "key", attributes: ["status"] },
        { key: "idx_category", type: "key", attributes: ["category"] },
        { key: "idx_createdAt", type: "key", attributes: ["createdAt"], orders: ["DESC"] },
      ],
    },
  ];

  for (const spec of websiteCollectionSpecs) {
    let collectionExists = false;
    try {
      await databases.getCollection(TARGET_DB_ID, spec.id);
      collectionExists = true;
      dryRunReport.existingWebsiteCollections.push(spec.id);
      console.log(`• Collection '${spec.name}' (${spec.id}): ALREADY EXISTS (Will be reused)`);
    } catch (e) {
      dryRunReport.proposedNewCollections.push({
        id: spec.id,
        name: spec.name,
        documentSecurity: spec.documentSecurity,
        permissions: spec.permissions,
      });
      console.log(
        `• Collection '${spec.name}' (${spec.id}): MISSING / UNINITIALIZED -> [DRY-RUN PROPOSED: Create Collection]`
      );
      if (spec.id === COLLECTIONS.blogs) {
        console.log(`    ↳ Document-level security: ENABLED (Drafts restricted, published public)`);
      }
    }

    // Inspect attributes
    for (const attr of spec.attributes) {
      let attrExists = false;
      if (collectionExists) {
        try {
          await databases.getAttribute(TARGET_DB_ID, spec.id, attr.key);
          attrExists = true;
        } catch (e) {}
      }
      if (!attrExists) {
        dryRunReport.proposedAttributes.push({ collection: spec.id, ...attr });
        console.log(`    + Proposed Attribute: ${spec.id}.${attr.key} (${attr.type}, required: ${attr.required})`);
      }
    }

    // Inspect indexes
    for (const idx of spec.indexes) {
      let idxExists = false;
      if (collectionExists) {
        try {
          await databases.getIndex(TARGET_DB_ID, spec.id, idx.key);
          idxExists = true;
        } catch (e) {}
      }
      if (!idxExists) {
        dryRunReport.proposedIndexes.push({ collection: spec.id, ...idx });
        console.log(`    + Proposed Index: ${spec.id}.${idx.key} (${idx.type} on [${idx.attributes.join(", ")}])`);
      }
    }
  }
  console.log("");

  // 4. Storage Bucket Inspection
  console.log("--- 4. Storage Bucket Inspection ---");
  try {
    const bucket = await storage.getBucket(BUCKET_ID);
    dryRunReport.storageBucketAction = "REUSE";
    console.log(`✓ Bucket '${BUCKET_ID}' ALREADY EXISTS (Will be reused): Name: "${bucket.name}"`);
  } catch (e) {
    if (e.code === 404) {
      dryRunReport.storageBucketAction = "CREATE";
      console.log(`• Bucket '${BUCKET_ID}': MISSING -> [DRY-RUN PROPOSED: Create Bucket]`);
      console.log(`    ↳ Bucket Name: "AHVI Media & Blog Assets"`);
      console.log(`    ↳ Permissions: [Permission.read(Role.any())] (Public view only, writes admin-only)`);
      console.log(`    ↳ Max File Size: 8MB`);
      console.log(`    ↳ Allowed Extensions: jpg, jpeg, png, webp`);
    } else {
      console.log(`• Bucket notice: ${e.message}`);
    }
  }
  console.log("");

  // 5. Blog Stories Inspection from data/blogs.json
  console.log("--- 5. Blog Stories Migration Inspection ---");
  const blogsPath = path.join(process.cwd(), "data", "blogs.json");
  if (fs.existsSync(blogsPath)) {
    const localBlogs = JSON.parse(fs.readFileSync(blogsPath, "utf8"));
    dryRunReport.blogsChecked = localBlogs.length;
    console.log(`Inspecting ${localBlogs.length} articles in data/blogs.json...`);

    let existingInDb = 0;
    let proposedForImport = 0;

    for (const blog of localBlogs) {
      let docExists = false;
      try {
        const queryRes = await databases.listDocuments(TARGET_DB_ID, COLLECTIONS.blogs, [
          Query.equal("slug", blog.slug),
          Query.limit(1),
        ]);
        if (queryRes.total > 0) docExists = true;
      } catch (e) {
        // Collection might not exist yet in dry run
      }

      if (docExists) {
        existingInDb++;
      } else {
        proposedForImport++;
      }
    }

    dryRunReport.blogsAlreadyPresent = existingInDb;
    dryRunReport.blogsProposedForImport = proposedForImport;
    console.log(`• Articles already present in database: ${existingInDb}`);
    console.log(`• Articles proposed for import:        ${proposedForImport}`);
    console.log(`• Duplicate slug protection:           ACTIVE (Zero duplicates will be created)\n`);
  }

  // 6. Execution Summary
  console.log("================================================================================");
  console.log("  DRY-RUN SUMMARY (NO WRITES WERE EXECUTED)                                     ");
  console.log("================================================================================");
  console.log(`• Database Verified:                ${dryRunReport.database?.name} (${TARGET_DB_ID})`);
  console.log(`• Mobile Collections Guarded:       ${dryRunReport.mobileCollectionsConfirmedUntouched.length} (ALL UNTOUCHED)`);
  console.log(`• Existing Website Collections:     ${dryRunReport.existingWebsiteCollections.length}`);
  console.log(`• Proposed New Collections:         ${dryRunReport.proposedNewCollections.length} (${dryRunReport.proposedNewCollections.map((c) => c.id).join(", ")})`);
  console.log(`• Proposed New Attributes:          ${dryRunReport.proposedAttributes.length}`);
  console.log(`• Proposed New Indexes:             ${dryRunReport.proposedIndexes.length}`);
  console.log(`• Proposed Storage Bucket Action:   ${dryRunReport.storageBucketAction || "CREATE"} (${BUCKET_ID})`);
  console.log(`• Blog Articles to Import:          ${dryRunReport.blogsProposedForImport} (of ${dryRunReport.blogsChecked} total)`);
  console.log("================================================================================");

  if (isDryRun) {
    console.log("\n[DRY-RUN COMPLETE] Zero changes were made to your Appwrite Cloud project.");
    console.log("To apply these changes after approval, run: node scripts/setup-appwrite.js --apply\n");
    return;
  }

  // EXECUTION PATH (--apply) ONLY RUNS WHEN EXPLICITLY CALLED
  console.log("\n--- EXECUTING APPROVED CHANGES ---");

  // 1. Create missing collections
  for (const col of dryRunReport.proposedNewCollections) {
    console.log(`+ Creating collection '${col.name}' (${col.id})...`);
    await databases.createCollection(
      TARGET_DB_ID,
      col.id,
      col.name,
      col.permissions,
      col.documentSecurity
    );
    await sleep(1000);
  }

  // 2. Create missing attributes
  for (const attr of dryRunReport.proposedAttributes) {
    console.log(`  + Creating attribute ${attr.collection}.${attr.key}...`);
    if (attr.type === "email") {
      await databases.createEmailAttribute(TARGET_DB_ID, attr.collection, attr.key, attr.required);
    } else if (attr.type === "boolean") {
      await databases.createBooleanAttribute(
        TARGET_DB_ID,
        attr.collection,
        attr.key,
        attr.required,
        attr.default
      );
    } else if (attr.type === "string") {
      await databases.createStringAttribute(
        TARGET_DB_ID,
        attr.collection,
        attr.key,
        attr.size,
        attr.required,
        attr.default,
        Boolean(attr.isArray)
      );
    }
    await sleep(800);
  }

  // 3. Create missing indexes
  for (const idx of dryRunReport.proposedIndexes) {
    console.log(`  + Creating index ${idx.collection}.${idx.key}...`);
    try {
      await databases.createIndex(
        TARGET_DB_ID,
        idx.collection,
        idx.key,
        idx.type,
        idx.attributes,
        idx.orders || []
      );
      await sleep(1000);
    } catch (err) {
      console.warn(`    ⚠️ Notice on index ${idx.key}: ${err.message}`);
    }
  }

  // 4. Create storage bucket if missing
  if (dryRunReport.storageBucketAction === "CREATE") {
    console.log(`+ Creating storage bucket '${BUCKET_ID}'...`);
    await storage.createBucket(
      BUCKET_ID,
      "AHVI Media & Blog Assets",
      [Permission.read(Role.any())],
      false,
      true,
      8 * 1024 * 1024,
      ["jpg", "jpeg", "png", "webp"]
    );
    await sleep(1000);
  }

  // 5. Migrate blogs (with unique slug checking and per-document security)
  if (dryRunReport.blogsProposedForImport > 0 && fs.existsSync(blogsPath)) {
    const localBlogs = JSON.parse(fs.readFileSync(blogsPath, "utf8"));
    console.log(`\nImporting ${dryRunReport.blogsProposedForImport} blog articles...`);
    await sleep(2000);

    for (const blog of localBlogs) {
      try {
        const existing = await databases.listDocuments(TARGET_DB_ID, COLLECTIONS.blogs, [
          Query.equal("slug", blog.slug),
          Query.limit(1),
        ]);
        if (existing.total > 0) continue;

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

        const docPermissions =
          blog.status === "published" ? [Permission.read(Role.any())] : [];
        await databases.createDocument(
          TARGET_DB_ID,
          COLLECTIONS.blogs,
          ID.unique(),
          payload,
          docPermissions
        );
        process.stdout.write(".");
      } catch (err) {
        console.error(`\nFailed to import '${blog.slug}': ${err.message}`);
      }
    }
    console.log("\n✓ Blog import complete.");
  }

  console.log("\n================================================================================");
  console.log("  🎉 Provisioning Complete! Zero Existing Data Was Overwritten or Modified.    ");
  console.log("================================================================================\n");
}

main().catch((err) => {
  console.error("\n❌ Fatal inspector error:", err.message);
  process.exit(1);
});
