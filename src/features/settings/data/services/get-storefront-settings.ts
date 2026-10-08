import { cachedContentRequest } from "@/core/api/cache";
import { resolveApiBaseUrl } from "@/core/api/resolve-api-base-url";
import type { StoreReturnRules } from "@/core/types/commerce";
import { DEFAULT_STORE_RETURN_RULES, toStoreReturnRules } from "@/core/utils/return-rule";

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
  /** Store-wide return rules (dashboard settings → Returns). */
  returns: StoreReturnRules;
};

const DEFAULT_STOREFRONT_SETTINGS: StorefrontSettings = {
  storeName: "Sohe Nation",
  supportEmail: "support@sohenation.com",
  socialLinks: [],
  returns: DEFAULT_STORE_RETURN_RULES,
};

type ApiStorefrontSettings = {
  store_name: string;
  support_email: string;
  social_links?: SocialLink[];
  returns?: { return_window_days?: number; final_sale_regions?: string[] };
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
      returns: toStoreReturnRules(payload.returns),
    };
  } catch {
    return DEFAULT_STOREFRONT_SETTINGS;
  }
}
