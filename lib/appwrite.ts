import { Client, Databases, Storage, Users, Account, ID, Query } from "node-appwrite";

/**
 * Appwrite Server Configuration
 * Server-side calls only. Never expose API keys or secrets to the browser.
 */
export const APPWRITE_CONFIG = {
  endpoint: process.env.APPWRITE_ENDPOINT || "https://cloud.appwrite.io/v1",
  projectId: process.env.APPWRITE_PROJECT_ID || "",
  apiKey: process.env.APPWRITE_API_KEY || "",
  databaseId: process.env.APPWRITE_DATABASE_ID || "ahvi_db",
  collections: {
    contacts: process.env.APPWRITE_COLLECTION_CONTACTS || "contacts",
    waitlist: process.env.APPWRITE_COLLECTION_WAITLIST || "waitlist",
    surveys: process.env.APPWRITE_COLLECTION_SURVEYS || "surveys",
    subscribers: process.env.APPWRITE_COLLECTION_SUBSCRIBERS || "subscribers",
    analytics: process.env.APPWRITE_COLLECTION_ANALYTICS || "analytics",
    blogs: process.env.APPWRITE_COLLECTION_BLOGS || "blogs",
  },
  bucketId: process.env.APPWRITE_STORAGE_BUCKET_ID || "ahvi_media",
  adminEmail: process.env.ADMIN_EMAIL || "admin@ahvi.com",
};

/**
 * Check if required Appwrite credentials are provided
 */
export function isAppwriteConfigured(): boolean {
  return Boolean(
    APPWRITE_CONFIG.endpoint &&
    APPWRITE_CONFIG.projectId &&
    APPWRITE_CONFIG.apiKey
  );
}

/**
 * Create an admin Appwrite client with root API Key.
 * Used for database operations, storage, and administrative queries.
 */
export function createAdminClient() {
  if (!isAppwriteConfigured()) {
    throw new Error(
      "Appwrite credentials missing. Please set APPWRITE_ENDPOINT, APPWRITE_PROJECT_ID, and APPWRITE_API_KEY in your environment."
    );
  }

  const client = new Client()
    .setEndpoint(APPWRITE_CONFIG.endpoint)
    .setProject(APPWRITE_CONFIG.projectId)
    .setKey(APPWRITE_CONFIG.apiKey);

  return {
    client,
    databases: new Databases(client),
    storage: new Storage(client),
    users: new Users(client),
    account: new Account(client),
  };
}

/**
 * Create a session Appwrite client scoped to a user's session token.
 */
export function createSessionClient(sessionToken: string) {
  if (!APPWRITE_CONFIG.endpoint || !APPWRITE_CONFIG.projectId) {
    throw new Error("Appwrite endpoint or project ID missing.");
  }

  const client = new Client()
    .setEndpoint(APPWRITE_CONFIG.endpoint)
    .setProject(APPWRITE_CONFIG.projectId)
    .setSession(sessionToken);

  return {
    client,
    account: new Account(client),
    databases: new Databases(client),
    storage: new Storage(client),
  };
}

export { ID, Query };
