import type { Request, Response } from "express";
import type { InsertLead } from "../drizzle/schema";
import { createLead, getDb, getLeads } from "./db";

type JsonObject = Record<string, unknown>;

type DamageType = "hail" | "wind" | "fire" | "flood" | "tree" | "roof" | "other";
type ClaimStatus = "not_filed" | "open" | "denied" | "paid";
type LeadSource = "website" | "facebook" | "google" | "referral" | "storm_canvass" | "other";

export type NormalizedIntakeLead = {
  fullName?: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  email?: string;
  propertyAddress?: string;
  damageType?: string;
  interest?: string;
  propertyOwner?: string;
  insuranceClaimStatus?: string;
  source?: string;
  message?: string;
  formAnswers?: JsonObject;
  customFields: JsonObject;
  rawSubmission: unknown;
};

export type IntakeLeadRecord = NormalizedIntakeLead & {
  id: number;
  createdAt: string;
  crmLeadId?: number;
};

type IntakeSubmissionResult =
  | { success: true; lead: IntakeLeadRecord }
  | { success: false; error: string };

declare global {
  // eslint-disable-next-line no-var
  var __E3C_GRID_LEADS__: IntakeLeadRecord[] | undefined;
  // eslint-disable-next-line no-var
  var __E3C_GRID_LEAD_ID__: number | undefined;
}

const KNOWN_INTAKE_KEYS = new Set([
  "fullName",
  "firstName",
  "lastName",
  "name",
  "phone",
  "email",
  "propertyAddress",
  "address",
  "damageType",
  "interest",
  "propertyOwner",
  "isOwner",
  "insuranceClaimStatus",
  "claimStatus",
  "source",
  "message",
  "notes",
  "details",
  "formAnswers",
]);

function isJsonObject(value: unknown): value is JsonObject {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function parseRawSubmission(input: unknown): JsonObject {
  if (isJsonObject(input)) {
    return input;
  }

  if (typeof input === "string") {
    const trimmed = input.trim();
    if (!trimmed) {
      return {};
    }

    try {
      const parsed = JSON.parse(trimmed);
      return isJsonObject(parsed) ? parsed : {};
    } catch {
      return {};
    }
  }

  return {};
}

function asString(value: unknown): string | undefined {
  if (typeof value !== "string") {
    return undefined;
  }

  const trimmed = value.trim();
  return trimmed ? trimmed : undefined;
}

function pickFirstString(source: JsonObject, keys: string[]): string | undefined {
  for (const key of keys) {
    const value = asString(source[key]);
    if (value) {
      return value;
    }
  }
  return undefined;
}

function splitName(fullName: string): { firstName?: string; lastName?: string } {
  const parts = fullName.split(/\s+/).filter(Boolean);
  if (parts.length === 0) {
    return {};
  }
  if (parts.length === 1) {
    return { firstName: parts[0] };
  }
  return {
    firstName: parts[0],
    lastName: parts.slice(1).join(" "),
  };
}

function normalizePropertyOwner(rawValue: unknown): string | undefined {
  if (typeof rawValue === "boolean") {
    return rawValue ? "Yes" : "No";
  }

  return asString(rawValue);
}

function normalizeClaimStatus(rawValue: unknown): string | undefined {
  if (typeof rawValue === "boolean") {
    return rawValue ? "Yes" : "No";
  }

  return asString(rawValue);
}

function extractCustomFields(payload: JsonObject): JsonObject {
  const customFields: JsonObject = {};

  for (const [key, value] of Object.entries(payload)) {
    if (!KNOWN_INTAKE_KEYS.has(key)) {
      customFields[key] = value;
    }
  }

  return customFields;
}

function normalizePayload(input: unknown): IntakeSubmissionResult {
  const payload = parseRawSubmission(input);

  let fullName = pickFirstString(payload, ["fullName", "name"]);
  let firstName = pickFirstString(payload, ["firstName"]);
  let lastName = pickFirstString(payload, ["lastName"]);

  if (!firstName && fullName) {
    const split = splitName(fullName);
    firstName = split.firstName;
    if (!lastName) {
      lastName = split.lastName;
    }
  }

  if (!fullName && (firstName || lastName)) {
    fullName = [firstName, lastName].filter(Boolean).join(" ") || undefined;
  }

  const phone = pickFirstString(payload, ["phone"]);
  const email = pickFirstString(payload, ["email"]);

  if (!firstName && !fullName) {
    return {
      success: false,
      error: "Contact name is required (firstName or fullName).",
    };
  }

  if (!phone && !email) {
    return {
      success: false,
      error: "At least one contact method is required (phone or email).",
    };
  }

  const message = pickFirstString(payload, ["message", "notes", "details"]);
  const damageType = pickFirstString(payload, ["damageType"]);
  const interest = pickFirstString(payload, ["interest"]) ?? damageType;
  const propertyAddress = pickFirstString(payload, ["propertyAddress", "address"]);
  const source = pickFirstString(payload, ["source"]);
  const propertyOwner = normalizePropertyOwner(payload.propertyOwner ?? payload.isOwner);
  const insuranceClaimStatus = normalizeClaimStatus(
    payload.insuranceClaimStatus ?? payload.claimStatus
  );
  const formAnswers = isJsonObject(payload.formAnswers)
    ? payload.formAnswers
    : undefined;

  const normalizedLead: IntakeLeadRecord = {
    id: nextLeadId(),
    createdAt: new Date().toISOString(),
    fullName,
    firstName,
    lastName,
    phone,
    email,
    propertyAddress,
    damageType,
    interest,
    propertyOwner,
    insuranceClaimStatus,
    source,
    message,
    formAnswers,
    customFields: extractCustomFields(payload),
    rawSubmission: payload,
  };

  return {
    success: true,
    lead: normalizedLead,
  };
}

function getMemoryLeads(): IntakeLeadRecord[] {
  if (!globalThis.__E3C_GRID_LEADS__) {
    globalThis.__E3C_GRID_LEADS__ = [];
  }

  return globalThis.__E3C_GRID_LEADS__;
}

function nextLeadId(): number {
  if (!globalThis.__E3C_GRID_LEAD_ID__) {
    globalThis.__E3C_GRID_LEAD_ID__ = 1;
    return 1;
  }

  globalThis.__E3C_GRID_LEAD_ID__ += 1;
  return globalThis.__E3C_GRID_LEAD_ID__;
}

function mapDamageType(value?: string): DamageType {
  const normalized = value?.toLowerCase() ?? "";
  if (normalized.includes("hail")) return "hail";
  if (normalized.includes("wind")) return "wind";
  if (normalized.includes("fire")) return "fire";
  if (normalized.includes("flood") || normalized.includes("water")) return "flood";
  if (normalized.includes("tree")) return "tree";
  if (normalized.includes("roof")) return "roof";
  return "other";
}

function mapClaimStatus(value?: string): ClaimStatus {
  const normalized = value?.toLowerCase() ?? "";
  if (normalized.includes("open") || normalized.includes("filed")) return "open";
  if (normalized.includes("denied")) return "denied";
  if (normalized.includes("paid") || normalized.includes("approved")) return "paid";
  return "not_filed";
}

function mapSource(value?: string): LeadSource {
  const normalized = value?.toLowerCase() ?? "";
  if (normalized.includes("facebook")) return "facebook";
  if (normalized.includes("google")) return "google";
  if (normalized.includes("referral")) return "referral";
  if (normalized.includes("storm") || normalized.includes("canvass")) return "storm_canvass";
  if (normalized.includes("website") || normalized.includes("web")) return "website";
  return "other";
}

function mapPropertyOwner(value?: string): boolean | undefined {
  if (!value) {
    return undefined;
  }

  const normalized = value.toLowerCase();
  if (normalized.includes("yes") || normalized.includes("own")) return true;
  if (normalized.includes("no") || normalized.includes("rent") || normalized.includes("manage")) {
    return false;
  }
  return undefined;
}

function toDatabaseLead(lead: IntakeLeadRecord): InsertLead {
  const utmSource = asString(lead.customFields.utmSource);
  const utmMedium = asString(lead.customFields.utmMedium);
  const utmCampaign = asString(lead.customFields.utmCampaign);

  return {
    name: lead.fullName ?? [lead.firstName, lead.lastName].filter(Boolean).join(" "),
    phone: lead.phone ?? "N/A",
    email: lead.email,
    address: lead.propertyAddress,
    damageType: mapDamageType(lead.interest ?? lead.damageType),
    isOwner: mapPropertyOwner(lead.propertyOwner),
    claimStatus: mapClaimStatus(lead.insuranceClaimStatus),
    source: mapSource(lead.source),
    notes: lead.message,
    utmSource,
    utmMedium,
    utmCampaign,
  };
}

async function persistLead(lead: IntakeLeadRecord): Promise<IntakeLeadRecord> {
  try {
    const created = await createLead(toDatabaseLead(lead));
    if (created?.id) {
      return {
        ...lead,
        crmLeadId: created.id,
      };
    }
  } catch {
    // Swallow DB errors and keep in-memory behavior for local/testing environments.
  }

  return lead;
}

export async function submitLeadIntake(input: unknown): Promise<IntakeSubmissionResult> {
  const normalized = normalizePayload(input);
  if (!normalized.success) {
    return normalized;
  }

  const persisted = await persistLead(normalized.lead);
  getMemoryLeads().unshift(persisted);

  return {
    success: true,
    lead: persisted,
  };
}

function mapDbLeadToIntakeRecord(dbLead: Awaited<ReturnType<typeof getLeads>>[number]): IntakeLeadRecord {
  const [firstName, ...lastNameParts] = (dbLead.name ?? "").split(/\s+/).filter(Boolean);

  return {
    id: dbLead.id,
    createdAt: dbLead.createdAt?.toISOString?.() ?? new Date().toISOString(),
    fullName: dbLead.name ?? undefined,
    firstName: firstName || undefined,
    lastName: lastNameParts.join(" ") || undefined,
    phone: dbLead.phone ?? undefined,
    email: dbLead.email ?? undefined,
    propertyAddress: dbLead.address ?? undefined,
    damageType: dbLead.damageType ?? undefined,
    interest: dbLead.damageType ?? undefined,
    propertyOwner: typeof dbLead.isOwner === "boolean" ? (dbLead.isOwner ? "Yes" : "No") : undefined,
    insuranceClaimStatus: dbLead.claimStatus ?? undefined,
    source: dbLead.source ?? undefined,
    message: dbLead.notes ?? undefined,
    customFields: {},
    rawSubmission: {
      id: dbLead.id,
      name: dbLead.name,
      phone: dbLead.phone,
      email: dbLead.email,
      address: dbLead.address,
      damageType: dbLead.damageType,
      claimStatus: dbLead.claimStatus,
      source: dbLead.source,
      notes: dbLead.notes,
    },
  };
}

export async function listStoredLeads(): Promise<IntakeLeadRecord[]> {
  try {
    const db = await getDb();
    if (db) {
      const records = await getLeads({ limit: 200, offset: 0 });
      return records.map(mapDbLeadToIntakeRecord);
    }
  } catch {
    // Fall through to in-memory store when DB is unavailable.
  }

  return getMemoryLeads();
}

function getAllowedOrigins(): string[] {
  const raw = process.env.ALLOWED_ORIGINS;
  if (!raw?.trim()) {
    return ["*"];
  }

  return raw
    .split(",")
    .map((origin) => origin.trim())
    .filter(Boolean);
}

function resolveCorsOrigin(requestOrigin: string | undefined): string {
  const allowedOrigins = getAllowedOrigins();
  if (allowedOrigins.includes("*")) {
    return "*";
  }

  if (requestOrigin && allowedOrigins.includes(requestOrigin)) {
    return requestOrigin;
  }

  return allowedOrigins[0] ?? "*";
}

function applyCorsHeaders(req: Request, res: Response, methods: string): void {
  const requestOrigin = asString(req.headers.origin);
  res.setHeader("Access-Control-Allow-Origin", resolveCorsOrigin(requestOrigin));
  res.setHeader("Access-Control-Allow-Methods", methods);
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  res.setHeader("Vary", "Origin");
}

export async function handleIntakeRequest(req: Request, res: Response): Promise<void> {
  applyCorsHeaders(req, res, "POST, OPTIONS");

  if (req.method === "OPTIONS") {
    res.status(204).end();
    return;
  }

  if (req.method !== "POST") {
    res.setHeader("Allow", "POST, OPTIONS");
    res.status(405).json({ error: "Method not allowed. Use POST." });
    return;
  }

  try {
    const result = await submitLeadIntake(req.body);

    if (!result.success) {
      res.status(400).json({ error: result.error });
      return;
    }

    res.status(201).json({ success: true, lead: result.lead });
  } catch {
    res.status(500).json({ error: "Failed to submit intake payload." });
  }
}

export async function handleLeadsRequest(req: Request, res: Response): Promise<void> {
  applyCorsHeaders(req, res, "GET, OPTIONS");

  if (req.method === "OPTIONS") {
    res.status(204).end();
    return;
  }

  if (req.method !== "GET") {
    res.setHeader("Allow", "GET, OPTIONS");
    res.status(405).json({ error: "Method not allowed. Use GET." });
    return;
  }

  try {
    const leads = await listStoredLeads();
    res.status(200).json({ success: true, leads });
  } catch {
    res.status(500).json({ error: "Failed to fetch leads." });
  }
}

export async function handleHealthRequest(req: Request, res: Response): Promise<void> {
  applyCorsHeaders(req, res, "GET, OPTIONS");

  if (req.method === "OPTIONS") {
    res.status(204).end();
    return;
  }

  if (req.method !== "GET") {
    res.setHeader("Allow", "GET, OPTIONS");
    res.status(405).json({ error: "Method not allowed. Use GET." });
    return;
  }

  res.status(200).json({
    success: true,
    status: "ok",
    timestamp: new Date().toISOString(),
  });
}
