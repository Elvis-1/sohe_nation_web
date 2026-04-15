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
        title="The first uniform of the season."
        description="A tight edit of command jackets, sharp shirting, tactical trousers, and the flagship tracksuit set that defines the release."
        products={storefrontMock.featuredProducts}
      />
      <StoryBand />
    </>
  );
}
