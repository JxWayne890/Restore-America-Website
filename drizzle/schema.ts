import {
  int,
  mysqlEnum,
  mysqlTable,
  text,
  timestamp,
  varchar,
  boolean,
  decimal,
  json,
} from "drizzle-orm/mysql-core";

/**
 * Core user table backing auth flow.
 * Extend this file with additional tables as your product grows.
 * Columns use camelCase to match both database fields and generated types.
 */
export const users = mysqlTable("users", {
  /**
   * Surrogate primary key. Auto-incremented numeric value managed by the database.
   * Use this for relations between tables.
   */
  id: int("id").autoincrement().primaryKey(),
  /** Manus OAuth identifier (openId) returned from the OAuth callback. Unique per user. */
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

// ============================================================
// LEADS — core CRM record
// ============================================================
export const leads = mysqlTable("leads", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  phone: varchar("phone", { length: 30 }).notNull(),
  email: varchar("email", { length: 320 }),
  address: text("address"),
  city: varchar("city", { length: 100 }),
  state: varchar("state", { length: 50 }),
  zip: varchar("zip", { length: 20 }),
  damageType: mysqlEnum("damageType", ["hail", "wind", "fire", "flood", "tree", "roof", "other"]).notNull(),
  isOwner: boolean("isOwner").default(true),
  claimStatus: mysqlEnum("claimStatus", ["not_filed", "open", "denied", "paid"]).default("not_filed"),
  insuranceCompany: varchar("insuranceCompany", { length: 255 }),
  estimatedValue: decimal("estimatedValue", { precision: 10, scale: 2 }),
  notes: text("notes"),
  stage: mysqlEnum("stage", [
    "new",
    "contacted",
    "inspection_scheduled",
    "inspection_done",
    "estimate_sent",
    "claim_filed",
    "approved",
    "in_progress",
    "completed",
    "lost",
  ]).default("new").notNull(),
  source: mysqlEnum("source", ["website", "facebook", "google", "referral", "storm_canvass", "other"]).default("website"),
  utmSource: varchar("utmSource", { length: 100 }),
  utmMedium: varchar("utmMedium", { length: 100 }),
  utmCampaign: varchar("utmCampaign", { length: 100 }),
  assignedTo: varchar("assignedTo", { length: 255 }),
  isHot: boolean("isHot").default(false),
  isArchived: boolean("isArchived").default(false),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastContactedAt: timestamp("lastContactedAt"),
  closedAt: timestamp("closedAt"),
});

export type Lead = typeof leads.$inferSelect;
export type InsertLead = typeof leads.$inferInsert;

// ============================================================
// LEAD ACTIVITIES — timeline of all touchpoints
// ============================================================
export const leadActivities = mysqlTable("lead_activities", {
  id: int("id").autoincrement().primaryKey(),
  leadId: int("leadId").notNull(),
  type: mysqlEnum("type", ["note", "call", "sms", "email", "stage_change", "inspection", "estimate", "system"]).notNull(),
  content: text("content").notNull(),
  createdBy: varchar("createdBy", { length: 255 }).default("system"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type LeadActivity = typeof leadActivities.$inferSelect;
export type InsertLeadActivity = typeof leadActivities.$inferInsert;

// ============================================================
// APPOINTMENTS — inspection / job scheduling
// ============================================================
export const appointments = mysqlTable("appointments", {
  id: int("id").autoincrement().primaryKey(),
  leadId: int("leadId").notNull(),
  title: varchar("title", { length: 255 }).notNull(),
  type: mysqlEnum("type", ["inspection", "estimate", "job_start", "follow_up"]).default("inspection"),
  status: mysqlEnum("status", ["scheduled", "confirmed", "completed", "cancelled", "no_show"]).default("scheduled"),
  scheduledAt: timestamp("scheduledAt").notNull(),
  durationMinutes: int("durationMinutes").default(60),
  address: text("address"),
  assignedTo: varchar("assignedTo", { length: 255 }),
  notes: text("notes"),
  reminderSent: boolean("reminderSent").default(false),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Appointment = typeof appointments.$inferSelect;
export type InsertAppointment = typeof appointments.$inferInsert;

// ============================================================
// AUTOMATION SEQUENCES — drip campaigns
// ============================================================
export const automationSequences = mysqlTable("automation_sequences", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  trigger: mysqlEnum("trigger", ["new_lead", "inspection_scheduled", "estimate_sent", "claim_denied", "no_response_3d", "no_response_7d"]).notNull(),
  isActive: boolean("isActive").default(true),
  steps: json("steps").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type AutomationSequence = typeof automationSequences.$inferSelect;

// ============================================================
// AUTOMATION ENROLLMENTS
// ============================================================
export const automationEnrollments = mysqlTable("automation_enrollments", {
  id: int("id").autoincrement().primaryKey(),
  leadId: int("leadId").notNull(),
  sequenceId: int("sequenceId").notNull(),
  currentStep: int("currentStep").default(0),
  status: mysqlEnum("status", ["active", "completed", "paused", "cancelled"]).default("active"),
  nextRunAt: timestamp("nextRunAt"),
  enrolledAt: timestamp("enrolledAt").defaultNow().notNull(),
  completedAt: timestamp("completedAt"),
});

export type AutomationEnrollment = typeof automationEnrollments.$inferSelect;

// ============================================================
// STORM ALERTS — emergency broadcast system
// ============================================================
export const stormAlerts = mysqlTable("storm_alerts", {
  id: int("id").autoincrement().primaryKey(),
  title: varchar("title", { length: 255 }).notNull(),
  message: text("message").notNull(),
  affectedAreas: text("affectedAreas").notNull(),
  severity: mysqlEnum("severity", ["watch", "warning", "emergency"]).default("warning"),
  isActive: boolean("isActive").default(false),
  activatedAt: timestamp("activatedAt"),
  deactivatedAt: timestamp("deactivatedAt"),
  createdBy: varchar("createdBy", { length: 255 }),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type StormAlert = typeof stormAlerts.$inferSelect;
export type InsertStormAlert = typeof stormAlerts.$inferInsert;

// ============================================================
// REVIEWS
// ============================================================
export const reviews = mysqlTable("reviews", {
  id: int("id").autoincrement().primaryKey(),
  platform: mysqlEnum("platform", ["google", "facebook", "other"]).default("google"),
  reviewerName: varchar("reviewerName", { length: 255 }).notNull(),
  rating: int("rating").notNull(),
  content: text("content"),
  reviewDate: timestamp("reviewDate"),
  isFeatured: boolean("isFeatured").default(false),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type Review = typeof reviews.$inferSelect;
export type InsertReview = typeof reviews.$inferInsert;

// ============================================================
// CHAT SESSIONS & MESSAGES — AI chat widget
// ============================================================
export const chatSessions = mysqlTable("chat_sessions", {
  id: int("id").autoincrement().primaryKey(),
  sessionId: varchar("sessionId", { length: 64 }).notNull().unique(),
  visitorName: varchar("visitorName", { length: 255 }),
  visitorPhone: varchar("visitorPhone", { length: 30 }),
  visitorEmail: varchar("visitorEmail", { length: 320 }),
  leadId: int("leadId"),
  status: mysqlEnum("status", ["active", "converted", "closed"]).default("active"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export const chatMessages = mysqlTable("chat_messages", {
  id: int("id").autoincrement().primaryKey(),
  sessionId: varchar("sessionId", { length: 64 }).notNull(),
  role: mysqlEnum("role", ["user", "assistant"]).notNull(),
  content: text("content").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type ChatSession = typeof chatSessions.$inferSelect;
export type ChatMessage = typeof chatMessages.$inferSelect;