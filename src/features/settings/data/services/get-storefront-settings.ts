const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:8000/api/v1";

export type StorefrontSettings = {
  storeName: string;
  supportEmail: string;
};

const DEFAULT_STOREFRONT_SETTINGS: StorefrontSettings = {
  storeName: "Sohe's Nation",
  supportEmail: "support@sohesnation.com",
};

type ApiStorefrontSettings = {
  store_name: string;
  support_email: string;
};

export async function getStorefrontSettings(): Promise<StorefrontSettings> {
  try {
    const response = await fetch(`${API_BASE}/settings/storefront/`, {
      method: "GET",
      cache: "no-store",
    });

    if (!response.ok) {
      return DEFAULT_STOREFRONT_SETTINGS;
    }

    const payload = (await response.json()) as ApiStorefrontSettings;
    return {
      storeName: payload.store_name || DEFAULT_STOREFRONT_SETTINGS.storeName,
      supportEmail: payload.support_email || DEFAULT_STOREFRONT_SETTINGS.supportEmail,
    };
  } catch {
    return DEFAULT_STOREFRONT_SETTINGS;
  }
}
