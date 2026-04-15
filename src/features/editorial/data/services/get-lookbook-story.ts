import type { Product } from "@/core/types/commerce";
import { storefrontMock } from "@/mocks/storefront";

import type { LookbookStory } from "@/features/editorial/domain/entities/lookbook-story";

function isProduct(product: Product | undefined): product is Product {
  return Boolean(product);
}

const lookbookStories: LookbookStory[] = [
  {
    slug: "built-like-an-army",
    eyebrow: "Lookbook 01",
    title: "Built Like An Army",
    summary:
      "A disciplined cut of the opening drop, where utility layers, sharp posture, and statement silhouettes move inside one continuous frame.",
    heroMedia: {
      type: "video",
      url: "/hero-runway.mp4",
      posterUrl: "/jacket_with_pant.jpeg",
      alt: "Runway campaign film for the Built Like An Army lookbook",
    },
    chapterLabel: "Drop Narrative",
    campaignStatement: "Street discipline. Runway presence. A release story built to keep its tension from first frame to final look.",
    modules: [
      {
        title: "Frame One",
        body: "The story starts from posture rather than category, so every layer reads as part of the same command language.",
      },
      {
        title: "Layer Order",
        body: "Outerwear sharpens the silhouette, the tracksuit carries the movement, and the finishing pieces keep the line controlled.",
      },
      {
        title: "Inside The Frame",
        body: "Each hotspot lets the viewer step closer to the lead pieces without breaking the mood of the story.",
      },
    ],
    hotspots: [
      {
        id: "hotspot-tracksuit",
        label: "Tracksuit Set",
        productSlug: "sn-tactical-tracksuit-set",
        top: "58%",
        left: "44%",
        note: "The flagship silhouette and core anchor of the drop.",
      },
      {
        id: "hotspot-jacket",
        label: "Command Jacket",
        productSlug: "sn-command-jacket",
        top: "34%",
        left: "58%",
        note: "Adds weight and command structure over the main frame.",
      },
      {
        id: "hotspot-cap",
        label: "Field Cap",
        productSlug: "sn-field-cap",
        top: "15%",
        left: "51%",
        note: "Finishes the look with a clean tactical insignia.",
      },
    ],
  },
];

export async function getLookbookStories() {
  return lookbookStories.map((story) => ({
    ...story,
    linkedProducts: story.hotspots
      .map((hotspot) =>
        storefrontMock.featuredProducts.find((product) => product.slug === hotspot.productSlug),
      )
      .filter(isProduct),
  }));
}

export async function getLookbookStory(slug: string) {
  const story = lookbookStories.find((item) => item.slug === slug);

  if (!story) {
    return null;
  }

  return {
    ...story,
    linkedProducts: story.hotspots
      .map((hotspot) =>
        storefrontMock.featuredProducts.find((product) => product.slug === hotspot.productSlug),
      )
      .filter(isProduct),
  };
}
