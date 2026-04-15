import Image from "next/image";
import Link from "next/link";

import type { Product } from "@/core/types/commerce";
import { Container } from "@/core/ui/container";
import { SectionHeading } from "@/core/ui/section-heading";

export function ProductGrid({
  eyebrow,
  title,
  description,
  products,
  featuredProductId,
}: {
  eyebrow: string;
  title: string;
  description: string;
  products: Product[];
  featuredProductId?: string;
}) {
  return (
    <section id="featured-drop" className="py-20">
      <Container>
        <SectionHeading eyebrow={eyebrow} title={title} description={description} />
        <div className="mt-10 grid gap-5 lg:grid-cols-3">
          {products.map((product) => {
            const isFeatured = product.id === featuredProductId;

            return (
            <article
              key={product.id}
              className={`group overflow-hidden rounded-[1.75rem] border border-white/8 bg-[linear-gradient(180deg,rgba(33,31,28,0.98),rgba(18,18,18,0.96))] ${
                isFeatured ? "lg:col-span-2 lg:grid lg:grid-cols-[1.1fr_0.9fr]" : ""
              }`}
            >
              <div className={`relative overflow-hidden ${isFeatured ? "aspect-[4/3.2] lg:aspect-auto lg:min-h-full" : "aspect-[4/4.6]"}`}>
                <Image
                  src={product.media[0].url}
                  alt={product.media[0].alt}
                  fill
                  className="object-cover transition duration-700 group-hover:scale-[1.04]"
                  sizes={
                    isFeatured
                      ? "(max-width: 1023px) 100vw, 66vw"
                      : "(max-width: 1023px) 100vw, 33vw"
                  }
                />
                <div className="absolute inset-0 bg-[linear-gradient(180deg,transparent,rgba(0,0,0,0.62))]" />
                {product.badge ? (
                  <div className="absolute left-4 top-4 rounded-full border border-[var(--color-border-strong)] bg-black/45 px-3 py-2 font-[family:var(--font-supporting)] text-[10px] uppercase tracking-[0.22em] text-[var(--color-accent-gold-highlight)]">
                    {product.badge}
                  </div>
                ) : null}
              </div>
              <div className={`space-y-4 p-5 ${isFeatured ? "flex flex-col justify-between p-6 lg:p-8" : ""}`}>
                <div>
                  <p className="font-[family:var(--font-supporting)] text-[10px] uppercase tracking-[0.22em] text-[var(--color-text-muted)]">
                    {product.subtitle}
                  </p>
                  <h3 className={`mt-2 font-[family:var(--font-heading)] uppercase leading-none text-[var(--color-text-primary)] ${
                    isFeatured ? "text-5xl lg:text-6xl" : "text-4xl"
                  }`}>
                    {product.title}
                  </h3>
                  <p className={`mt-3 leading-7 text-[var(--color-text-secondary)] ${
                    isFeatured ? "max-w-lg text-base" : "text-sm"
                  }`}>
                    {product.description}
                  </p>
                  {isFeatured ? (
                    <p className="mt-4 max-w-md font-[family:var(--font-supporting)] text-[10px] uppercase tracking-[0.24em] text-[var(--color-accent-gold-highlight)]">
                      Lead look of the opening drop
                    </p>
                  ) : null}
                </div>
                <div className="flex items-center justify-between gap-4">
                  <p className="font-[family:var(--font-supporting)] text-xs uppercase tracking-[0.18em] text-[var(--color-text-primary)]">
                    {product.priceRange.min.formatted}
                  </p>
                  <Link
                    href={`/products/${product.slug}`}
                    className={`rounded-full border px-4 py-2 font-[family:var(--font-supporting)] text-[10px] uppercase tracking-[0.22em] transition ${
                      isFeatured
                        ? "border-[var(--color-border-strong)] text-[var(--color-text-primary)] hover:bg-white/6"
                        : "border-white/10 text-[var(--color-text-secondary)] hover:border-[var(--color-border-strong)] hover:text-[var(--color-text-primary)]"
                    }`}
                  >
                    {isFeatured ? "Shop Lead Look" : "View Product"}
                  </Link>
                </div>
              </div>
            </article>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
