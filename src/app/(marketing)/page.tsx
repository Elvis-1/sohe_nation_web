import { HttpError } from "@/core/api/http-client";
import { Container } from "@/core/ui/container";
import { getHomepageContent } from "@/features/hero/data/services/get-homepage-campaign";
import { HeroCampaign } from "@/features/hero/presentation/components/hero-campaign";
import { ProductGrid } from "@/features/product-discovery/presentation/components/product-grid";

export const dynamic = "force-dynamic";

function UnpublishedHomepageState() {
  return (
    <section className="py-16 md:py-24">
      <Container>
        <div className="rounded-[2rem] border border-[var(--color-border-subtle)] bg-[linear-gradient(180deg,rgba(30,27,23,0.92),rgba(12,12,12,0.98))] p-8 md:p-12">
          <p className="font-[family:var(--font-supporting)] text-xs uppercase tracking-[0.3em] text-[var(--color-accent-gold-highlight)]">
            Homepage Unavailable
          </p>
          <h1 className="mt-5 font-[family:var(--font-heading)] text-5xl uppercase leading-[0.92] text-[var(--color-text-primary)] md:text-7xl">
            No published homepage is live right now.
          </h1>
          <p className="mt-6 max-w-2xl text-base leading-8 text-[var(--color-text-secondary)]">
            The content API is reachable, but the current homepage record is not in the published
            state. Publish the homepage content in the dashboard to make the storefront campaign
            live again.
          </p>
        </div>
      </Container>
    </section>
  );
}

function ApiUnavailableState() {
  return (
    <section className="py-16 md:py-24">
      <Container>
        <div className="rounded-[2rem] border border-[var(--color-border-subtle)] bg-[linear-gradient(180deg,rgba(30,27,23,0.92),rgba(12,12,12,0.98))] p-8 md:p-12">
          <p className="font-[family:var(--font-supporting)] text-xs uppercase tracking-[0.3em] text-[var(--color-accent-gold-highlight)]">
            API Unreachable
          </p>
          <h1 className="mt-5 font-[family:var(--font-heading)] text-5xl uppercase leading-[0.92] text-[var(--color-text-primary)] md:text-7xl">
            Storefront backend is not reachable right now.
          </h1>
          <p className="mt-6 max-w-2xl text-base leading-8 text-[var(--color-text-secondary)]">
            Confirm the API is running and that <code>API_INTERNAL_BASE_URL</code> (server) and{" "}
            <code>NEXT_PUBLIC_API_BASE_URL</code> (browser) point to the correct backend URLs.
          </p>
        </div>
      </Container>
    </section>
  );
}

export default async function Home() {
  try {
    const homepage = await getHomepageContent();

    return (
      <>
        <HeroCampaign campaign={homepage.campaign} />
        <ProductGrid
          eyebrow="Opening Drop"
          title="The lead looks of the opening drop."
          description="An authored release edit led by the flagship looks, then sharpened with the supporting pieces that complete the line."
          products={homepage.featuredProducts}
          featuredProductId={homepage.featuredProducts[0]?.id}
        />
      </>
    );
  } catch (error) {
    if (error instanceof HttpError && error.status === 404) {
      return <UnpublishedHomepageState />;
    }
    if (error instanceof TypeError) {
      return <ApiUnavailableState />;
    }
    throw error;
  }
}
