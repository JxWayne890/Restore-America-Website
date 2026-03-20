export type IntakeSubmissionPayload = Record<string, unknown>;

type IntakeResponseBody = {
  error?: string;
};

const CANONICAL_INTAKE_URL = "https://e3-c-grid.vercel.app/api/intake";
const WEBSITE_INTAKE_WEBHOOK_URL =
  "https://e3-c-grid.vercel.app/api/intake?key=whk_OWIzNmZlZTMtMzI1Yi00NGY0LWJlODgtNDA4MmRjZGQxNDZi.7906118ec5bae1bcaa40480b";

function isKeyedWebhookEndpoint(endpoint: string): boolean {
  return /[?&]key=/.test(endpoint);
}

function getConfiguredIntakeBaseUrl(): string {
  return (
    (import.meta.env.VITE_INTAKE_API_URL as string | undefined)?.trim() ??
    CANONICAL_INTAKE_URL
  );
}

function getConfiguredIntakeSubmissionUrl(): string {
  return (
    (import.meta.env.VITE_INTAKE_API_URL as string | undefined)?.trim() ??
    WEBSITE_INTAKE_WEBHOOK_URL
  );
}

export function getConfiguredOrganizationId(): string | undefined {
  const organizationId =
    (import.meta.env.VITE_INTAKE_ORGANIZATION_ID as string | undefined)?.trim() ||
    (import.meta.env.VITE_ORGANIZATION_ID as string | undefined)?.trim();

  return organizationId || undefined;
}

function buildScopedEndpoint(endpoint: string, organizationId?: string): string {
  const trimmedEndpoint = endpoint.replace(/\/+$/, "");
  if (!organizationId || isKeyedWebhookEndpoint(trimmedEndpoint)) {
    return trimmedEndpoint;
  }

  const encodedOrganizationId = encodeURIComponent(organizationId);
  if (trimmedEndpoint.includes(":organizationId")) {
    return trimmedEndpoint.replace(":organizationId", encodedOrganizationId);
  }

  const [path, query = ""] = trimmedEndpoint.split("?");
  if (path.endsWith(`/${encodedOrganizationId}`)) {
    return trimmedEndpoint;
  }

  return query
    ? `${path}/${encodedOrganizationId}?${query}`
    : `${path}/${encodedOrganizationId}`;
}

export function getOrganizationWebhookEndpoint(
  organizationId: string,
  baseUrl = getConfiguredIntakeBaseUrl()
): string {
  return buildScopedEndpoint(baseUrl, organizationId);
}

function getIntakeEndpoints(): string[] {
  const organizationId = getConfiguredOrganizationId();
  const endpoint = buildScopedEndpoint(getConfiguredIntakeSubmissionUrl(), organizationId);
  return endpoint ? [endpoint] : [];
}

function withConfiguredOrganizationId(
  payload: IntakeSubmissionPayload
): IntakeSubmissionPayload {
  const organizationId = getConfiguredOrganizationId();
  if (!organizationId || payload.organizationId || payload.orgId) {
    return payload;
  }

  return {
    organizationId,
    ...payload,
  };
}

export async function submitWebsiteIntake(payload: IntakeSubmissionPayload): Promise<unknown> {
  let lastError = "Failed to submit intake request.";
  const requestPayload = withConfiguredOrganizationId(payload);

  for (const endpoint of getIntakeEndpoints()) {
    try {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestPayload),
      });

      const body = (await response.json().catch(() => ({}))) as IntakeResponseBody;

      if (response.ok) {
        return body;
      }

      const message =
        typeof body.error === "string" && body.error.trim()
          ? body.error
          : `Failed to submit intake request (HTTP ${response.status}).`;

      lastError = message;

      // Validation errors should surface immediately to the form.
      if (response.status >= 400 && response.status < 500 && response.status !== 404) {
        throw new Error(message);
      }
    } catch (error) {
      if (error instanceof Error) {
        lastError = error.message || lastError;
      }
      continue;
    }
  }

  throw new Error(lastError);
}
