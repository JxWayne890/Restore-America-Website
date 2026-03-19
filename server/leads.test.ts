import { describe, expect, it, vi, beforeEach } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

// Mock the db module
vi.mock("./db", () => ({
  createLead: vi.fn().mockResolvedValue({ id: 1, name: "John Test", phone: "7705551234" }),
  getLeads: vi.fn().mockResolvedValue([]),
  getLeadById: vi.fn().mockResolvedValue(null),
  updateLead: vi.fn().mockResolvedValue(undefined),
  getLeadStats: vi.fn().mockResolvedValue({ total: 0, byStage: [], byDamage: [], thisMonth: 0, hotLeads: 0 }),
  addLeadActivity: vi.fn().mockResolvedValue(undefined),
  getLeadActivities: vi.fn().mockResolvedValue([]),
  createAppointment: vi.fn().mockResolvedValue({ id: 1 }),
  getAppointments: vi.fn().mockResolvedValue([]),
  updateAppointment: vi.fn().mockResolvedValue(undefined),
  getActiveStormAlert: vi.fn().mockResolvedValue(null),
  getAllStormAlerts: vi.fn().mockResolvedValue([]),
  createStormAlert: vi.fn().mockResolvedValue({ id: 1 }),
  deactivateStormAlert: vi.fn().mockResolvedValue(undefined),
  getFeaturedReviews: vi.fn().mockResolvedValue([]),
  getAllReviews: vi.fn().mockResolvedValue([]),
  upsertReview: vi.fn().mockResolvedValue(undefined),
  getOrCreateChatSession: vi.fn().mockResolvedValue({ id: "sess1" }),
  getChatHistory: vi.fn().mockResolvedValue([]),
  saveChatMessage: vi.fn().mockResolvedValue(undefined),
  updateChatSession: vi.fn().mockResolvedValue(undefined),
}));

// Mock notifications
vi.mock("./_core/notification", () => ({
  notifyOwner: vi.fn().mockResolvedValue(true),
}));

// Mock LLM
vi.mock("./_core/llm", () => ({
  invokeLLM: vi.fn().mockResolvedValue({
    choices: [{ message: { content: "Hello! How can I help you today?" } }],
  }),
}));

function createPublicContext(): TrpcContext {
  return {
    user: null,
    req: { protocol: "https", headers: {} } as TrpcContext["req"],
    res: { clearCookie: vi.fn() } as unknown as TrpcContext["res"],
  };
}

function createAdminContext(): TrpcContext {
  return {
    user: {
      id: 1,
      openId: "admin-user",
      email: "admin@restoreamerica.com",
      name: "Admin User",
      loginMethod: "manus",
      role: "admin",
      createdAt: new Date(),
      updatedAt: new Date(),
      lastSignedIn: new Date(),
    },
    req: { protocol: "https", headers: {} } as TrpcContext["req"],
    res: { clearCookie: vi.fn() } as unknown as TrpcContext["res"],
  };
}

describe("leads.submit", () => {
  it("should submit a lead and return success", async () => {
    const caller = appRouter.createCaller(createPublicContext());
    const result = await caller.leads.submit({
      name: "John Test",
      phone: "7705551234",
      damageType: "hail",
      isOwner: true,
      claimStatus: "not_filed",
      source: "website",
    });
    expect(result.success).toBe(true);
    expect(result.leadId).toBe(1);
  });

  it("should accept all damage types", async () => {
    const caller = appRouter.createCaller(createPublicContext());
    const damageTypes = ["hail", "wind", "fire", "flood", "tree", "roof", "other"] as const;
    for (const damageType of damageTypes) {
      const result = await caller.leads.submit({
        name: "Test User",
        phone: "7705551234",
        damageType,
      });
      expect(result.success).toBe(true);
    }
  });
});

describe("leads.stats", () => {
  it("should return stats for admin users", async () => {
    const caller = appRouter.createCaller(createAdminContext());
    const stats = await caller.leads.stats();
    expect(stats).toHaveProperty("total");
    expect(stats).toHaveProperty("byStage");
    expect(stats).toHaveProperty("byDamage");
  });

  it("should reject non-admin users", async () => {
    const caller = appRouter.createCaller(createPublicContext());
    await expect(caller.leads.stats()).rejects.toThrow();
  });
});

describe("stormAlerts.getActive", () => {
  it("should return null when no active alert", async () => {
    const caller = appRouter.createCaller(createPublicContext());
    const alert = await caller.stormAlerts.getActive();
    expect(alert).toBeNull();
  });
});

describe("chat.message", () => {
  it("should return an AI response", async () => {
    const caller = appRouter.createCaller(createPublicContext());
    const result = await caller.chat.message({
      sessionId: "test-session-123",
      message: "I have hail damage on my roof",
    });
    expect(result).toHaveProperty("message");
    expect(typeof result.message).toBe("string");
    expect(result.message.length).toBeGreaterThan(0);
  });
});
