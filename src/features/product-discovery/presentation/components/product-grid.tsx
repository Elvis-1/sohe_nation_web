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
}: {
  eyebrow: string;
  title: string;
  description: string;
  products: Product[];
}) {
  return (
    <section id="featured-drop" className="py-20">
      <Container>
        <SectionHeading eyebrow={eyebrow} title={title} description={description} />
        <div className="mt-10 grid gap-5 lg:grid-cols-3">
          {products.map((product) => (
            <article
              key={product.id}
              className="group overflow-hidden rounded-[1.75rem] border border-white/8 bg-[linear-gradient(180deg,rgba(33,31,28,0.98),rgba(18,18,18,0.96))]"
            >
              <div className="relative aspect-[4/4.6] overflow-hidden">
                <Image
                  src={product.media[0].url}
                  alt={product.media[0].alt}
                  fill
                  className="object-cover transition duration-700 group-hover:scale-[1.04]"
                />
                <div className="absolute inset-0 bg-[linear-gradient(180deg,transparent,rgba(0,0,0,0.62))]" />
                {product.badge ? (
                  <div className="absolute left-4 top-4 rounded-full border border-[var(--color-border-strong)] bg-black/45 px-3 py-2 font-[family:var(--font-supporting)] text-[10px] uppercase tracking-[0.22em] text-[var(--color-accent-gold-highlight)]">
                    {product.badge}
                  </div>
                ) : null}
              </div>
              <div className="space-y-4 p-5">
                <div>
                  <p className="font-[family:var(--font-supporting)] text-[10px] uppercase tracking-[0.22em] text-[var(--color-text-muted)]">
                    {product.subtitle}
                  </p>
                  <h3 className="mt-2 font-[family:var(--font-heading)] text-4xl uppercase leading-none text-[var(--color-text-primary)]">
                    {product.title}
                  </h3>
                  <p className="mt-3 text-sm leading-7 text-[var(--color-text-secondary)]">
                    {product.description}
                  </p>
                </div>
                <div className="flex items-center justify-between gap-4">
                  <p className="font-[family:var(--font-supporting)] text-xs uppercase tracking-[0.18em] text-[var(--color-text-primary)]">
                    {product.priceRange.min.formatted}
                  </p>
                  <Link
                    href={`/products/${product.slug}`}
                    className="rounded-full border border-white/10 px-4 py-2 font-[family:var(--font-supporting)] text-[10px] uppercase tracking-[0.22em] text-[var(--color-text-secondary)] transition hover:border-[var(--color-border-strong)] hover:text-[var(--color-text-primary)]"
                  >
                    View Product
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>
      </Container>
    </section>
  );
}
