import { storefrontMock } from "@/mocks/storefront";

import type { ProductDetail } from "@/features/product-detail/domain/entities/product-detail";

const productNarratives: Record<
  string,
  Omit<ProductDetail, "product" | "relatedProducts">
> = {
  "sn-tactical-tracksuit-set": {
    campaignNote:
      "The flagship look is designed to read like a full campaign frame: disciplined structure up top, fluid movement below, and enough polish to travel from streetwear to statement styling.",
    fitGuidance:
      "Regular through the torso with room to layer. Choose your normal size for a composed silhouette, or size up once if you want a looser runway stance.",
    materialStory:
      "Built in a dense performance knit that keeps its shape through repeat wear while maintaining enough stretch for movement-heavy styling.",
    sustainabilityNote:
      "Fixture note for Phase 3: this PDP is already structured to receive verified sourcing and fabric-composition data from the future Django content model.",
    deliveryNote:
      "Primary launch market is Nigeria, with region-ready contract support already in place for broader fulfillment later.",
    lookbookMoments: [
      {
        title: "Look 01",
        body: "Pair the full set with the SN Field Cap for a sharp campaign-uniform silhouette.",
      },
      {
        title: "Look 02",
        body: "Layer the Command Jacket over the tracksuit when the styling needs more weight and edge.",
      },
      {
        title: "Look 03",
        body: "Strip back to the trouser and keep the top crisp for a more editorial day-to-night read.",
      },
    ],
  },
  "sn-command-jacket": {
    campaignNote:
      "This jacket is the anchor layer in the drop: the piece that sharpens softer silhouettes and gives the full look a command posture.",
    fitGuidance:
      "Boxy in shape with deliberate structure through the shoulder. Stay true to size for the intended silhouette.",
    materialStory:
      "Technical shell finish with enough body to hold shape cleanly across movement, flash, and editorial shooting conditions.",
    sustainabilityNote:
      "Content slot reserved for certified fabric origin and care guidance once the backend content model is live.",
    deliveryNote:
      "Domestic fulfillment is prioritized for v1, with product contracts already carrying region and currency data for expansion.",
    lookbookMoments: [
      {
        title: "Layered Discipline",
        body: "Throw it over the Tactical Tracksuit Set to turn the core look into a stronger outerwear statement.",
      },
      {
        title: "Uniform Balance",
        body: "Use it as the top layer over the Vanguard Shirt and Command Pant for a sharper split-look setup.",
      },
    ],
  },
};

function buildFallbackNarrative(slug: string): Omit<ProductDetail, "product" | "relatedProducts"> {
  return {
    campaignNote:
      "This product page is shaped to read like a campaign editorial: a clean buying path layered with story, utility, and future content-system hooks.",
    fitGuidance:
      "Fit details are fixture-backed for now and will be tightened once final merchandising specs land from the product sheet.",
    materialStory:
      "Material notes are structured as content fields so they can be replaced later with verified production data.",
    sustainabilityNote:
      `Sustainability and sourcing copy for ${slug} is currently placeholder content, ready for later contract wiring.`,
    deliveryNote:
      "Launch fulfillment remains primary-market-first, with regional expansion planned through the existing contract model.",
    lookbookMoments: [
      {
        title: "Campaign Styling",
        body: "Style this piece into the wider drop with sharp layering, tonal accessories, and a disciplined silhouette.",
      },
      {
        title: "Editorial Use",
        body: "Use the PDP story blocks as a modular content surface once the content API arrives.",
      },
    ],
  };
}

export async function getProductDetail(slug: string): Promise<ProductDetail | null> {
  const product = storefrontMock.featuredProducts.find((item) => item.slug === slug);

  if (!product) {
    return null;
  }

  const narrative = productNarratives[slug] ?? buildFallbackNarrative(slug);
  const relatedProducts = storefrontMock.featuredProducts
    .filter((item) => item.slug !== slug)
    .filter(
      (item) =>
        item.category === product.category ||
        item.gender === product.gender ||
        item.badge === product.badge,
    )
    .slice(0, 3);

  return {
    product,
    relatedProducts,
    ...narrative,
  };
}
