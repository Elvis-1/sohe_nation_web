import type { Metadata } from "next";

import { PRIVATE_PAGE_ROBOTS } from "@/core/config/page-metadata";
import { StorefrontShell } from "@/features/navigation/presentation/components/storefront-shell";

// Every account page is private: never indexed, whatever the page itself sets for its title.
export const metadata: Metadata = { title: "Your account", robots: PRIVATE_PAGE_ROBOTS };

export default function AccountLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <StorefrontShell>{children}</StorefrontShell>;
}
