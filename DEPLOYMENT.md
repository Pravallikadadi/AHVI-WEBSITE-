# AHVI — Deployment & Wix DNS Configuration Guide

This document outlines the deployment strategy for the AHVI Next.js application, including hosting on **Vercel** and domain pointing via **Wix DNS**.

---

## ⚠️ Important Note on Wix & Next.js

- **Wix Website Builder** is a proprietary visual CMS that does **not** support hosting arbitrary Node.js / Next.js SSR applications or backend API routes.
- The standard, recommended architecture is:
  1. **Host the Next.js application on Vercel** (or AWS Amplify / Cloudflare Pages / Railway / Node server) where all Appwrite API routes, server rendering, dynamic routing, and edge middleware run seamlessly.
  2. **Keep your custom domain on Wix** (or wherever you purchased it), using **Wix DNS Management** to point your domain to the Vercel deployment.

---

## Part 1: Deploying to Vercel

### Step 1: Push Code to GitHub / GitLab / Bitbucket
Ensure all project code is committed to your repository:
```bash
git add .
git commit -m "feat: complete Appwrite backend integration"
git push origin main
```

### Step 2: Import Project in Vercel
1. Log in to [vercel.com](https://vercel.com) and click **Add New... > Project**.
2. Select your repository and click **Import**.
3. Framework Preset will automatically detect **Next.js**.
4. Root Directory: `./` (default).

### Step 3: Configure Environment Variables in Vercel
Under **Environment Variables**, add the variables from your `.env.example`:

| Variable Name                  | Value (Example / Production)                                      |
| ------------------------------ | ----------------------------------------------------------------- |
| `APPWRITE_ENDPOINT`            | `https://cloud.appwrite.io/v1`                                    |
| `APPWRITE_PROJECT_ID`          | `your_appwrite_project_id`                                        |
| `APPWRITE_API_KEY`             | `your_appwrite_server_api_key`                                    |
| `APPWRITE_DATABASE_ID`         | `ahvi_db`                                                         |
| `APPWRITE_STORAGE_BUCKET_ID`   | `ahvi_media`                                                      |
| `APPWRITE_COLLECTION_CONTACTS` | `contacts`                                                        |
| `APPWRITE_COLLECTION_WAITLIST` | `waitlist`                                                        |
| `APPWRITE_COLLECTION_SURVEYS`  | `surveys`                                                         |
| `APPWRITE_COLLECTION_SUBSCRIBERS`| `subscribers`                                                   |
| `APPWRITE_COLLECTION_ANALYTICS`| `analytics`                                                       |
| `APPWRITE_COLLECTION_BLOGS`    | `blogs`                                                           |
| `ADMIN_EMAIL`                  | `admin@ahvi.com` (or your preferred admin email)                  |
| `ADMIN_PASSWORD`               | `your_secure_admin_password`                                      |
| `ADMIN_SESSION_SECRET`         | `a_random_32_character_string_for_signing_sessions`               |
| `NEXT_PUBLIC_APP_URL`          | `https://ahvi-website.vercel.app` (or your final custom domain)   |

Click **Deploy**. Vercel will build and launch your application.

---

## Part 2: Connecting Your Custom Domain from Wix

Once deployed on Vercel, attach your custom domain (e.g. `ahvi.com` or `ahvistyle.com`).

### Step 1: Add Custom Domain in Vercel
1. In your Vercel Project Dashboard, navigate to **Settings > Domains**.
2. Enter your domain (e.g., `ahvi.com` and `www.ahvi.com`) and click **Add**.
3. Vercel will display the required DNS records.

### Step 2: Configure DNS Records in Wix
1. Log in to your [Wix Account](https://www.wix.com) and go to the **Domains** page under your account settings.
2. Click the **More Actions** (•••) icon next to your relevant domain and select **Manage DNS Records**.
3. Add or update the following DNS records:

#### 1. Apex / Root Domain (`ahvi.com` or `@`)
- **Type**: `A`
- **Host Name / Name**: `@` (or leave blank depending on Wix interface)
- **Value / Points to**: `76.76.21.21`
- **TTL**: `1 Hour` (or default 3600)

#### 2. Subdomain (`www.ahvi.com`)
- **Type**: `CNAME`
- **Host Name / Name**: `www`
- **Value / Points to**: `cname.vercel-dns.com`
- **TTL**: `1 Hour` (or default 3600)

*(Note: Delete any existing conflicting A or CNAME records on `@` or `www` that previously pointed to Wix servers).*

---

## Part 3: Verification & SSL

1. Return to **Vercel Settings > Domains**.
2. Click **Refresh** next to your domain.
3. Once DNS propagates (usually 5–30 minutes, up to 24–48 hours in rare cases), Vercel will:
   - Mark the domain with a green checkmark `Valid Configuration`.
   - Automatically issue and renew a free Let's Encrypt SSL/TLS Certificate.
4. Your website is now live on your custom domain with secure HTTPS and full backend functionality!
