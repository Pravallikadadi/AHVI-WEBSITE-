# AHVI — Appwrite Backend Setup & Architecture Guide

This guide provides the complete documentation for configuring Appwrite as the backend for the AHVI website, covering Database collections, Authentication, Storage, and automated migration.

---

## 🚀 Quick Automated Setup (Recommended)

An automated setup and migration script is included in the project: [`scripts/setup-appwrite.js`](file:///c:/Users/kavya/Downloads/AHVI-WEBSITE--main/AHVI-WEBSITE--main/scripts/setup-appwrite.js).

It automatically:
1. Connects to your Appwrite project via `node-appwrite`.
2. Creates the Database (`ahvi_db`).
3. Creates all 6 Collections (`contacts`, `waitlist`, `surveys`, `subscribers`, `analytics`, `blogs`) with exact attributes and types.
4. Creates the Storage Bucket (`ahvi_media`) for blog images and assets with 8MB size limit and allowed extensions (`jpg`, `jpeg`, `png`, `webp`).
5. Migrates all 30 existing articles from `data/blogs.json` into Appwrite.
6. Provisions the initial Admin account.

### How to Run:

1. Create a free account and project at [cloud.appwrite.io](https://cloud.appwrite.io).
2. Go to **Project Settings > API Keys > Create API Key** with the following scopes:
   - `databases.*`
   - `collections.*`
   - `documents.*`
   - `files.*`
   - `users.*`
3. Copy `.env.example` to `.env.local` and fill in:
   ```env
   APPWRITE_ENDPOINT=https://cloud.appwrite.io/v1
   APPWRITE_PROJECT_ID=your_project_id
   APPWRITE_API_KEY=your_secret_api_key
   ADMIN_EMAIL=admin@ahvi.com
   ADMIN_PASSWORD=your_secure_password
   ```
4. Run the setup command:
   ```bash
   npm run setup:appwrite
   ```

---

## 🛠 Manual Setup Reference & Collection Schemas

If you prefer to configure Appwrite manually via the Appwrite Web Console, follow the schema specifications below:

### 1. Database
- **Database Name**: `AHVI Database`
- **Database ID**: `ahvi_db`

---

### 2. Collections & Attributes

#### A. `contacts` (Contact Submissions)
- **Collection ID**: `contacts`
- **Permissions**: Admin / Server API Key only. (No public access)
- **Attributes**:
  | Attribute Key | Type   | Size/Format | Required | Default |
  | ------------- | ------ | ----------- | -------- | ------- |
  | `name`        | String | 100         | No       | —       |
  | `email`       | Email  | —           | Yes      | —       |
  | `subject`     | String | 200         | No       | —       |
  | `message`     | String | 5000        | Yes      | —       |
  | `status`      | String | 50          | No       | `new`   |
  | `createdAt`   | String | 50          | Yes      | —       |
- **Indexes**:
  - `idx_createdAt`: Type: `key`, Attribute: `createdAt`, Order: `DESC`

#### B. `waitlist` (Waitlist Entries)
- **Collection ID**: `waitlist`
- **Permissions**: Admin / Server API Key only.
- **Attributes**:
  | Attribute Key  | Type   | Size/Format | Required | Default   | Array |
  | -------------- | ------ | ----------- | -------- | --------- | ----- |
  | `name`         | String | 100         | Yes      | —         | No    |
  | `email`        | Email  | —           | Yes      | —         | No    |
  | `phone`        | String | 50          | No       | —         | No    |
  | `interests`    | String | 50          | No       | —         | Yes   |
  | `referralCode` | String | 50          | No       | —         | No    |
  | `status`       | String | 50          | No       | `pending` | No    |
  | `createdAt`    | String | 50          | Yes      | —         | No    |
- **Indexes**:
  - `idx_email`: Type: `key`, Attribute: `email`
  - `idx_createdAt`: Type: `key`, Attribute: `createdAt`, Order: `DESC`

#### C. `surveys` (Wardrobe Feedback)
- **Collection ID**: `surveys`
- **Permissions**: Admin / Server API Key only.
- **Attributes**:
  | Attribute Key | Type   | Size/Format | Required | Array |
  | ------------- | ------ | ----------- | -------- | ----- |
  | `want`        | String | 50          | Yes      | Yes   |
  | `challenge`   | String | 3000        | No       | No    |
  | `createdAt`   | String | 50          | Yes      | No    |

#### D. `subscribers` (Newsletter)
- **Collection ID**: `subscribers`
- **Permissions**: Admin / Server API Key only.
- **Attributes**:
  | Attribute Key | Type   | Size/Format | Required | Default        |
  | ------------- | ------ | ----------- | -------- | -------------- |
  | `email`       | Email  | —           | Yes      | —              |
  | `status`      | String | 50          | No       | `subscribed`   |
  | `createdAt`   | String | 50          | Yes      | —              |
- **Indexes**:
  - `idx_sub_email`: Type: `key`, Attribute: `email`

#### E. `analytics` (Privacy-Conscious Events)
- **Collection ID**: `analytics`
- **Permissions**: Admin / Server API Key only.
- **Attributes**:
  | Attribute Key | Type   | Size/Format | Required | Default   |
  | ------------- | ------ | ----------- | -------- | --------- |
  | `eventType`   | String | 50          | Yes      | —         |
  | `path`        | String | 300         | Yes      | —         |
  | `referrer`    | String | 500         | No       | —         |
  | `source`      | String | 100         | No       | `direct`  |
  | `utmSource`   | String | 100         | No       | —         |
  | `utmMedium`   | String | 100         | No       | —         |
  | `utmCampaign` | String | 100         | No       | —         |
  | `utmTerm`     | String | 100         | No       | —         |
  | `utmContent`  | String | 100         | No       | —         |
  | `sessionId`   | String | 100         | Yes      | —         |
  | `visitorId`   | String | 100         | Yes      | —         |
  | `deviceType`  | String | 50          | No       | `desktop` |
  | `browser`     | String | 100         | No       | `Other`   |
  | `target`      | String | 150         | No       | —         |
  | `metadata`    | String | 5000        | No       | `{}`      |
  | `timestamp`   | String | 50          | Yes      | —         |
- **Indexes**:
  - `idx_timestamp`: Type: `key`, Attribute: `timestamp`, Order: `DESC`
  - `idx_eventType`: Type: `key`, Attribute: `eventType`

#### F. `blogs` (Journal Stories)
- **Collection ID**: `blogs`
- **Permissions**:
  - **Read**: `Any` (`role:all` - allows public website readers to load published articles)
  - **Create / Update / Delete**: Admin / Server API Key only
- **Attributes**:
  | Attribute Key     | Type    | Size/Format | Required | Array |
  | ----------------- | ------- | ----------- | -------- | ----- |
  | `title`           | String  | 255         | Yes      | No    |
  | `slug`            | String  | 255         | Yes      | No    |
  | `excerpt`         | String  | 1500        | No       | No    |
  | `content`         | String  | 100000      | Yes      | No    |
  | `coverImage`      | String  | 500         | Yes      | No    |
  | `heroImage`       | String  | 500         | No       | No    |
  | `contentImages`   | String  | 500         | No       | Yes   |
  | `shapeCarousels`  | String  | 20000       | No       | No    |
  | `galleryCarousel` | String  | 20000       | No       | No    |
  | `category`        | String  | 100         | Yes      | No    |
  | `author`          | String  | 100         | Yes      | No    |
  | `readingTime`     | String  | 50          | Yes      | No    |
  | `featured`        | Boolean | —           | No       | No    |
  | `tags`            | String  | 100         | No       | Yes   |
  | `status`          | String  | 50          | Yes      | No    |
  | `publishedAt`     | String  | 50          | No       | No    |
  | `createdAt`       | String  | 50          | Yes      | No    |
  | `updatedAt`       | String  | 50          | Yes      | No    |
- **Indexes**:
  - `idx_slug`: Type: `unique`, Attribute: `slug`
  - `idx_status`: Type: `key`, Attribute: `status`
  - `idx_publishedAt`: Type: `key`, Attribute: `publishedAt`, Order: `DESC`

---

### 3. Storage Bucket: `ahvi_media`
- **Bucket ID**: `ahvi_media`
- **Bucket Name**: `AHVI Media & Blog Assets`
- **Permissions**:
  - **Read**: `Any` (`role:all` — allows images to display on the live site)
  - **Create / Update / Delete**: Admin / Server API Key only
- **Settings**:
  - Max File Size: `8 MB` (`8388608` bytes)
  - Allowed File Extensions: `jpg`, `jpeg`, `png`, `webp`
  - File Security: `Disabled` (so public direct URLs load quickly via CDN)
