"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

import type { Product } from "@/core/types/commerce";

import { QuickViewModal } from "./quick-view-modal";

export function CatalogResults({
  products,
  total,
  activeLabel,
}: {
  products: Product[];
  total: number;
  activeLabel: string;
}) {
  const [activeProduct, setActiveProduct] = useState<Product | null>(null);

  return (
    <>
      <section>
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="font-[family:var(--font-supporting)] text-[10px] uppercase tracking-[0.28em] text-[var(--color-accent-gold-highlight)]">
              Catalog Results
            </p>
            <h2 className="mt-3 font-[family:var(--font-heading)] text-5xl uppercase leading-none text-[var(--color-text-primary)]">
              {activeLabel}
            </h2>
          </div>
          <div className="rounded-full border border-white/10 px-4 py-2 font-[family:var(--font-supporting)] text-[10px] uppercase tracking-[0.24em] text-[var(--color-text-secondary)]">
            {total} styles ready
          </div>
        </div>

        {products.length ? (
          <div className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {products.map((product) => (
              <article
                key={product.id}
                className="group overflow-hidden rounded-[1.75rem] border border-white/8 bg-[linear-gradient(180deg,rgba(33,31,28,0.98),rgba(18,18,18,0.96))]"
              >
                <div className="relative aspect-[4/4.5] overflow-hidden">
                  <Image
                    src={product.media[0].url}
                    alt={product.media[0].alt}
                    fill
                    className="object-cover transition duration-700 group-hover:scale-[1.04]"
                  />
                  <div className="absolute inset-0 bg-[linear-gradient(180deg,transparent,rgba(0,0,0,0.7))]" />
                  <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-4 p-4">
                    <div>
                      <p className="font-[family:var(--font-supporting)] text-[10px] uppercase tracking-[0.22em] text-[var(--color-text-muted)]">
                        {product.subtitle}
                      </p>
                      <p className="mt-2 font-[family:var(--font-heading)] text-3xl uppercase leading-none text-[var(--color-text-primary)]">
                        {product.title}
                      </p>
                    </div>
                    <div className="rounded-full border border-white/10 bg-black/35 px-3 py-2 font-[family:var(--font-supporting)] text-[10px] uppercase tracking-[0.22em] text-[var(--color-accent-gold-highlight)]">
                      {product.priceRange.min.formatted}
                    </div>
                  </div>
                </div>
                <div className="space-y-5 p-5">
                  <p className="text-sm leading-7 text-[var(--color-text-secondary)]">
                    {product.description}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {[...new Set(product.variants.map((variant) => variant.size))].map((size) => (
                      <div
                        key={size}
                        className="rounded-full border border-white/8 px-3 py-2 font-[family:var(--font-supporting)] text-[10px] uppercase tracking-[0.22em] text-[var(--color-text-muted)]"
                      >
                        {size}
                      </div>
                    ))}
                  </div>
                  <div className="flex flex-wrap gap-3">
                    <button
                      type="button"
                      onClick={() => setActiveProduct(product)}
                      className="rounded-full bg-[var(--color-accent-gold)] px-4 py-3 font-[family:var(--font-supporting)] text-[10px] uppercase tracking-[0.24em] text-black transition hover:bg-[var(--color-accent-gold-highlight)]"
                    >
                      Quick View
                    </button>
                    <Link
                      href={`/products/${product.slug}`}
                      className="rounded-full border border-white/10 px-4 py-3 font-[family:var(--font-supporting)] text-[10px] uppercase tracking-[0.24em] text-[var(--color-text-primary)] transition hover:border-[var(--color-border-strong)]"
                    >
                      View Product
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="mt-8 rounded-[2rem] border border-[var(--color-border-subtle)] bg-[linear-gradient(180deg,rgba(29,27,24,0.98),rgba(8,8,8,0.96))] p-8">
            <p className="font-[family:var(--font-supporting)] text-[10px] uppercase tracking-[0.28em] text-[var(--color-accent-gold-highlight)]">
              No matches
            </p>
            <h3 className="mt-4 font-[family:var(--font-heading)] text-4xl uppercase leading-none text-[var(--color-text-primary)]">
              Nothing holds this filter line yet.
            </h3>
            <p className="mt-4 max-w-xl text-sm leading-7 text-[var(--color-text-secondary)]">
              Clear one or two filters and the fixture catalog will widen again. This route is already wired for URL-driven discovery, so later API integration can keep the same search shape.
            </p>
            <Link
              href="/products"
              className="mt-6 inline-flex rounded-full border border-white/10 px-4 py-3 font-[family:var(--font-supporting)] text-[10px] uppercase tracking-[0.24em] text-[var(--color-text-primary)] transition hover:border-[var(--color-border-strong)]"
            >
              Reset Catalog
            </Link>
          </div>
        )}
      </section>

      {activeProduct ? (
        <QuickViewModal product={activeProduct} onClose={() => setActiveProduct(null)} />
      ) : null}
    </>
  );
}
