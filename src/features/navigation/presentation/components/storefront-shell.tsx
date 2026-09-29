import { ReactNode } from "react";

import { primaryNavigation, utilityLinks } from "@/features/navigation/data/navigation-links";
import { StorefrontProviders } from "@/features/cart-and-checkout/presentation/components/storefront-providers";
import { getStorefrontSettings } from "@/features/settings/data/services/get-storefront-settings";

import { SiteFooter } from "./site-footer";
import { SiteHeader } from "./site-header";

export async function StorefrontShell({ children }: { children: ReactNode }) {
  const settings = await getStorefrontSettings();

  return (
    <StorefrontProviders>
      <SiteHeader
        navigation={primaryNavigation}
        utilityLinks={utilityLinks}
      />
      <main className="flex-1">{children}</main>
      <SiteFooter settings={settings} />
    </StorefrontProviders>
  );
}
