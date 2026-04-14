import { notFound } from "next/navigation";

import { SectionHeading } from "@/core/ui/section-heading";
import { storefrontMock } from "@/mocks/storefront";

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = storefrontMock.featuredProducts.find((item) => item.slug === slug);

  if (!product) {
    notFound();
  }

  return (
    <main className="mx-auto flex w-full max-w-[var(--container-width)] flex-1 px-6 py-16 lg:px-8">
      <div className="w-full rounded-[2rem] border border-[var(--color-border-subtle)] bg-[linear-gradient(180deg,rgba(26,25,24,0.94),rgba(11,11,11,0.96))] p-8">
        <SectionHeading
          eyebrow={product.subtitle}
          title={product.title}
          description={product.description}
        />
        <div className="mt-8 grid gap-6 md:grid-cols-2">
          <div className="rounded-[1.5rem] border border-white/8 bg-black/20 p-6">
            <p className="font-[family:var(--font-supporting)] text-xs uppercase tracking-[0.24em] text-[var(--color-text-muted)]">
              Starting price
            </p>
            <p className="mt-3 font-[family:var(--font-heading)] text-5xl uppercase leading-none text-[var(--color-text-primary)]">
              {product.priceRange.min.formatted}
            </p>
          </div>
          <div className="rounded-[1.5rem] border border-white/8 bg-black/20 p-6">
            <p className="font-[family:var(--font-supporting)] text-xs uppercase tracking-[0.24em] text-[var(--color-text-muted)]">
              Contract note
            </p>
            <p className="mt-3 text-sm leading-7 text-[var(--color-text-secondary)]">
              This placeholder PDP proves the catalog route shape while Phase 0 focuses on
              scaffolding. The full PDP build comes in Phase 3.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
