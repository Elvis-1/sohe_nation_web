/**
 * Newsletter API calls (`/api/v1/marketing/*`).
 * Sign-up is double opt-in: `subscribeToNewsletter` only means "confirmation email on its way".
 */

import { resolveApiBaseUrl } from "@/core/api/resolve-api-base-url";

const API_BASE = resolveApiBaseUrl({ preferInternal: false });

export type NewsletterSource = "footer" | "registration" | "checkout";

type ApiPayload = {
  message?: string;
  error?: {
    code?: string;
    message?: string;
  };
};

export class NewsletterError extends Error {
  constructor(
    public readonly status: number,
    message: string,
  ) {
    super(message);
    this.name = "NewsletterError";
  }
}

async function post(path: string, body: Record<string, string>): Promise<ApiPayload> {
  let response: Response;
  try {
    response = await fetch(`${API_BASE}${path}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
  } catch {
    throw new NewsletterError(0, "We could not reach the list right now. Please try again.");
  }

  const payload = (await response.json().catch(() => null)) as ApiPayload | null;
  if (!response.ok) {
    throw new NewsletterError(response.status, errorMessage(response.status, payload));
  }
  return payload ?? {};
}

function errorMessage(status: number, payload: ApiPayload | null): string {
  if (status === 429) {
    return "Too many attempts. Give it a little while, then try again.";
  }
  if (status === 400 && payload?.error?.code === "newsletter_confirmation_invalid") {
    return payload.error.message ?? "This confirmation link is no longer valid.";
  }
  if (status === 400) {
    return "Enter a valid email so we can hold your place on the drop list.";
  }
  return "We could not add you right now. Please try again.";
}

export async function subscribeToNewsletter(
  email: string,
  source: NewsletterSource = "footer",
): Promise<string> {
  const payload = await post("/marketing/subscribe/", { email, source });
  return payload.message ?? "Check your inbox to confirm your place on the drop list.";
}

export async function confirmNewsletterSubscription(token: string): Promise<string> {
  const payload = await post("/marketing/subscribe/confirm/", { token });
  return payload.message ?? "You are on the list. First notice goes to your inbox.";
}
