"use client";

import { useState } from "react";

import type { Product } from "@/core/types/commerce";

function uniqueValues(values: string[]) {
  return [...new Set(values)];
}

export function ProductPurchasePanel({ product }: { product: Product }) {
  const colors = uniqueValues(product.variants.map((variant) => variant.color));
  const sizes = uniqueValues(product.variants.map((variant) => variant.size));

  const [selectedColor, setSelectedColor] = useState(colors[0] ?? "");
  const [selectedSize, setSelectedSize] = useState(sizes[0] ?? "");

  const activeVariant =
    product.variants.find(
      (variant) => variant.color === selectedColor && variant.size === selectedSize,
    ) ?? product.variants[0];

  return (
    <section className="rounded-[2rem] border border-[var(--color-border-subtle)] bg-[linear-gradient(180deg,rgba(31,28,25,0.98),rgba(8,8,8,0.98))] p-6 md:p-8">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="font-[family:var(--font-supporting)] text-[10px] uppercase tracking-[0.26em] text-[var(--color-accent-gold-highlight)]">
            {product.subtitle}
          </p>
          <h1 className="mt-3 font-[family:var(--font-heading)] text-6xl uppercase leading-[0.92] text-[var(--color-text-primary)]">
            {product.title}
          </h1>
        </div>
        {product.badge ? (
          <div className="rounded-full border border-[var(--color-border-strong)] bg-black/35 px-4 py-2 font-[family:var(--font-supporting)] text-[10px] uppercase tracking-[0.24em] text-[var(--color-accent-gold-highlight)]">
            {product.badge}
          </div>
        ) : null}
      </div>

      <p className="mt-5 max-w-2xl text-base leading-8 text-[var(--color-text-secondary)]">
        {product.description}
      </p>

      <div className="mt-6 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="font-[family:var(--font-supporting)] text-[10px] uppercase tracking-[0.22em] text-[var(--color-text-muted)]">
            Price
          </p>
          <p className="mt-2 font-[family:var(--font-heading)] text-5xl uppercase leading-none text-[var(--color-text-primary)]">
            {activeVariant?.price.formatted ?? product.priceRange.min.formatted}
          </p>
        </div>
        <div className="rounded-[1rem] border border-white/10 bg-black/20 px-4 py-3">
          <p className="font-[family:var(--font-supporting)] text-[10px] uppercase tracking-[0.22em] text-[var(--color-text-muted)]">
            Availability
          </p>
          <p className="mt-2 font-[family:var(--font-supporting)] text-xs uppercase tracking-[0.2em] text-[var(--color-text-primary)]">
            {activeVariant?.inventoryQuantity
              ? `${activeVariant.inventoryQuantity} units ready`
              : "Awaiting restock"}
          </p>
        </div>
      </div>

      <div className="mt-8 grid gap-6">
        <div>
          <p className="font-[family:var(--font-supporting)] text-[10px] uppercase tracking-[0.22em] text-[var(--color-text-muted)]">
            Color
          </p>
          <div className="mt-3 flex flex-wrap gap-3">
            {colors.map((color) => (
              <button
                key={color}
                type="button"
                onClick={() => setSelectedColor(color)}
                className={`rounded-full border px-4 py-3 font-[family:var(--font-supporting)] text-[10px] uppercase tracking-[0.22em] transition ${
                  selectedColor === color
                    ? "border-[var(--color-border-strong)] bg-[var(--color-accent-gold)] text-black"
                    : "border-white/10 text-[var(--color-text-secondary)] hover:border-white/20 hover:text-[var(--color-text-primary)]"
                }`}
              >
                {color}
              </button>
            ))}
          </div>
        </div>

        <div>
          <p className="font-[family:var(--font-supporting)] text-[10px] uppercase tracking-[0.22em] text-[var(--color-text-muted)]">
            Size
          </p>
          <div className="mt-3 flex flex-wrap gap-3">
            {sizes.map((size) => {
              const available = product.variants.some(
                (variant) => variant.size === size && variant.color === selectedColor,
              );

              return (
                <button
                  key={size}
                  type="button"
                  disabled={!available}
                  onClick={() => setSelectedSize(size)}
                  className={`rounded-full border px-4 py-3 font-[family:var(--font-supporting)] text-[10px] uppercase tracking-[0.22em] transition ${
                    selectedSize === size
                      ? "border-[var(--color-border-strong)] bg-white text-black"
                      : "border-white/10 text-[var(--color-text-secondary)] hover:border-white/20 hover:text-[var(--color-text-primary)]"
                  } disabled:cursor-not-allowed disabled:opacity-35`}
                >
                  {size}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        <button
          type="button"
          className="rounded-full bg-[var(--color-accent-gold)] px-5 py-4 font-[family:var(--font-supporting)] text-[10px] uppercase tracking-[0.24em] text-black transition hover:bg-[var(--color-accent-gold-highlight)]"
        >
          Add To Cart
        </button>
        <button
          type="button"
          className="rounded-full border border-white/10 px-5 py-4 font-[family:var(--font-supporting)] text-[10px] uppercase tracking-[0.24em] text-[var(--color-text-primary)] transition hover:border-[var(--color-border-strong)]"
        >
          Save For Later
        </button>
      </div>

      <div className="mt-8 grid gap-4 sm:grid-cols-3">
        {activeVariant?.attributes.map((attribute) => (
          <div
            key={attribute.name}
            className="rounded-[1.25rem] border border-white/8 bg-black/20 p-4"
          >
            <p className="font-[family:var(--font-supporting)] text-[10px] uppercase tracking-[0.22em] text-[var(--color-text-muted)]">
              {attribute.name}
            </p>
            <p className="mt-3 font-[family:var(--font-heading)] text-3xl uppercase leading-none text-[var(--color-text-primary)]">
              {attribute.value}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
