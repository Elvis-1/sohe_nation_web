import Link from "next/link";

import type { CatalogResult } from "@/features/product-discovery/data/services/get-catalog-products";

type CatalogFiltersProps = {
  facets: CatalogResult["availableFacets"];
  filters: CatalogResult["appliedFilters"];
  hideGenderFilter?: boolean;
};

function renderOptionLabel(label: string, count: number) {
  return `${label} (${count})`;
}

export function CatalogFilters({
  facets,
  filters,
  hideGenderFilter = false,
}: CatalogFiltersProps) {
  return (
    <form className="rounded-[2rem] border border-[var(--color-border-subtle)] bg-[linear-gradient(180deg,rgba(33,31,28,0.98),rgba(12,12,12,0.98))] p-6" method="GET">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="font-[family:var(--font-supporting)] text-[10px] uppercase tracking-[0.26em] text-[var(--color-accent-gold-highlight)]">
            Discovery Controls
          </p>
          <h2 className="mt-3 font-[family:var(--font-heading)] text-4xl uppercase leading-none text-[var(--color-text-primary)]">
            Filter the line.
          </h2>
        </div>
        <Link
          href="/products"
          className="rounded-full border border-white/10 px-4 py-2 font-[family:var(--font-supporting)] text-[10px] uppercase tracking-[0.24em] text-[var(--color-text-secondary)] transition hover:border-[var(--color-border-strong)] hover:text-[var(--color-text-primary)]"
        >
          Clear All
        </Link>
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-[minmax(0,1.3fr)_repeat(4,minmax(0,1fr))]">
        <label className="grid min-w-0 gap-2">
          <span className="font-[family:var(--font-supporting)] text-[10px] uppercase tracking-[0.22em] text-[var(--color-text-muted)]">
            Search
          </span>
          <input
            type="search"
            name="query"
            defaultValue={filters.query}
            placeholder="Tracksuit, outerwear, utility..."
            className="h-12 rounded-[1rem] border border-white/10 bg-black/25 px-4 text-sm text-[var(--color-text-primary)] outline-none transition placeholder:text-[var(--color-text-muted)] focus:border-[var(--color-border-strong)]"
          />
        </label>

        <label className="grid min-w-0 gap-2">
          <span className="font-[family:var(--font-supporting)] text-[10px] uppercase tracking-[0.22em] text-[var(--color-text-muted)]">
            Category
          </span>
          <select
            name="category"
            defaultValue={filters.category}
            className="h-12 rounded-[1rem] border border-white/10 bg-black/25 px-4 text-sm text-[var(--color-text-primary)] outline-none transition focus:border-[var(--color-border-strong)]"
          >
            <option value="">All categories</option>
            {facets.categories.map((facet) => (
              <option key={facet.value} value={facet.value}>
                {renderOptionLabel(facet.label, facet.count)}
              </option>
            ))}
          </select>
        </label>

        {hideGenderFilter ? null : (
          <label className="grid min-w-0 gap-2">
            <span className="font-[family:var(--font-supporting)] text-[10px] uppercase tracking-[0.22em] text-[var(--color-text-muted)]">
              Gender
            </span>
            <select
              name="gender"
              defaultValue={filters.gender}
              className="h-12 rounded-[1rem] border border-white/10 bg-black/25 px-4 text-sm text-[var(--color-text-primary)] outline-none transition focus:border-[var(--color-border-strong)]"
            >
              <option value="">All fits</option>
              {facets.genders.map((facet) => (
                <option key={facet.value} value={facet.value}>
                  {renderOptionLabel(facet.label, facet.count)}
                </option>
              ))}
            </select>
          </label>
        )}

        <label className="grid min-w-0 gap-2">
          <span className="font-[family:var(--font-supporting)] text-[10px] uppercase tracking-[0.22em] text-[var(--color-text-muted)]">
            Size
          </span>
          <select
            name="size"
            defaultValue={filters.size}
            className="h-12 rounded-[1rem] border border-white/10 bg-black/25 px-4 text-sm text-[var(--color-text-primary)] outline-none transition focus:border-[var(--color-border-strong)]"
          >
            <option value="">All sizes</option>
            {facets.sizes.map((facet) => (
              <option key={facet.value} value={facet.value}>
                {renderOptionLabel(facet.label, facet.count)}
              </option>
            ))}
          </select>
        </label>

        <label className="grid min-w-0 gap-2">
          <span className="font-[family:var(--font-supporting)] text-[10px] uppercase tracking-[0.22em] text-[var(--color-text-muted)]">
            Price
          </span>
          <select
            name="price"
            defaultValue={filters.price}
            className="h-12 rounded-[1rem] border border-white/10 bg-black/25 px-4 text-sm text-[var(--color-text-primary)] outline-none transition focus:border-[var(--color-border-strong)]"
          >
            <option value="">All pricing</option>
            {facets.priceBands.map((facet) => (
              <option key={facet.value} value={facet.value}>
                {renderOptionLabel(facet.label, facet.count)}
              </option>
            ))}
          </select>
        </label>
      </div>

      <div className="mt-5 flex flex-col gap-4 border-t border-white/8 pt-5 sm:flex-row sm:items-end sm:justify-between">
        <label className="grid min-w-0 gap-2 sm:min-w-52">
          <span className="font-[family:var(--font-supporting)] text-[10px] uppercase tracking-[0.22em] text-[var(--color-text-muted)]">
            Sort
          </span>
          <select
            name="sort"
            defaultValue={filters.sort}
            className="h-11 min-w-52 rounded-full border border-white/10 bg-black/25 px-4 text-sm text-[var(--color-text-primary)] outline-none transition focus:border-[var(--color-border-strong)]"
          >
            <option value="featured">Featured</option>
            <option value="price-asc">Price: Low to high</option>
            <option value="price-desc">Price: High to low</option>
            <option value="title">Title: A to Z</option>
          </select>
        </label>
        <div className="flex flex-wrap gap-3">
          <button
            type="submit"
            className="h-11 rounded-full bg-[var(--color-accent-gold)] px-5 font-[family:var(--font-supporting)] text-[10px] uppercase tracking-[0.24em] text-black transition hover:bg-[var(--color-accent-gold-highlight)]"
          >
            Apply Filters
          </button>
        </div>
      </div>
    </form>
  );
}
