"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect } from "react";
import { useState } from "react";

import type { Product } from "@/core/types/commerce";
import { useCart } from "@/features/cart-and-checkout/presentation/state/cart-provider";

export function QuickViewModal({
  product,
  onClose,
}: {
  product: Product;
  onClose: () => void;
}) {
  const [hasAdded, setHasAdded] = useState(false);
  const { addItem } = useCart();

  useEffect(() => {
    function handleEscape(event: KeyboardEvent) {
      if (event.key === "Escape") {
        onClose();
      }
    }

    window.addEventListener("keydown", handleEscape);

    return () => window.removeEventListener("keydown", handleEscape);
  }, [onClose]);

  function handleAddToBag() {
    const variant = product.variants[0];

    if (!variant) {
      return;
    }

    addItem({
      product,
      variantId: variant.id,
      quantity: 1,
    });
    setHasAdded(true);
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/70 p-4 backdrop-blur-sm md:items-center">
      <button
        type="button"
        aria-label="Close quick view"
        className="absolute inset-0 cursor-default"
        onClick={onClose}
      />
      <div className="relative z-10 grid w-full max-w-5xl gap-0 overflow-hidden rounded-[2rem] border border-[var(--color-border-subtle)] bg-[linear-gradient(180deg,rgba(30,28,25,0.98),rgba(10,10,10,0.98))] shadow-[var(--shadow-gold)] md:grid-cols-[0.9fr_1.1fr]">
        <div className="relative min-h-80">
          <Image
            src={product.media[0].url}
            alt={product.media[0].alt}
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 bg-[linear-gradient(180deg,transparent,rgba(0,0,0,0.7))]" />
          {product.badge ? (
            <div className="absolute left-5 top-5 rounded-full border border-[var(--color-border-strong)] bg-black/45 px-3 py-2 font-[family:var(--font-supporting)] text-[10px] uppercase tracking-[0.22em] text-[var(--color-accent-gold-highlight)]">
              {product.badge}
            </div>
          ) : null}
        </div>

        <div className="p-6 md:p-8">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="font-[family:var(--font-supporting)] text-[10px] uppercase tracking-[0.24em] text-[var(--color-text-muted)]">
                {product.subtitle}
              </p>
              <h3 className="mt-3 font-[family:var(--font-heading)] text-5xl uppercase leading-none text-[var(--color-text-primary)]">
                {product.title}
              </h3>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="rounded-full border border-white/10 px-3 py-2 font-[family:var(--font-supporting)] text-[10px] uppercase tracking-[0.24em] text-[var(--color-text-secondary)] transition hover:border-[var(--color-border-strong)] hover:text-[var(--color-text-primary)]"
            >
              Close
            </button>
          </div>

          <p className="mt-5 max-w-xl text-base leading-7 text-[var(--color-text-secondary)]">
            {product.description}
          </p>

          <div className="mt-6 grid gap-4 sm:grid-cols-3">
            <div className="rounded-[1.25rem] border border-white/8 bg-black/20 p-4">
              <p className="font-[family:var(--font-supporting)] text-[10px] uppercase tracking-[0.22em] text-[var(--color-text-muted)]">
                Starting price
              </p>
              <p className="mt-3 font-[family:var(--font-heading)] text-3xl uppercase leading-none text-[var(--color-text-primary)]">
                {product.priceRange.min.formatted}
              </p>
            </div>
            <div className="rounded-[1.25rem] border border-white/8 bg-black/20 p-4">
              <p className="font-[family:var(--font-supporting)] text-[10px] uppercase tracking-[0.22em] text-[var(--color-text-muted)]">
                Category
              </p>
              <p className="mt-3 font-[family:var(--font-heading)] text-3xl uppercase leading-none text-[var(--color-text-primary)]">
                {product.category}
              </p>
            </div>
            <div className="rounded-[1.25rem] border border-white/8 bg-black/20 p-4">
              <p className="font-[family:var(--font-supporting)] text-[10px] uppercase tracking-[0.22em] text-[var(--color-text-muted)]">
                Available sizes
              </p>
              <p className="mt-3 font-[family:var(--font-heading)] text-3xl uppercase leading-none text-[var(--color-text-primary)]">
                {[...new Set(product.variants.map((variant) => variant.size))].join(" / ")}
              </p>
            </div>
          </div>

          <div className="mt-6 rounded-[1.5rem] border border-[var(--color-border-subtle)] bg-black/20 p-5">
            <p className="font-[family:var(--font-supporting)] text-[10px] uppercase tracking-[0.22em] text-[var(--color-text-muted)]">
              Variant preview
            </p>
            <div className="mt-4 flex flex-wrap gap-3">
              {product.variants.map((variant) => (
                <div
                  key={variant.id}
                  className="rounded-full border border-white/10 px-4 py-2 font-[family:var(--font-supporting)] text-[10px] uppercase tracking-[0.22em] text-[var(--color-text-secondary)]"
                >
                  {variant.color} / {variant.size}
                </div>
              ))}
            </div>
          </div>

          <div className="mt-8 flex flex-wrap gap-3">
            <button
              type="button"
              onClick={handleAddToBag}
              className="rounded-full bg-[var(--color-accent-gold)] px-5 py-3 font-[family:var(--font-supporting)] text-[10px] uppercase tracking-[0.24em] text-black transition hover:bg-[var(--color-accent-gold-highlight)]"
            >
              Add To Bag
            </button>
            <Link
              href={`/products/${product.slug}`}
              className="rounded-full border border-white/10 px-5 py-3 font-[family:var(--font-supporting)] text-[10px] uppercase tracking-[0.24em] text-[var(--color-text-primary)] transition hover:border-[var(--color-border-strong)]"
            >
              Open Product Page
            </Link>
          </div>
          {hasAdded ? (
            <p className="mt-4 text-sm leading-7 text-[var(--color-text-secondary)]">
              Added to bag using the first available variant. The fuller selection flow remains on
              the product page.
            </p>
          ) : null}
        </div>
      </div>
    </div>
  );
}
