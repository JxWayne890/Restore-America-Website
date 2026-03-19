import { eq, desc, and, or, like, sql } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import {
  InsertUser,
  users,
  leads,
  leadActivities,
  appointments,
  stormAlerts,
  reviews,
  chatSessions,
  chatMessages,
  automationSequences,
  automationEnrollments,
  InsertLead,
  InsertLeadActivity,
  InsertAppointment,
  InsertStormAlert,
  InsertReview,
} from "../drizzle/schema";
import { ENV } from "./_core/env";

let _db: ReturnType<typeof drizzle> | null = null;

// Lazily create the drizzle instance so local tooling can run without a DB.
export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) {
    throw new Error("User openId is required for upsert");
  }

  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }

  try {
    const values: InsertUser = {
      openId: user.openId,
    };
    const updateSet: Record<string, unknown> = {};

    const textFields = ["name", "email", "loginMethod"] as const;
    type TextField = (typeof textFields)[number];

    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };

    textFields.forEach(assignNullable);

    if (user.lastSignedIn !== undefined) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role !== undefined) {
      values.role = user.role;
      updateSet.role = user.role;
    } else if (user.openId === ENV.ownerOpenId) {
      values.role = 'admin';
      updateSet.role = 'admin';
    }

    if (!values.lastSignedIn) {
      values.lastSignedIn = new Date();
    }

    if (Object.keys(updateSet).length === 0) {
      updateSet.lastSignedIn = new Date();
    }

    await db.insert(users).values(values).onDuplicateKeyUpdate({
      set: updateSet,
    });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }

  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);

  return result.length > 0 ? result[0] : undefined;
}

// ============================================================
// LEADS
// ============================================================
export async function createLead(data: InsertLead) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const result = await db.insert(leads).values(data);
  const insertId = (result as any)[0]?.insertId ?? 0;
  const created = await db.select().from(leads).where(eq(leads.id, insertId)).limit(1);
  return created[0];
}

export async function getLeads(filters?: {
  stage?: string;
  damageType?: string;
  isArchived?: boolean;
  search?: string;
  limit?: number;
  offset?: number;
}) {
  const db = await getDb();
  if (!db) return [];
  const conditions: any[] = [];
  if (filters?.stage) conditions.push(eq(leads.stage, filters.stage as any));
  if (filters?.damageType) conditions.push(eq(leads.damageType, filters.damageType as any));
  if (filters?.isArchived !== undefined) conditions.push(eq(leads.isArchived, filters.isArchived));
  if (filters?.search) {
    conditions.push(
      or(
        like(leads.name, `%${filters.search}%`),
        like(leads.phone, `%${filters.search}%`),
        like(leads.email, `%${filters.search}%`)
      )
    );
  }
  return db
    .select()
    .from(leads)
    .where(conditions.length > 0 ? and(...conditions) : undefined)
    .orderBy(desc(leads.createdAt))
    .limit(filters?.limit ?? 50)
    .offset(filters?.offset ?? 0);
}

export async function getLeadById(id: number) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(leads).where(eq(leads.id, id)).limit(1);
  return result[0];
}

export async function updateLead(id: number, data: Partial<InsertLead>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.update(leads).set(data).where(eq(leads.id, id));
  return getLeadById(id);
}

export async function getLeadStats() {
  const db = await getDb();
  if (!db) return null;
  const total = await db.select({ count: sql<number>`count(*)` }).from(leads);
  const byStage = await db
    .select({ stage: leads.stage, count: sql<number>`count(*)` })
    .from(leads)
    .groupBy(leads.stage);
  const byDamage = await db
    .select({ damageType: leads.damageType, count: sql<number>`count(*)` })
    .from(leads)
    .groupBy(leads.damageType);
  const thisMonth = await db
    .select({ count: sql<number>`count(*)` })
    .from(leads)
    .where(sql`createdAt >= DATE_SUB(NOW(), INTERVAL 30 DAY)`);
  const hotLeads = await db
    .select({ count: sql<number>`count(*)` })
    .from(leads)
    .where(eq(leads.isHot, true));
  return {
    total: total[0]?.count ?? 0,
    byStage,
    byDamage,
    thisMonth: thisMonth[0]?.count ?? 0,
    hotLeads: hotLeads[0]?.count ?? 0,
  };
}

// ============================================================
// LEAD ACTIVITIES
// ============================================================
export async function addLeadActivity(data: InsertLeadActivity) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.insert(leadActivities).values(data);
}

export async function getLeadActivities(leadId: number) {
  const db = await getDb();
  if (!db) return [];
  return db
    .select()
    .from(leadActivities)
    .where(eq(leadActivities.leadId, leadId))
    .orderBy(desc(leadActivities.createdAt));
}

// ============================================================
// APPOINTMENTS
// ============================================================
export async function createAppointment(data: InsertAppointment) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const result = await db.insert(appointments).values(data);
  const insertId = (result as any)[0]?.insertId ?? 0;
  const created = await db.select().from(appointments).where(eq(appointments.id, insertId)).limit(1);
  return created[0];
}

export async function getAppointments(leadId?: number) {
  const db = await getDb();
  if (!db) return [];
  if (leadId) {
    return db.select().from(appointments).where(eq(appointments.leadId, leadId)).orderBy(appointments.scheduledAt);
  }
  return db.select().from(appointments).orderBy(appointments.scheduledAt);
}

export async function updateAppointment(id: number, data: Partial<InsertAppointment>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.update(appointments).set(data).where(eq(appointments.id, id));
}

// ============================================================
// STORM ALERTS
// ============================================================
export async function getActiveStormAlert() {
  const db = await getDb();
  if (!db) return null;
  const result = await db
    .select()
    .from(stormAlerts)
    .where(eq(stormAlerts.isActive, true))
    .orderBy(desc(stormAlerts.createdAt))
    .limit(1);
  return result[0] ?? null;
}

export async function getAllStormAlerts() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(stormAlerts).orderBy(desc(stormAlerts.createdAt));
}

export async function createStormAlert(data: InsertStormAlert) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.update(stormAlerts).set({ isActive: false, deactivatedAt: new Date() }).where(eq(stormAlerts.isActive, true));
  const result = await db.insert(stormAlerts).values({ ...data, isActive: true, activatedAt: new Date() });
  const insertId = (result as any)[0]?.insertId ?? 0;
  const created = await db.select().from(stormAlerts).where(eq(stormAlerts.id, insertId)).limit(1);
  return created[0];
}

export async function deactivateStormAlert(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.update(stormAlerts).set({ isActive: false, deactivatedAt: new Date() }).where(eq(stormAlerts.id, id));
}

// ============================================================
// REVIEWS
// ============================================================
export async function getFeaturedReviews() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(reviews).where(eq(reviews.isFeatured, true)).orderBy(desc(reviews.reviewDate)).limit(12);
}

export async function getAllReviews() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(reviews).orderBy(desc(reviews.reviewDate));
}

export async function upsertReview(data: InsertReview) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.insert(reviews).values(data);
}

// ============================================================
// CHAT SESSIONS & MESSAGES
// ============================================================
export async function getOrCreateChatSession(sessionId: string) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const existing = await db.select().from(chatSessions).where(eq(chatSessions.sessionId, sessionId)).limit(1);
  if (existing[0]) return existing[0];
  await db.insert(chatSessions).values({ sessionId });
  const created = await db.select().from(chatSessions).where(eq(chatSessions.sessionId, sessionId)).limit(1);
  return created[0]!;
}

export async function getChatHistory(sessionId: string) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(chatMessages).where(eq(chatMessages.sessionId, sessionId)).orderBy(chatMessages.createdAt).limit(50);
}

export async function saveChatMessage(sessionId: string, role: "user" | "assistant", content: string) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.insert(chatMessages).values({ sessionId, role, content });
}

export async function updateChatSession(sessionId: string, data: { visitorName?: string; visitorPhone?: string; visitorEmail?: string; leadId?: number; status?: "active" | "converted" | "closed" }) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.update(chatSessions).set(data).where(eq(chatSessions.sessionId, sessionId));
}

// ============================================================
// AUTOMATION SEQUENCES
// ============================================================
export async function getActiveSequences() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(automationSequences).where(eq(automationSequences.isActive, true));
}

export async function enrollLeadInSequence(leadId: number, sequenceId: number, nextRunAt: Date) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.insert(automationEnrollments).values({ leadId, sequenceId, nextRunAt });
}
