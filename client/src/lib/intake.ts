export type IntakeSubmissionPayload = Record<string, unknown>;

type IntakeResponseBody = {
  error?: string;
};

const CANONICAL_INTAKE_URL = "https://e3-c-grid.vercel.app/api/intake";

function getIntakeEndpoints(): string[] {
  const configured = (import.meta.env.VITE_INTAKE_API_URL as string | undefined)?.trim();
  const endpoints = [configured, CANONICAL_INTAKE_URL, "/api/intake"].filter(
    (value): value is string => Boolean(value)
  );
  return Array.from(new Set(endpoints));
}

export async function submitWebsiteIntake(payload: IntakeSubmissionPayload): Promise<unknown> {
  let lastError = "Failed to submit intake request.";

  for (const endpoint of getIntakeEndpoints()) {
    try {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
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

      // Validation should surface immediately; route/infra errors can try fallback endpoints.
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
