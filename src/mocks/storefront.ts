import type {
  HeroCampaign,
  NavigationItem,
  Product,
} from "@/core/types/commerce";

const navigation: NavigationItem[] = [
  { label: "New Drop", href: "/" },
  { label: "Men's Line", href: "/products?gender=men" },
  { label: "Women's Line", href: "/products?gender=women" },
  { label: "Uniform Edit", href: "/products" },
  { label: "Stories", href: "/stories" },
];

const utilityLinks: NavigationItem[] = [
  { label: "Shop", href: "/products" },
  { label: "Lookbook", href: "/stories" },
  { label: "Flagship", href: "/products/sn-tactical-tracksuit-set" },
];

const heroCampaign: HeroCampaign = {
  eyebrow: "Campaign 01",
  title: "Built Like An Army",
  statement: "Street discipline. Runway presence.",
  description:
    "A commanding first release from Sohe's Nation: tactical layers, sharp tailoring, and statement silhouettes built to hold the whole frame.",
  primaryCta: { label: "Shop The Drop", href: "/products" },
  secondaryCta: { label: "Enter The Story", href: "/stories/built-like-an-army" },
  campaignStats: [
    { label: "Looks In Drop", value: "12" },
    { label: "Lead Story", value: "01" },
    { label: "Checkout Options", value: "02" },
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
      {
        id: "tracksuit-detail-jacket",
        alt: "Tracksuit jacket detail view",
        type: "image",
        url: "/jacket_with_pant.jpeg",
      },
      {
        id: "tracksuit-runway-motion",
        alt: "Tracksuit runway motion clip",
        type: "video",
        url: "/hero-runway.mp4",
        posterUrl: "/hoodle_with_pant.jpeg",
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
      {
        id: "command-jacket-alt",
        alt: "Command jacket alternate angle",
        type: "image",
        url: "/jacket_2.jpeg",
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
    id: "sn-vanguard-shirt",
    slug: "sn-vanguard-shirt",
    title: "SN Vanguard Shirt",
    subtitle: "Structured essential",
    badge: "Uniform Core",
    description:
      "A sharp everyday layer with clean collar framing, disciplined lines, and soft tactical weight.",
    regionAvailability: ["NG", "US"],
    defaultRegion: "NG",
    category: "tops",
    gender: "men",
    media: [
      {
        id: "vanguard-shirt-main",
        alt: "Shirt product shot",
        type: "image",
        url: "/shirt.jpeg",
      },
    ],
    priceRange: {
      min: { amount: 56000, currency: "NGN", formatted: "NGN 56,000" },
      max: { amount: 56000, currency: "NGN", formatted: "NGN 56,000" },
    },
    variants: [
      {
        id: "variant-shirt-m",
        sku: "SN-SHRT-BLK-M",
        slug: "sn-vanguard-shirt-black-m",
        title: "SN Vanguard Shirt",
        size: "M",
        color: "Black Sand",
        inventoryQuantity: 12,
        isAvailable: true,
        price: { amount: 56000, currency: "NGN", formatted: "NGN 56,000" },
        attributes: [
          { name: "fit", value: "tailored" },
          { name: "fabric", value: "cotton sateen" },
        ],
      },
      {
        id: "variant-shirt-l",
        sku: "SN-SHRT-BLK-L",
        slug: "sn-vanguard-shirt-black-l",
        title: "SN Vanguard Shirt",
        size: "L",
        color: "Black Sand",
        inventoryQuantity: 7,
        isAvailable: true,
        price: { amount: 56000, currency: "NGN", formatted: "NGN 56,000" },
        attributes: [
          { name: "fit", value: "tailored" },
          { name: "fabric", value: "cotton sateen" },
        ],
      },
    ],
  },
  {
    id: "sn-command-pant",
    slug: "sn-command-pant",
    title: "SN Command Pant",
    subtitle: "Movement-first base",
    badge: "Field Ready",
    description:
      "Relaxed tactical trousers with refined drape and enough structure to carry a full command look.",
    regionAvailability: ["NG", "US"],
    defaultRegion: "NG",
    category: "bottoms",
    gender: "women",
    media: [
      {
        id: "command-pant-main",
        alt: "Pant product shot",
        type: "image",
        url: "/ladies_pant1.jpeg",
      },
    ],
    priceRange: {
      min: { amount: 64000, currency: "NGN", formatted: "NGN 64,000" },
      max: { amount: 64000, currency: "NGN", formatted: "NGN 64,000" },
    },
    variants: [
      {
        id: "variant-pant-s",
        sku: "SN-PANT-OLV-S",
        slug: "sn-command-pant-olive-s",
        title: "SN Command Pant",
        size: "S",
        color: "Olive Gold",
        inventoryQuantity: 11,
        isAvailable: true,
        price: { amount: 64000, currency: "NGN", formatted: "NGN 64,000" },
        attributes: [
          { name: "fit", value: "relaxed" },
          { name: "fabric", value: "utility twill" },
        ],
      },
      {
        id: "variant-pant-m",
        sku: "SN-PANT-OLV-M",
        slug: "sn-command-pant-olive-m",
        title: "SN Command Pant",
        size: "M",
        color: "Olive Gold",
        inventoryQuantity: 9,
        isAvailable: true,
        price: { amount: 64000, currency: "NGN", formatted: "NGN 64,000" },
        attributes: [
          { name: "fit", value: "relaxed" },
          { name: "fabric", value: "utility twill" },
        ],
      },
    ],
  },
  {
    id: "sn-swelter-overall",
    slug: "sn-swelter-overall",
    title: "SN Swelter Overall",
    subtitle: "Statement one-piece",
    badge: "Editorial Pick",
    description:
      "A runway-shaped overall that brings the brand posture forward with utility seams and bold volume.",
    regionAvailability: ["NG"],
    defaultRegion: "NG",
    category: "bottoms",
    gender: "women",
    media: [
      {
        id: "swelter-overall-main",
        alt: "Overall product shot",
        type: "image",
        url: "/overal.jpeg",
      },
    ],
    priceRange: {
      min: { amount: 92000, currency: "NGN", formatted: "NGN 92,000" },
      max: { amount: 92000, currency: "NGN", formatted: "NGN 92,000" },
    },
    variants: [
      {
        id: "variant-overall-s",
        sku: "SN-OVR-BLK-S",
        slug: "sn-swelter-overall-black-s",
        title: "SN Swelter Overall",
        size: "S",
        color: "Black Gold",
        inventoryQuantity: 6,
        isAvailable: true,
        price: { amount: 92000, currency: "NGN", formatted: "NGN 92,000" },
        attributes: [
          { name: "fit", value: "wide-leg" },
          { name: "fabric", value: "performance blend" },
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
  {
    id: "sn-swelter-jacket",
    slug: "sn-swelter-jacket",
    title: "SN Swelter Jacket",
    subtitle: "Cold-front layer",
    badge: "Outerwear",
    description:
      "A padded command jacket with oversized proportion, matte texture, and a polished campaign finish.",
    regionAvailability: ["NG", "GB"],
    defaultRegion: "NG",
    category: "outerwear",
    gender: "women",
    media: [
      {
        id: "swelter-jacket-main",
        alt: "Puffer jacket product shot",
        type: "image",
        url: "/swelter.jpeg",
      },
      {
        id: "swelter-jacket-alt",
        alt: "Puffer jacket alternate angle",
        type: "image",
        url: "/swelter2.jpeg",
      },
    ],
    priceRange: {
      min: { amount: 146000, currency: "NGN", formatted: "NGN 146,000" },
      max: { amount: 146000, currency: "NGN", formatted: "NGN 146,000" },
    },
    variants: [
      {
        id: "variant-swelter-jacket-m",
        sku: "SN-SWJ-CRM-M",
        slug: "sn-swelter-jacket-cream-m",
        title: "SN Swelter Jacket",
        size: "M",
        color: "Ash Gold",
        inventoryQuantity: 4,
        isAvailable: true,
        price: { amount: 146000, currency: "NGN", formatted: "NGN 146,000" },
        attributes: [
          { name: "fit", value: "oversized" },
          { name: "fabric", value: "technical quilt" },
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
