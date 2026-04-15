import { ReactNode } from "react";

import { storefrontMock } from "@/mocks/storefront";

import { SiteFooter } from "./site-footer";
import { SiteHeader } from "./site-header";

export function StorefrontShell({ children }: { children: ReactNode }) {
  return (
    <>
      <SiteHeader
        navigation={storefrontMock.navigation}
        utilityLinks={storefrontMock.utilityLinks}
      />
      <main className="flex-1">{children}</main>
      <SiteFooter />
    </>
  );
}
