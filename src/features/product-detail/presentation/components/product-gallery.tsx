"use client";

import Image from "next/image";
import { useState } from "react";

import type { Product } from "@/core/types/commerce";

export function ProductGallery({ product }: { product: Product }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const media = product.media.length ? product.media : [];
  const activeMedia = media[activeIndex] ?? media[0];

  if (!activeMedia) {
    return null;
  }

  return (
    <section className="grid gap-4">
      <div className="relative overflow-hidden rounded-[2rem] border border-[var(--color-border-subtle)] bg-[linear-gradient(180deg,rgba(35,32,29,0.98),rgba(8,8,8,0.98))]">
        <div className="relative aspect-[4/4.8]">
          {activeMedia.type === "video" ? (
            <video
              autoPlay
              muted
              loop
              playsInline
              poster={activeMedia.posterUrl}
              className="absolute inset-0 h-full w-full object-cover"
            >
              <source src={activeMedia.url} />
            </video>
          ) : (
            <Image
              src={activeMedia.url}
              alt={activeMedia.alt}
              fill
              className="object-cover transition duration-700 hover:scale-[1.03]"
            />
          )}
          <div className="absolute inset-0 bg-[linear-gradient(180deg,transparent,rgba(0,0,0,0.42))]" />
          <div className="absolute left-5 top-5 rounded-full border border-[var(--color-border-strong)] bg-black/40 px-3 py-2 font-[family:var(--font-supporting)] text-[10px] uppercase tracking-[0.22em] text-[var(--color-accent-gold-highlight)]">
            Gallery View {activeIndex + 1}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-3">
        {media.map((item, index) => (
          <button
            key={item.id}
            type="button"
            onClick={() => setActiveIndex(index)}
            className={`relative overflow-hidden rounded-[1.25rem] border bg-black/25 text-left transition ${
              activeIndex === index
                ? "border-[var(--color-border-strong)]"
                : "border-white/10 hover:border-white/20"
            }`}
          >
            <div className="relative aspect-[1/1.1]">
              {item.type === "video" ? (
                <video
                  muted
                  playsInline
                  poster={item.posterUrl}
                  className="absolute inset-0 h-full w-full object-cover"
                />
              ) : (
                <Image src={item.url} alt={item.alt} fill className="object-cover" />
              )}
            </div>
          </button>
        ))}
      </div>
    </section>
  );
}
