import type { NavigationItem } from "@/core/types/commerce";

// Static route structure, not content: these map to fixed storefront routes.
// Revisit only if merchandising needs editable navigation (see api/PLAN.md Slice 4).

export const primaryNavigation: NavigationItem[] = [
  { label: "New Drop", href: "/" },
  { label: "Men", href: "/men" },
  { label: "Women", href: "/women" },
  { label: "Stories", href: "/stories" },
];

export const utilityLinks: NavigationItem[] = [
  { label: "Search", href: "/products" },
  { label: "Account", href: "/account" },
  { label: "Bag", href: "/bag" },
];

export type FooterNavigationGroup = {
  title: "Shop" | "Help" | "About" | "Legal";
  links: NavigationItem[];
};

// Footer columns. Information and legal routes are served by app/(marketing)/[infoSlug].
export const footerNavigation: FooterNavigationGroup[] = [
  {
    title: "Shop",
    links: [
      { label: "All products", href: "/products" },
      ...primaryNavigation.filter((item) => item.label === "Men" || item.label === "Women"),
      { label: "Outerwear", href: "/collections/outerwear" },
      { label: "Tracksuits", href: "/collections/tracksuits" },
      { label: "Tops", href: "/collections/tops" },
      { label: "Bottoms", href: "/collections/bottoms" },
      { label: "Headwear", href: "/collections/headwear" },
      { label: "Stories", href: "/stories" },
    ],
  },
  {
    title: "Help",
    links: [
      { label: "Shipping and delivery", href: "/shipping" },
      { label: "Returns and refunds", href: "/returns" },
      { label: "Size guide", href: "/size-guide" },
      { label: "FAQ", href: "/faq" },
      { label: "Track an order", href: "/account/orders" },
      { label: "Contact us", href: "/contact" },
    ],
  },
  {
    title: "About",
    links: [{ label: "About Sohe's Nation", href: "/about" }],
  },
  {
    title: "Legal",
    links: [
      { label: "Privacy and cookies", href: "/privacy" },
      { label: "Terms of sale", href: "/terms" },
    ],
  },
];
