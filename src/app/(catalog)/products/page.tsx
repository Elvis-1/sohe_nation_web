import { Container } from "@/core/ui/container";
import {
  getCatalogProducts,
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
  if (query) {
    return `Search: ${query}`;
  }

  if (category && gender) {
    return `${gender} / ${category}`;
  }

  if (category) {
    return category;
  }

  if (gender) {
    return `${gender} selection`;
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
  const catalog = await getCatalogProducts(filters);

  return (
    <Container className="py-10 md:py-14">
      <section className="rounded-[2rem] border border-white/8 bg-[linear-gradient(135deg,rgba(26,25,24,0.98),rgba(11,11,11,0.92))] p-6 shadow-[var(--shadow-gold)] md:p-8">
        <p className="font-[family:var(--font-supporting)] text-[10px] uppercase tracking-[0.3em] text-[var(--color-accent-gold-highlight)]">
          Product Discovery
        </p>
        <div className="mt-4 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-3xl">
            <h1 className="font-[family:var(--font-heading)] text-6xl uppercase leading-[0.9] text-[var(--color-text-primary)] md:text-7xl lg:text-[5.5rem]">
              Command the catalog.
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-8 text-[var(--color-text-secondary)]">
              This route now runs as a true discovery surface: fixture-backed filters, URL state,
              server-rendered query handling, and a quick-view layer ready for cart wiring next.
            </p>
          </div>
          <div className="grid gap-3 sm:grid-cols-3">
            <div className="rounded-[1.25rem] border border-white/8 bg-black/20 p-4">
              <p className="font-[family:var(--font-supporting)] text-[10px] uppercase tracking-[0.22em] text-[var(--color-text-muted)]">
                Active styles
              </p>
              <p className="mt-3 font-[family:var(--font-heading)] text-3xl uppercase leading-none text-[var(--color-text-primary)]">
                {catalog.total}
              </p>
            </div>
            <div className="rounded-[1.25rem] border border-white/8 bg-black/20 p-4">
              <p className="font-[family:var(--font-supporting)] text-[10px] uppercase tracking-[0.22em] text-[var(--color-text-muted)]">
                Filters
              </p>
              <p className="mt-3 font-[family:var(--font-heading)] text-3xl uppercase leading-none text-[var(--color-text-primary)]">
                URL-led
              </p>
            </div>
            <div className="rounded-[1.25rem] border border-white/8 bg-black/20 p-4">
              <p className="font-[family:var(--font-supporting)] text-[10px] uppercase tracking-[0.22em] text-[var(--color-text-muted)]">
                Quick view
              </p>
              <p className="mt-3 font-[family:var(--font-heading)] text-3xl uppercase leading-none text-[var(--color-text-primary)]">
                Live
              </p>
            </div>
          </div>
        </div>
      </section>

      <div className="mt-8 grid gap-8 xl:grid-cols-[24rem_minmax(0,1fr)]">
        <CatalogFilters facets={catalog.availableFacets} filters={catalog.appliedFilters} />
        <CatalogResults
          products={catalog.products}
          total={catalog.total}
          activeLabel={getActiveLabel(catalog.appliedFilters)}
        />
      </div>
    </Container>
  );
}
