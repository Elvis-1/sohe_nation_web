import type {
  HeroCampaign,
  NavigationItem,
  Product,
} from "@/core/types/commerce";

const navigation: NavigationItem[] = [
  { label: "New & Featured", href: "#" },
  { label: "Men", href: "#" },
  { label: "Women", href: "#" },
  { label: "Collections", href: "#" },
  { label: "Stories", href: "#" },
];

const utilityLinks: NavigationItem[] = [
  { label: "Search", href: "#" },
  { label: "Account", href: "#" },
  { label: "Bag", href: "#" },
];

const heroCampaign: HeroCampaign = {
  eyebrow: "Campaign 01",
  title: "Built Like An Army",
  statement: "Street discipline. Runway presence.",
  description:
    "A Nike-inspired launch page translated for Sohe's Nation: bold photography, command-led copy, and a fast path from campaign to cart.",
  primaryCta: { label: "Shop The Drop", href: "#featured-drop" },
  secondaryCta: { label: "View Lookbook", href: "#story-band" },
  campaignStats: [
    { label: "Styles in Drop", value: "12" },
    { label: "Launch Markets", value: "1 now / region-ready" },
    { label: "Payments", value: "PayPal + Flutterwave" },
  ],
  media: {
    id: "hero-video",
    type: "video",
    url: "/hero-runway.mp4",
    posterUrl: "/jacket_with_pant.jpeg",
    alt: "Sohe's Nation runway campaign video",
  },
};

const featuredProducts: Product[] = [
  {
    id: "sn-tactical-tracksuit",
    slug: "sn-tactical-tracksuit-set",
    title: "SN Tactical Tracksuit Set",
    subtitle: "Flagship silhouette",
    badge: "Launch Edition",
    description:
      "Structured lines, premium stretch, and a militant edge built for sharp movement.",
    regionAvailability: ["NG", "US"],
    defaultRegion: "NG",
    category: "tracksuit",
    gender: "unisex",
    media: [
      {
        id: "tracksuit-main",
        alt: "Tracksuit set in studio pose",
        type: "image",
        url: "/hoodle_with_pant.jpeg",
      },
    ],
    priceRange: {
      min: { amount: 185000, currency: "NGN", formatted: "NGN 185,000" },
      max: { amount: 185000, currency: "NGN", formatted: "NGN 185,000" },
    },
    variants: [
      {
        id: "variant-track-m-black-m",
        sku: "SN-TACT-BLK-M",
        slug: "sn-tactical-tracksuit-set-black-m",
        title: "SN Tactical Tracksuit Set",
        size: "M",
        color: "Black Gold",
        inventoryQuantity: 8,
        isAvailable: true,
        price: { amount: 185000, currency: "NGN", formatted: "NGN 185,000" },
        attributes: [
          { name: "fit", value: "regular" },
          { name: "fabric", value: "performance knit" },
        ],
      },
    ],
  },
  {
    id: "sn-command-jacket",
    slug: "sn-command-jacket",
    title: "SN Command Jacket",
    subtitle: "Layer for impact",
    badge: "Outerwear",
    description: "A hard-cut jacket made to anchor the whole look with tactical polish.",
    regionAvailability: ["NG"],
    defaultRegion: "NG",
    category: "outerwear",
    gender: "unisex",
    media: [
      {
        id: "command-jacket-main",
        alt: "Jacket product shot",
        type: "image",
        url: "/jacket2.jpeg",
      },
    ],
    priceRange: {
      min: { amount: 112000, currency: "NGN", formatted: "NGN 112,000" },
      max: { amount: 112000, currency: "NGN", formatted: "NGN 112,000" },
    },
    variants: [
      {
        id: "variant-jacket-l",
        sku: "SN-JKT-BLK-L",
        slug: "sn-command-jacket-black-l",
        title: "SN Command Jacket",
        size: "L",
        color: "Charcoal Gold",
        inventoryQuantity: 5,
        isAvailable: true,
        price: { amount: 112000, currency: "NGN", formatted: "NGN 112,000" },
        attributes: [
          { name: "fit", value: "boxy" },
          { name: "fabric", value: "technical shell" },
        ],
      },
    ],
  },
  {
    id: "sn-field-cap",
    slug: "sn-field-cap",
    title: "SN Field Cap",
    subtitle: "Utility finish",
    badge: "Accessory",
    description:
      "A finishing piece with low-profile structure and a clean tactical insignia.",
    regionAvailability: ["NG"],
    defaultRegion: "NG",
    category: "headwear",
    gender: "unisex",
    media: [
      {
        id: "field-cap-main",
        alt: "Cap product shot",
        type: "image",
        url: "/cap.jpeg",
      },
    ],
    priceRange: {
      min: { amount: 28000, currency: "NGN", formatted: "NGN 28,000" },
      max: { amount: 28000, currency: "NGN", formatted: "NGN 28,000" },
    },
    variants: [
      {
        id: "variant-cap-one-size",
        sku: "SN-CAP-BLK-OS",
        slug: "sn-field-cap-black-os",
        title: "SN Field Cap",
        size: "One Size",
        color: "Black Gold",
        inventoryQuantity: 14,
        isAvailable: true,
        price: { amount: 28000, currency: "NGN", formatted: "NGN 28,000" },
        attributes: [
          { name: "fit", value: "adjustable" },
          { name: "fabric", value: "cotton twill" },
        ],
      },
    ],
  },
];

export const storefrontMock = {
  navigation,
  utilityLinks,
  heroCampaign,
  featuredProducts,
};
