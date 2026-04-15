import { StoryBand } from "@/features/editorial/presentation/components/story-band";
import { getHomepageCampaign } from "@/features/hero/data/services/get-homepage-campaign";
import { HeroCampaign } from "@/features/hero/presentation/components/hero-campaign";
import { ProductGrid } from "@/features/product-discovery/presentation/components/product-grid";
import { storefrontMock } from "@/mocks/storefront";

export default async function Home() {
  const campaign = await getHomepageCampaign();

  return (
    <>
      <HeroCampaign campaign={campaign} />
      <ProductGrid
        eyebrow="Opening Drop"
        title="The lead looks of the opening drop."
        description="An authored release edit led by the flagship tracksuit, then sharpened with command outerwear, utility shirting, and the pieces that complete the line."
        products={storefrontMock.featuredProducts}
        featuredProductId="sn-tactical-tracksuit"
      />
      <StoryBand />
    </>
  );
}
