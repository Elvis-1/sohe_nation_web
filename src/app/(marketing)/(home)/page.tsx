import type { Metadata } from "next";
import Link from "next/link";
import { connection } from "next/server";

import { HttpError } from "@/core/api/http-client";
import { buildPageMetadata } from "@/core/config/page-metadata";
import { SITE_DESCRIPTION, SITE_NAME } from "@/core/config/site";
import { organizationJsonLd, websiteJsonLd } from "@/core/seo/structured-data";
import { Container } from "@/core/ui/container";
import { JsonLd } from "@/core/ui/json-ld";
import { getHomepageContent } from "@/features/hero/data/services/get-homepage-campaign";
import { HeroCampaign } from "@/features/hero/presentation/components/hero-campaign";
import { ProductGrid } from "@/features/product-discovery/presentation/components/product-grid";
import { getStorefrontSettings } from "@/features/settings/data/services/get-storefront-settings";

export const metadata: Metadata = buildPageMetadata({
  title: `${SITE_NAME} | Premium Tactical Streetwear, Built Like An Army`,
  absoluteTitle: true,
  description: SITE_DESCRIPTION,
  path: "/",
});

// Shown to shoppers when the campaign cannot load. Staff-facing causes (an unpublished
// homepage record, an unreachable API) are logged server-side, never shown here.
function HomepageFallback({ headline }: { headline: string }) {
  return (
    <section className="py-16 md:py-24">
      <Container>
        <div className="rounded-[2rem] border border-[var(--color-border-subtle)] bg-[linear-gradient(180deg,rgba(30,27,23,0.92),rgba(12,12,12,0.98))] p-8 md:p-12">
          <p className="font-[family:var(--font-supporting)] text-xs uppercase tracking-[0.3em] text-[var(--color-accent-gold-highlight)]">
            {SITE_NAME}
          </p>
          <h1 className="mt-5 font-[family:var(--font-heading)] text-5xl uppercase leading-[0.92] text-[var(--color-text-primary)] md:text-7xl">
            {headline}
          </h1>
          <p className="mt-6 max-w-2xl text-base leading-8 text-[var(--color-text-secondary)]">
            The full line is still open while the next campaign loads.
          </p>
          <Link
            href="/products"
            className="mt-8 inline-flex rounded-full bg-[var(--color-accent-gold)] px-6 py-4 font-[family:var(--font-supporting)] text-xs uppercase tracking-[0.24em] text-black transition hover:bg-[var(--color-accent-gold-highlight)]"
          >
            Shop the line
          </Link>
        </div>
      </Container>
    </section>
  );
}

async function OrganizationData() {
  const settings = await getStorefrontSettings();
  return (
    <JsonLd
      data={[
        organizationJsonLd({
          supportEmail: settings.supportEmail,
          socialUrls: settings.socialLinks.map((link) => link.url),
        }),
        websiteJsonLd(),
      ]}
    />
  );
}

export default async function Home() {
  // Render per request (content itself is cached briefly; see core/api/cache.ts).
  await connection();
  try {
    const homepage = await getHomepageContent();

    return (
      <>
        <OrganizationData />
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
      console.error("[home] No published homepage content record.");
      return <HomepageFallback headline="The next drop is being staged." />;
    }
    if (error instanceof TypeError) {
      console.error("[home] Content API unreachable:", error);
      return <HomepageFallback headline="We'll be right back." />;
    }
    throw error;
  }
}
