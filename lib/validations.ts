import { z } from "zod";

/**
 * Contact submission schema
 */
export const contactSubmissionSchema = z.object({
  name: z.string().trim().max(100).optional().default(""),
  email: z.string().trim().email("Please enter a valid email address"),
  subject: z.string().trim().max(200).optional().default(""),
  message: z.string().trim().min(5, "Message must be at least 5 characters").max(5000, "Message cannot exceed 5000 characters"),
  honeypot: z.string().max(0, "Bot detected").optional().default(""),
});

export type ContactSubmissionInput = z.infer<typeof contactSubmissionSchema>;

/**
 * Waitlist entry schema
 */
export const waitlistEntrySchema = z.object({
  name: z.string().trim().min(1, "Name is required").max(100),
  email: z.string().trim().email("Please enter a valid email address"),
  phone: z.string().trim().max(30).optional().default(""),
  interests: z.array(z.string()).optional().default([]),
  referralCode: z.string().trim().max(50).optional().default(""),
  honeypot: z.string().max(0, "Bot detected").optional().default(""),
});

export type WaitlistEntryInput = z.infer<typeof waitlistEntrySchema>;

/**
 * Survey response schema
 */
export const surveyResponseSchema = z.object({
  want: z.array(z.string()).min(1, "Please select at least one interest area"),
  challenge: z.string().trim().max(3000, "Challenge description too long").optional().default(""),
  honeypot: z.string().max(0, "Bot detected").optional().default(""),
});

export type SurveyResponseInput = z.infer<typeof surveyResponseSchema>;

/**
 * Newsletter subscription schema
 */
export const newsletterSchema = z.object({
  email: z.string().trim().email("Please enter a valid email address"),
  honeypot: z.string().max(0, "Bot detected").optional().default(""),
});

export type NewsletterInput = z.infer<typeof newsletterSchema>;

/**
 * Website analytics event schema
 */
export const analyticsEventSchema = z.object({
  eventType: z.enum(["pageview", "click", "form_start", "form_submit", "session_start"]),
  path: z.string().trim().max(500),
  referrer: z.string().trim().max(1000).optional().default(""),
  source: z.string().trim().max(100).optional().default("direct"),
  utmSource: z.string().trim().max(100).optional().default(""),
  utmMedium: z.string().trim().max(100).optional().default(""),
  utmCampaign: z.string().trim().max(100).optional().default(""),
  utmTerm: z.string().trim().max(100).optional().default(""),
  utmContent: z.string().trim().max(100).optional().default(""),
  sessionId: z.string().trim().max(100),
  visitorId: z.string().trim().max(100),
  deviceType: z.enum(["desktop", "mobile", "tablet", "other"]).optional().default("desktop"),
  browser: z.string().trim().max(100).optional().default("Other"),
  target: z.string().trim().max(200).optional().default(""),
  metadata: z.record(z.string(), z.any()).optional().default({}),
});

export type AnalyticsEventInput = z.infer<typeof analyticsEventSchema>;

/**
 * Admin login schema
 */
export const adminLoginSchema = z.object({
  email: z.string().trim().email().optional(),
  password: z.string().min(1, "Password is required"),
});

export type AdminLoginInput = z.infer<typeof adminLoginSchema>;

/**
 * Blog input schema
 */
export const blogInputSchema = z.object({
  title: z.string().trim().min(3, "Title must be at least 3 characters").max(200),
  slug: z.string().trim().max(200).optional(),
  excerpt: z.string().trim().max(1000).optional().default(""),
  content: z.string().trim().min(10, "Content must be at least 10 characters"),
  coverImage: z.string().trim().min(1, "Cover image is required"),
  heroImage: z.string().trim().optional(),
  contentImages: z.array(z.string()).optional().default([]),
  category: z.string().trim().min(1, "Category is required"),
  author: z.string().trim().default("AHVI Editorial"),
  readingTime: z.string().trim().default("4 min"),
  featured: z.boolean().default(false),
  tags: z.array(z.string()).default([]),
  status: z.enum(["draft", "published"]).default("draft"),
  shapeCarousels: z.any().optional(),
  galleryCarousel: z.any().optional(),
});
