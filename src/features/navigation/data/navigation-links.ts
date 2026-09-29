import type { NavigationItem } from "@/core/types/commerce";

// Static route structure, not content: these map to fixed storefront routes.
// Revisit only if merchandising needs editable navigation (see api/PLAN.md Slice 4).

export const primaryNavigation: NavigationItem[] = [
  { label: "New Drop", href: "/" },
  { label: "Men", href: "/products?gender=men" },
  { label: "Women", href: "/products?gender=women" },
  { label: "Stories", href: "/stories" },
];

export const utilityLinks: NavigationItem[] = [
  { label: "Search", href: "/products" },
  { label: "Account", href: "/account" },
  { label: "Bag", href: "/bag" },
];
