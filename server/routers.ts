import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, protectedProcedure, router } from "./_core/trpc";
import { notifyOwner } from "./_core/notification";
import { invokeLLM } from "./_core/llm";
import {
  createLead,
  getLeads,
  getLeadById,
  updateLead,
  getLeadStats,
  addLeadActivity,
  getLeadActivities,
  createAppointment,
  getAppointments,
  updateAppointment,
  getActiveStormAlert,
  getAllStormAlerts,
  createStormAlert,
  deactivateStormAlert,
  getFeaturedReviews,
  getAllReviews,
  upsertReview,
  getOrCreateChatSession,
  getChatHistory,
  saveChatMessage,
  updateChatSession,
} from "./db";

const adminProcedure = protectedProcedure.use(({ ctx, next }) => {
  if (ctx.user.role !== "admin") {
    throw new TRPCError({ code: "FORBIDDEN", message: "Admin access required" });
  }
  return next({ ctx });
});

const leadRouter = router({
  submit: publicProcedure
    .input(z.object({
      name: z.string().min(1),
      phone: z.string().min(7),
      email: z.string().email().optional(),
      address: z.string().optional(),
      city: z.string().optional(),
      state: z.string().optional(),
      zip: z.string().optional(),
      damageType: z.enum(["hail", "wind", "fire", "flood", "tree", "roof", "other"]),
      isOwner: z.boolean().optional().default(true),
      claimStatus: z.enum(["not_filed", "open", "denied", "paid"]).optional().default("not_filed"),
      source: z.enum(["website", "facebook", "google", "referral", "storm_canvass", "other"]).optional().default("website"),
      utmSource: z.string().optional(),
      utmMedium: z.string().optional(),
      utmCampaign: z.string().optional(),
      notes: z.string().optional(),
    }))
    .mutation(async ({ input }) => {
      const lead = await createLead(input);
      if (lead) {
        await addLeadActivity({
          leadId: lead.id,
          type: "system",
          content: `New lead submitted via ${input.source ?? "website"}. Damage: ${input.damageType}. Claim: ${input.claimStatus ?? "not_filed"}.`,
          createdBy: "system",
        });
        await notifyOwner({
          title: `🔥 New Lead: ${input.name}`,
          content: `**${input.name}** submitted a lead.\n\n📞 ${input.phone}\n🏠 Damage: ${input.damageType.toUpperCase()}\n📍 ${input.address ?? "No address"}\n💼 Claim: ${input.claimStatus ?? "not_filed"}`,
        });
      }
      return { success: true, leadId: lead?.id };
    }),

  list: adminProcedure
    .input(z.object({
      stage: z.string().optional(),
      damageType: z.string().optional(),
      isArchived: z.boolean().optional(),
      search: z.string().optional(),
      limit: z.number().optional(),
      offset: z.number().optional(),
    }).optional())
    .query(async ({ input }) => getLeads(input)),

  get: adminProcedure
    .input(z.object({ id: z.number() }))
    .query(async ({ input }) => {
      const lead = await getLeadById(input.id);
      if (!lead) throw new TRPCError({ code: "NOT_FOUND" });
      const activities = await getLeadActivities(input.id);
      const appts = await getAppointments(input.id);
      return { lead, activities, appointments: appts };
    }),

  update: adminProcedure
    .input(z.object({
      id: z.number(),
      stage: z.enum(["new", "contacted", "inspection_scheduled", "inspection_done", "estimate_sent", "claim_filed", "approved", "in_progress", "completed", "lost"]).optional(),
      isHot: z.boolean().optional(),
      isArchived: z.boolean().optional(),
      assignedTo: z.string().optional(),
      notes: z.string().optional(),
      insuranceCompany: z.string().optional(),
    }))
    .mutation(async ({ input, ctx }) => {
      const { id, stage, ...rest } = input;
      const existing = await getLeadById(id);
      if (!existing) throw new TRPCError({ code: "NOT_FOUND" });
      const updateData: any = { ...rest };
      if (stage) {
        updateData.stage = stage;
        await addLeadActivity({
          leadId: id,
          type: "stage_change",
          content: `Stage changed from "${existing.stage}" to "${stage}"`,
          createdBy: ctx.user.name ?? "admin",
        });
      }
      return updateLead(id, updateData);
    }),

  addNote: adminProcedure
    .input(z.object({
      leadId: z.number(),
      type: z.enum(["note", "call", "sms", "email", "inspection", "estimate"]),
      content: z.string().min(1),
    }))
    .mutation(async ({ input, ctx }) => {
      await addLeadActivity({ ...input, createdBy: ctx.user.name ?? "admin" });
      return { success: true };
    }),

  stats: adminProcedure.query(async () => getLeadStats()),
});

const appointmentRouter = router({
  create: adminProcedure
    .input(z.object({
      leadId: z.number(),
      title: z.string().min(1),
      type: z.enum(["inspection", "estimate", "job_start", "follow_up"]).optional(),
      scheduledAt: z.date(),
      durationMinutes: z.number().optional(),
      address: z.string().optional(),
      assignedTo: z.string().optional(),
      notes: z.string().optional(),
    }))
    .mutation(async ({ input, ctx }) => {
      const appt = await createAppointment(input);
      if (appt) {
        await addLeadActivity({
          leadId: input.leadId,
          type: "inspection",
          content: `Appointment scheduled: "${input.title}" on ${input.scheduledAt.toLocaleDateString()}`,
          createdBy: ctx.user.name ?? "admin",
        });
        await updateLead(input.leadId, { stage: "inspection_scheduled" });
      }
      return appt;
    }),

  list: adminProcedure
    .input(z.object({ leadId: z.number().optional() }).optional())
    .query(async ({ input }) => getAppointments(input?.leadId)),

  updateStatus: adminProcedure
    .input(z.object({
      id: z.number(),
      status: z.enum(["scheduled", "confirmed", "completed", "cancelled", "no_show"]),
    }))
    .mutation(async ({ input }) => {
      await updateAppointment(input.id, { status: input.status });
      return { success: true };
    }),
});

const stormAlertRouter = router({
  getActive: publicProcedure.query(async () => getActiveStormAlert()),

  list: adminProcedure.query(async () => getAllStormAlerts()),

  create: adminProcedure
    .input(z.object({
      title: z.string().min(1),
      message: z.string().min(1),
      affectedAreas: z.string().min(1),
      severity: z.enum(["watch", "warning", "emergency"]).optional().default("warning"),
    }))
    .mutation(async ({ input, ctx }) => {
      return createStormAlert({ ...input, createdBy: ctx.user.name ?? "admin" });
    }),

  deactivate: adminProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input }) => {
      await deactivateStormAlert(input.id);
      return { success: true };
    }),
});

const reviewsRouter = router({
  featured: publicProcedure.query(async () => getFeaturedReviews()),
  list: adminProcedure.query(async () => getAllReviews()),
  add: adminProcedure
    .input(z.object({
      platform: z.enum(["google", "facebook", "other"]).optional().default("google"),
      reviewerName: z.string().min(1),
      rating: z.number().min(1).max(5),
      content: z.string().optional(),
      reviewDate: z.date().optional(),
      isFeatured: z.boolean().optional().default(false),
    }))
    .mutation(async ({ input }) => {
      await upsertReview(input);
      return { success: true };
    }),
});

const chatRouter = router({
  message: publicProcedure
    .input(z.object({
      sessionId: z.string().min(1),
      message: z.string().min(1),
      visitorName: z.string().optional(),
      visitorPhone: z.string().optional(),
    }))
    .mutation(async ({ input }) => {
      await getOrCreateChatSession(input.sessionId);
      if (input.visitorName || input.visitorPhone) {
        await updateChatSession(input.sessionId, {
          visitorName: input.visitorName,
          visitorPhone: input.visitorPhone,
        });
      }
      await saveChatMessage(input.sessionId, "user", input.message);
      const history = await getChatHistory(input.sessionId);
      const messages: Array<{ role: "user" | "assistant" | "system"; content: string }> = history.slice(-10).map((m) => ({ role: m.role as "user" | "assistant", content: m.content }));

      const systemPrompt = `You are a helpful assistant for Restore America Roofing & Restoration. Help homeowners with storm, fire, flood, hail, wind, or tree damage. Goals: qualify the lead, explain free inspections, collect name and phone, mention 5.0 Google rating with 113+ reviews. Phone: 844-LETS-RESTORE. Keep responses concise and warm.`;

      const response = await invokeLLM({
        messages: [{ role: "system" as const, content: systemPrompt }, ...messages, { role: "user" as const, content: input.message }],
      });

      const rawContent = response.choices[0]?.message?.content;
      const assistantMessage = (typeof rawContent === "string" ? rawContent : null) ?? "Thank you! A specialist will call you shortly at 844-LETS-RESTORE.";
      await saveChatMessage(input.sessionId, "assistant", assistantMessage);

      if (input.visitorPhone && input.visitorName) {
        try {
          const lead = await createLead({
            name: input.visitorName,
            phone: input.visitorPhone,
            damageType: "other",
            source: "website",
            notes: `Chat lead: ${input.message}`,
          });
          if (lead) {
            await updateChatSession(input.sessionId, { leadId: lead.id, status: "converted" });
            await notifyOwner({ title: `💬 Chat Lead: ${input.visitorName}`, content: `📞 ${input.visitorPhone}\n💬 "${input.message}"` });
          }
        } catch (e) { /* non-critical */ }
      }

      return { message: assistantMessage };
    }),

  history: publicProcedure
    .input(z.object({ sessionId: z.string() }))
    .query(async ({ input }) => getChatHistory(input.sessionId)),
});

export const appRouter = router({
  system: systemRouter,
  auth: router({
    me: publicProcedure.query((opts) => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return { success: true } as const;
    }),
  }),
  leads: leadRouter,
  appointments: appointmentRouter,
  stormAlerts: stormAlertRouter,
  reviews: reviewsRouter,
  chat: chatRouter,
});

export type AppRouter = typeof appRouter;
