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
      "A disciplined edit of the launch drop: utility layers, tactical posture, and product callouts embedded directly into the campaign frame.",
    heroMedia: {
      type: "video",
      url: "/hero-runway.mp4",
      posterUrl: "/jacket_with_pant.jpeg",
      alt: "Runway campaign film for the Built Like An Army lookbook",
    },
    chapterLabel: "Drop Narrative",
    campaignStatement: "Street discipline. Runway presence. Product touchpoints that stay inside the story.",
    modules: [
      {
        title: "Frame One",
        body: "The lookbook starts from posture rather than category: every layer should read as uniform, not just merch.",
      },
      {
        title: "Layer Order",
        body: "Outerwear sharpens the silhouette, the tracksuit carries the movement, and accessories finish the line cleanly.",
      },
      {
        title: "Commerce Hand-off",
        body: "Hotspots are positioned to let the story stay immersive while still giving users a direct route into the PDP.",
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
