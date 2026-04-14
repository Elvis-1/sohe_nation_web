import { StoryBand } from "@/features/editorial/presentation/components/story-band";
import { HeroCampaign } from "@/features/hero/presentation/components/hero-campaign";
import { ProductGrid } from "@/features/product-discovery/presentation/components/product-grid";
import { SiteFooter } from "@/features/navigation/presentation/components/site-footer";
import { SiteHeader } from "@/features/navigation/presentation/components/site-header";
import { storefrontMock } from "@/mocks/storefront";

export default function Home() {
  return (
    <>
      <SiteHeader
        navigation={storefrontMock.navigation}
        utilityLinks={storefrontMock.utilityLinks}
      />
      <main className="flex-1">
        <HeroCampaign campaign={storefrontMock.heroCampaign} />
        <ProductGrid
          eyebrow="Latest Drop"
          title="Built to move. Styled to hold the line."
          description="A launch rail shaped like a campaign landing, with hardwearing fits, sharp silhouettes, and layered utility pieces."
          products={storefrontMock.featuredProducts}
        />
        <StoryBand />
      </main>
      <SiteFooter />
    </>
  );
}
