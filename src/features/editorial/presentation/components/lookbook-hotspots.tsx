"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

import type { Product } from "@/core/types/commerce";
import type { LookbookStory } from "@/features/editorial/domain/entities/lookbook-story";

type StoryWithProducts = LookbookStory & {
  linkedProducts: Product[];
};

export function LookbookHotspots({ story }: { story: StoryWithProducts }) {
  const [activeHotspotId, setActiveHotspotId] = useState(story.hotspots[0]?.id ?? null);

  const activeHotspot = story.hotspots.find((hotspot) => hotspot.id === activeHotspotId) ?? story.hotspots[0];
  const activeProduct = story.linkedProducts.find(
    (product) => product.slug === activeHotspot?.productSlug,
  );

  return (
    <section className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
      <div className="relative overflow-hidden rounded-[2rem] border border-[var(--color-border-subtle)] bg-[linear-gradient(180deg,rgba(31,29,26,0.96),rgba(10,10,10,0.98))]">
        <div className="relative aspect-[4/4.7]">
          {story.heroMedia.type === "video" ? (
            <video
              autoPlay
              muted
              loop
              playsInline
              poster={story.heroMedia.posterUrl}
              className="absolute inset-0 h-full w-full object-cover opacity-85"
            >
              <source src={story.heroMedia.url} />
            </video>
          ) : (
            <Image
              src={story.heroMedia.url}
              alt={story.heroMedia.alt}
              fill
              className="object-cover"
            />
          )}
          <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.18),rgba(0,0,0,0.72))]" />

          {story.hotspots.map((hotspot, index) => (
            <button
              key={hotspot.id}
              type="button"
              onClick={() => setActiveHotspotId(hotspot.id)}
              className={`absolute flex h-11 w-11 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border font-[family:var(--font-supporting)] text-[10px] uppercase tracking-[0.18em] transition ${
                activeHotspotId === hotspot.id
                  ? "border-[var(--color-border-strong)] bg-[var(--color-accent-gold)] text-black"
                  : "border-white/20 bg-black/45 text-[var(--color-text-primary)] hover:border-white/40"
              }`}
              style={{ top: hotspot.top, left: hotspot.left }}
              aria-label={hotspot.label}
            >
              {index + 1}
            </button>
          ))}

          <div className="absolute inset-x-0 bottom-0 p-6">
            <p className="font-[family:var(--font-supporting)] text-[10px] uppercase tracking-[0.3em] text-[var(--color-accent-gold-highlight)]">
              {story.chapterLabel}
            </p>
            <h1 className="mt-3 font-[family:var(--font-heading)] text-6xl uppercase leading-[0.9] text-[var(--color-text-primary)] md:text-7xl">
              {story.title}
            </h1>
            <p className="mt-4 max-w-2xl text-base leading-8 text-[var(--color-text-secondary)]">
              {story.campaignStatement}
            </p>
          </div>
        </div>
      </div>

      <div className="grid gap-5">
        <article className="rounded-[2rem] border border-[var(--color-border-subtle)] bg-[linear-gradient(180deg,rgba(28,26,23,0.98),rgba(10,10,10,0.98))] p-6">
          <p className="font-[family:var(--font-supporting)] text-[10px] uppercase tracking-[0.24em] text-[var(--color-accent-gold-highlight)]">
            Active Hotspot
          </p>
          <h2 className="mt-4 font-[family:var(--font-heading)] text-5xl uppercase leading-none text-[var(--color-text-primary)]">
            {activeHotspot?.label}
          </h2>
          <p className="mt-4 text-sm leading-7 text-[var(--color-text-secondary)]">
            {activeHotspot?.note}
          </p>

          {activeProduct ? (
            <div className="mt-6 rounded-[1.5rem] border border-white/8 bg-black/20 p-5">
              <p className="font-[family:var(--font-supporting)] text-[10px] uppercase tracking-[0.22em] text-[var(--color-text-muted)]">
                Linked Product
              </p>
              <h3 className="mt-3 font-[family:var(--font-heading)] text-3xl uppercase leading-none text-[var(--color-text-primary)]">
                {activeProduct.title}
              </h3>
              <p className="mt-4 text-sm leading-7 text-[var(--color-text-secondary)]">
                {activeProduct.description}
              </p>
              <div className="mt-5 flex flex-wrap gap-3">
                <Link
                  href={`/products/${activeProduct.slug}`}
                  className="rounded-full bg-[var(--color-accent-gold)] px-4 py-3 font-[family:var(--font-supporting)] text-[10px] uppercase tracking-[0.24em] text-black transition hover:bg-[var(--color-accent-gold-highlight)]"
                >
                  Open Product
                </Link>
                <button
                  type="button"
                  className="rounded-full border border-white/10 px-4 py-3 font-[family:var(--font-supporting)] text-[10px] uppercase tracking-[0.24em] text-[var(--color-text-primary)] transition hover:border-[var(--color-border-strong)]"
                >
                  Add To Cart
                </button>
              </div>
            </div>
          ) : null}
        </article>

        <div className="grid gap-4">
          {story.modules.map((module) => (
            <article
              key={module.title}
              className="rounded-[1.5rem] border border-white/8 bg-black/20 p-5"
            >
              <h3 className="font-[family:var(--font-heading)] text-3xl uppercase leading-none text-[var(--color-text-primary)]">
                {module.title}
              </h3>
              <p className="mt-4 text-sm leading-7 text-[var(--color-text-secondary)]">
                {module.body}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
