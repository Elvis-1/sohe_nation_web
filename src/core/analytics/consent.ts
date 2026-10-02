/**
 * Visitor consent for optional tracking, kept in a first-party cookie.
 *
 * "Basic" consent: GA4 and the Meta Pixel are not loaded at all until the matching category
 * is accepted, so nothing is sent to Google or Meta before consent (UK PECR/GDPR, NDPA 2023).
 * Strictly necessary storage (bag, sign-in session, this cookie) needs no consent.
 */

export type ConsentChoice = {
  analytics: boolean;
  marketing: boolean;
};

export const CONSENT_COOKIE = "sohe_consent";
// Bump when the categories or their wording change so every visitor is asked again.
export const CONSENT_VERSION = 1;
const CONSENT_MAX_AGE_SECONDS = 60 * 60 * 24 * 182; // about 6 months

const CONSENT_CHANGE_EVENT = "sohe:consent-change";
const OPEN_SETTINGS_EVENT = "sohe:open-cookie-settings";

type StoredConsent = ConsentChoice & { v: number; at: string };

export function readConsent(): ConsentChoice | null {
  if (typeof document === "undefined") return null;
  const raw = document.cookie
    .split("; ")
    .find((part) => part.startsWith(`${CONSENT_COOKIE}=`))
    ?.slice(CONSENT_COOKIE.length + 1);
  if (!raw) return null;
  try {
    const stored = JSON.parse(decodeURIComponent(raw)) as Partial<StoredConsent>;
    if (stored.v !== CONSENT_VERSION) return null;
    return { analytics: stored.analytics === true, marketing: stored.marketing === true };
  } catch {
    return null;
  }
}

export function writeConsent(choice: ConsentChoice) {
  const stored: StoredConsent = { ...choice, v: CONSENT_VERSION, at: new Date().toISOString() };
  const secure = window.location.protocol === "https:" ? "; Secure" : "";
  document.cookie = `${CONSENT_COOKIE}=${encodeURIComponent(JSON.stringify(stored))}; Max-Age=${CONSENT_MAX_AGE_SECONDS}; Path=/; SameSite=Lax${secure}`;
  if (!choice.analytics) clearCookies(/^_ga/);
  if (!choice.marketing) clearCookies(/^_fb[cp]$/);
  window.dispatchEvent(new CustomEvent(CONSENT_CHANGE_EVENT));
}

// Remove tracker cookies when consent is withdrawn (they may sit on the parent domain).
function clearCookies(pattern: RegExp) {
  const names = document.cookie
    .split("; ")
    .map((part) => part.split("=")[0])
    .filter((name) => pattern.test(name));
  const host = window.location.hostname;
  const domains = ["", host, `.${host.split(".").slice(-2).join(".")}`];
  for (const name of names) {
    for (const domain of domains) {
      document.cookie = `${name}=; Max-Age=0; Path=/${domain ? `; Domain=${domain}` : ""}`;
    }
  }
}

export function subscribeToConsent(onChange: () => void) {
  window.addEventListener(CONSENT_CHANGE_EVENT, onChange);
  return () => window.removeEventListener(CONSENT_CHANGE_EVENT, onChange);
}

export function openCookieSettings() {
  window.dispatchEvent(new CustomEvent(OPEN_SETTINGS_EVENT));
}

export function subscribeToOpenSettings(onOpen: () => void) {
  window.addEventListener(OPEN_SETTINGS_EVENT, onOpen);
  return () => window.removeEventListener(OPEN_SETTINGS_EVENT, onOpen);
}
