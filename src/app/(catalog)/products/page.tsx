import { Container } from "@/core/ui/container";
import {
  getCatalogProducts,
  type CatalogResult,
  parseCatalogFilters,
} from "@/features/product-discovery/data/services/get-catalog-products";
import { CatalogFilters } from "@/features/product-discovery/presentation/components/catalog-filters";
import { CatalogResults } from "@/features/product-discovery/presentation/components/catalog-results";

function getActiveLabel({
  category,
  gender,
  query,
}: {
  category: string;
  gender: string;
  query: string;
}) {
  const formatToken = (value: string) =>
    value
      .split("-")
      .filter(Boolean)
      .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
      .join(" ");

  if (query) {
    return `Search: ${query}`;
  }

  if (category && gender) {
    return `${formatToken(gender)} / ${formatToken(category)}`;
  }

  if (category) {
    return formatToken(category);
  }

  if (gender) {
    return `${formatToken(gender)} Selection`;
  }

  return "All field-ready pieces";
}

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const resolvedSearchParams = await searchParams;
  const filters = parseCatalogFilters(resolvedSearchParams);
  let catalog: CatalogResult = {
    products: [],
    total: 0,
    availableFacets: {
      categories: [],
      genders: [],
      sizes: [],
      priceBands: [],
    },
    appliedFilters: filters,
  };
  let loadError = "";

  try {
    catalog = await getCatalogProducts(filters);
  } catch (error) {
    loadError =
      error instanceof Error
        ? error.message
        : "Unable to load product catalog right now.";
  }

  const hideGenderFilter = filters.gender === "men" || filters.gender === "women";

  return (
    <Container className="py-10 md:py-14">
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
          The Line
        </p>
        <div className="mt-4 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-3xl">
            <h1 className="font-[family:var(--font-heading)] text-6xl uppercase leading-[0.9] text-[var(--color-text-primary)] md:text-7xl lg:text-[5.5rem]">
              Uniforms for the street.
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-8 text-[var(--color-text-secondary)]">
              Move through the current selection with a sharper lens. Start with the silhouettes
              that fit the moment, then narrow by category, size, and price without losing the
              editorial tone of the drop.
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
          hideGenderFilter={hideGenderFilter}
        />
        <CatalogResults
          products={catalog.products}
          total={catalog.total}
          activeLabel={getActiveLabel(catalog.appliedFilters)}
        />
      </div>
    </Container>
  );
}
