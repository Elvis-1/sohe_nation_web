import type { Metadata } from "next";

import { buildPageMetadata } from "@/core/config/page-metadata";
import { breadcrumbJsonLd } from "@/core/seo/structured-data";
import { Container } from "@/core/ui/container";
import { JsonLd } from "@/core/ui/json-ld";
import {
  landingCrumbs,
  type CatalogLanding,
} from "@/features/product-discovery/data/catalog-landings";
import {
  getCatalogProducts,
  parseCatalogFilters,
  type CatalogFilters as Filters,
  type CatalogResult,
} from "@/features/product-discovery/data/services/get-catalog-products";

import { CatalogFilters } from "./catalog-filters";
import { CatalogResults } from "./catalog-results";

type SearchParams = { [key: string]: string | string[] | undefined };

function formatToken(value: string) {
  return value
    .split("-")
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

function getActiveLabel(filters: Filters, landing: CatalogLanding) {
  if (filters.query) {
    return `Search: ${filters.query}`;
  }
  const extraCategory = !landing.fixed.category && filters.category;
  const extraGender = !landing.fixed.gender && filters.gender;
  if (extraCategory && extraGender) {
    return `${formatToken(filters.gender)} / ${formatToken(filters.category)}`;
  }
  if (extraCategory) {
    return formatToken(filters.category);
  }
  if (extraGender) {
    return `${formatToken(filters.gender)} Selection`;
  }
  return landing.path === "/products" ? "All field-ready pieces" : "The full edit";
}

/**
 * Filtered and sorted views share the landing's canonical URL. Search results are kept out
 * of the index (their links are still followed), as search engines recommend.
 */
export function buildCatalogLandingMetadata(
  landing: CatalogLanding,
  searchParams: SearchParams,
): Metadata {
  const query = parseCatalogFilters(searchParams).query;
  return buildPageMetadata({
    title: query ? `Search: ${query}` : landing.metaTitle,
    description: landing.metaDescription,
    path: landing.path,
    noIndex: Boolean(query),
    follow: true,
  });
}

/** Shared body for `/products`, `/men`, `/women`, and `/collections/<slug>`. */
export async function CatalogLandingView({
  landing,
  searchParams,
}: {
  landing: CatalogLanding;
  searchParams: SearchParams;
}) {
  const filters: Filters = { ...parseCatalogFilters(searchParams), ...landing.fixed };
  let catalog: CatalogResult = {
    products: [],
    total: 0,
    availableFacets: { categories: [], genders: [], sizes: [], priceBands: [] },
    appliedFilters: filters,
  };
  let loadError = false;

  try {
    catalog = await getCatalogProducts(filters);
  } catch {
    loadError = true;
  }

  return (
    <Container className="py-10 md:py-14">
      <JsonLd data={breadcrumbJsonLd(landingCrumbs(landing))} />
      {loadError ? (
        <section className="mb-6 rounded-[1.25rem] border border-[var(--color-border-strong)] bg-black/30 px-5 py-4">
          <p className="font-[family:var(--font-supporting)] text-[10px] uppercase tracking-[0.24em] text-[var(--color-accent-gold-highlight)]">
            Catalog Unavailable
          </p>
          <p className="mt-2 text-sm text-[var(--color-text-secondary)]">
            We could not load the live catalog right now. Please retry in a moment.
          </p>
        </section>
      ) : null}

      <section className="rounded-[2rem] border border-white/8 bg-[linear-gradient(135deg,rgba(26,25,24,0.98),rgba(11,11,11,0.92))] p-6 shadow-[var(--shadow-gold)] md:p-8">
        <p className="font-[family:var(--font-supporting)] text-[10px] uppercase tracking-[0.3em] text-[var(--color-accent-gold-highlight)]">
          {landing.eyebrow}
        </p>
        <div className="mt-4 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-3xl">
            <h1 className="font-[family:var(--font-heading)] text-6xl uppercase leading-[0.9] text-[var(--color-text-primary)] md:text-7xl lg:text-[5.5rem]">
              {landing.heading}
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-8 text-[var(--color-text-secondary)]">
              {landing.intro}
            </p>
          </div>
          <div className="rounded-[1.5rem] border border-white/8 bg-black/20 px-5 py-4 lg:max-w-sm">
            <p className="font-[family:var(--font-supporting)] text-[10px] uppercase tracking-[0.22em] text-[var(--color-text-muted)]">
              Current selection
            </p>
            <p className="mt-3 font-[family:var(--font-heading)] text-4xl uppercase leading-none text-[var(--color-text-primary)]">
              {catalog.total}
            </p>
            <p className="mt-3 text-sm leading-6 text-[var(--color-text-secondary)]">
              A focused edit of field-ready layers, tailored separates, and signature sets.
            </p>
          </div>
        </div>
      </section>

      <div className="mt-8 space-y-8">
        <CatalogFilters
          facets={catalog.availableFacets}
          filters={catalog.appliedFilters}
          hideGenderFilter={Boolean(landing.fixed.gender)}
          hideCategoryFilter={Boolean(landing.fixed.category)}
          basePath={landing.path}
        />
        <CatalogResults
          products={catalog.products}
          total={catalog.total}
          activeLabel={getActiveLabel(catalog.appliedFilters, landing)}
          resetHref={landing.path}
        />
      </div>
    </Container>
  );
}
