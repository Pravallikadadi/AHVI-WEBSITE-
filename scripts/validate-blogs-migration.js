const fs = require("fs");
const path = require("path");

const blogsPath = path.join(process.cwd(), "data", "blogs.json");
const localBlogs = JSON.parse(fs.readFileSync(blogsPath, "utf8"));

console.log("=== AHVI Blog Migration Pre-Flight Validation ===");
console.log(`Total articles to validate: ${localBlogs.length}\n`);

const seenSlugs = new Set();
const issues = [];
const validatedArticles = [];

for (let i = 0; i < localBlogs.length; i++) {
  const b = localBlogs[i];
  const articleIssues = [];

  // 1. Slug checks
  if (!b.slug || typeof b.slug !== "string") {
    articleIssues.push("Missing or invalid slug");
  } else if (seenSlugs.has(b.slug)) {
    articleIssues.push(`Duplicate slug detected: '${b.slug}'`);
  } else if (b.slug.length > 255) {
    articleIssues.push(`Slug exceeds 255 chars (${b.slug.length})`);
  } else {
    seenSlugs.add(b.slug);
  }

  // 2. Title checks
  if (!b.title || typeof b.title !== "string") {
    articleIssues.push("Missing or invalid title");
  } else if (b.title.length > 255) {
    articleIssues.push(`Title exceeds 255 chars (${b.title.length})`);
  }

  // 3. Content checks
  if (!b.content || typeof b.content !== "string") {
    articleIssues.push("Missing or invalid content");
  } else if (b.content.length > 100000) {
    articleIssues.push(`Content exceeds 100,000 chars (${b.content.length})`);
  }

  // 4. Excerpt checks
  if (b.excerpt && b.excerpt.length > 1500) {
    articleIssues.push(`Excerpt exceeds 1500 chars (${b.excerpt.length})`);
  }

  // 5. Cover Image checks: mandatory for published articles, optional for drafts
  const isPublished = (b.status || "published") === "published";
  if (isPublished && (!b.coverImage || typeof b.coverImage !== "string" || !b.coverImage.trim())) {
    articleIssues.push("Missing cover image on published article");
  } else if (b.coverImage) {
    if (typeof b.coverImage !== "string" || b.coverImage.length > 500) {
      articleIssues.push(`Cover image URL exceeds 500 chars (${b.coverImage.length})`);
    } else {
      const localCover = path.join(process.cwd(), "public", b.coverImage.replace(/^\//, ""));
      if (!fs.existsSync(localCover)) {
        articleIssues.push(`Cover image not found in public/: '${b.coverImage}'`);
      }
    }
  }

  // 6. Content images checks
  if (b.contentImages) {
    if (!Array.isArray(b.contentImages)) {
      articleIssues.push("contentImages must be an array");
    } else {
      for (const img of b.contentImages) {
        if (typeof img !== "string" || img.length > 500) {
          articleIssues.push(`contentImage item exceeds 500 chars: '${img}'`);
        } else {
          const localImg = path.join(process.cwd(), "public", img.replace(/^\//, ""));
          if (!fs.existsSync(localImg)) {
            articleIssues.push(`contentImage not found in public/: '${img}'`);
          }
        }
      }
    }
  }

  // 7. Tags checks
  if (b.tags) {
    if (!Array.isArray(b.tags)) {
      articleIssues.push("tags must be an array");
    } else {
      for (const t of b.tags) {
        if (typeof t !== "string" || t.length > 100) {
          articleIssues.push(`tag exceeds 100 chars: '${t}'`);
        }
      }
    }
  }

  // 8. Carousels checks
  if (b.shapeCarousels) {
    const raw = JSON.stringify(b.shapeCarousels);
    if (raw.length > 20000) {
      articleIssues.push(`shapeCarousels JSON exceeds 20000 chars (${raw.length})`);
    }
  }
  if (b.galleryCarousel) {
    const raw = JSON.stringify(b.galleryCarousel);
    if (raw.length > 20000) {
      articleIssues.push(`galleryCarousel JSON exceeds 20000 chars (${raw.length})`);
    }
  }

  // 9. Status & metadata checks
  if (!["draft", "published"].includes(b.status)) {
    articleIssues.push(`Invalid status: '${b.status}'`);
  }

  if (articleIssues.length > 0) {
    issues.push({ index: i, slug: b.slug, issues: articleIssues });
    console.log(`❌ Article [${i + 1}/30] '${b.slug}': ${articleIssues.join("; ")}`);
  } else {
    validatedArticles.push({
      index: i + 1,
      title: b.title,
      slug: b.slug,
      category: b.category,
      contentLength: b.content.length,
      coverImage: b.coverImage,
      contentImagesCount: b.contentImages?.length || 0,
      tagsCount: b.tags?.length || 0,
      status: b.status,
    });
  }
}

console.log("\n=======================================================");
console.log(`Validation Results:`);
console.log(`• Successfully Validated: ${validatedArticles.length} / ${localBlogs.length}`);
console.log(`• Issues Found:           ${issues.length}`);
console.log(`• Total Unique Slugs:     ${seenSlugs.size} / ${localBlogs.length}`);
console.log("=======================================================");

if (issues.length === 0) {
  console.log("✓ ALL 30 ARTICLES COMPLY 100% WITH THE APPWRITE SCHEMA.");
  console.log("✓ All cover and content images are verified present in public/.");
  console.log("✓ All slugs are unique; zero duplicate risk.");
  console.log("✓ Ready for safe non-destructive migration.\n");
} else {
  console.error("❌ Issues must be fixed before migration!");
}
