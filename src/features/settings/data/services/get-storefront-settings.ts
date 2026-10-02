import { cachedContentRequest } from "@/core/api/cache";
import { resolveApiBaseUrl } from "@/core/api/resolve-api-base-url";

const API_BASE = resolveApiBaseUrl();

export type SocialLink = {
  platform: string;
  label: string;
  url: string;
};

export type StorefrontSettings = {
  storeName: string;
  supportEmail: string;
  /** Only the brand profiles staff have filled in (dashboard settings → Store profile). */
  socialLinks: SocialLink[];
};

const DEFAULT_STOREFRONT_SETTINGS: StorefrontSettings = {
  storeName: "Sohe's Nation",
  supportEmail: "support@sohenation.com",
  socialLinks: [],
};

type ApiStorefrontSettings = {
  store_name: string;
  support_email: string;
  social_links?: SocialLink[];
};

export async function getStorefrontSettings(): Promise<StorefrontSettings> {
  try {
    const response = await fetch(`${API_BASE}/settings/storefront/`, {
      method: "GET",
      ...cachedContentRequest,
    });

    if (!response.ok) {
      return DEFAULT_STOREFRONT_SETTINGS;
    }

    const payload = (await response.json()) as ApiStorefrontSettings;
    return {
      storeName: payload.store_name || DEFAULT_STOREFRONT_SETTINGS.storeName,
      supportEmail: payload.support_email || DEFAULT_STOREFRONT_SETTINGS.supportEmail,
      socialLinks: (payload.social_links ?? []).filter((link) => link.url.startsWith("https://")),
    };
  } catch {
    return DEFAULT_STOREFRONT_SETTINGS;
  }
}
