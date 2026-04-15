"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

import type { NavigationItem } from "@/core/types/commerce";
import { Container } from "@/core/ui/container";
import { useCartSnapshot } from "@/features/cart-and-checkout/presentation/state/cart-provider";

export function SiteHeader({
  navigation,
  utilityLinks,
}: {
  navigation: NavigationItem[];
  utilityLinks: NavigationItem[];
}) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { itemCount } = useCartSnapshot();

  const renderUtilityItem = (item: NavigationItem, isMobile = false) =>
    item.isDisabled ? (
      <span
        key={item.label}
        aria-disabled="true"
        title="Coming soon"
        className={`rounded-full border border-white/8 font-[family:var(--font-supporting)] uppercase tracking-[0.22em] text-[var(--color-text-muted)] opacity-60 ${
          isMobile ? "px-4 py-3 text-[10px]" : "px-3 py-2 text-[10px]"
        }`}
      >
        {item.label}
      </span>
    ) : (
      <Link
        key={item.label}
        href={item.href}
        onClick={() => setIsMobileMenuOpen(false)}
        className={`rounded-full border border-white/10 font-[family:var(--font-supporting)] uppercase tracking-[0.22em] text-[var(--color-text-secondary)] transition hover:border-[var(--color-border-strong)] hover:text-[var(--color-text-primary)] ${
          isMobile ? "px-4 py-3 text-[10px]" : "px-3 py-2 text-[10px]"
        }`}
      >
        {item.label}
        {item.label === "Bag" ? (
          <span
            suppressHydrationWarning
            className="ml-2 rounded-full border border-white/10 px-2 py-0.5 text-[9px] leading-none text-[var(--color-accent-gold-highlight)]"
          >
            {itemCount}
          </span>
        ) : null}
      </Link>
    );

  return (
    <header className="sticky top-0 z-30 border-b border-white/8 bg-[rgba(11,11,11,0.82)] backdrop-blur-xl">
      <Container>
        <div className="flex min-h-20 items-center justify-between gap-4">
          <Link href="/" className="flex min-w-0 items-center gap-3">
            <div className="relative h-11 w-11 shrink-0 overflow-hidden rounded-full border border-[var(--color-border-strong)] bg-[var(--color-surface-panel)]">
              <Image
                src="/sohe-icon.jpeg"
                alt="Sohe's Nation icon"
                fill
                sizes="44px"
                className="object-cover"
              />
            </div>
            <div className="min-w-0 leading-none">
              <p className="truncate font-[family:var(--font-heading)] text-2xl uppercase tracking-[0.08em] text-[var(--color-text-primary)] sm:text-3xl">
                Sohe&apos;s Nation
              </p>
              <p className="font-[family:var(--font-supporting)] text-[10px] uppercase tracking-[0.32em] text-[var(--color-text-muted)]">
                Built Like An Army
              </p>
            </div>
          </Link>

          <nav className="hidden items-center gap-8 lg:flex">
            {navigation.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className="font-[family:var(--font-supporting)] text-xs uppercase tracking-[0.24em] text-[var(--color-text-secondary)] transition hover:text-[var(--color-accent-gold-highlight)]"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="hidden items-center gap-3 lg:flex">
            {utilityLinks.map((item) => renderUtilityItem(item))}
          </div>

          <button
            type="button"
            aria-expanded={isMobileMenuOpen}
            aria-label="Toggle navigation menu"
            onClick={() => setIsMobileMenuOpen((current) => !current)}
            className="flex items-center gap-2 rounded-full border border-white/10 px-4 py-3 font-[family:var(--font-supporting)] text-[10px] uppercase tracking-[0.24em] text-[var(--color-text-primary)] transition hover:border-[var(--color-border-strong)] lg:hidden"
          >
            Menu
            <span className={`text-[var(--color-text-muted)] transition ${isMobileMenuOpen ? "rotate-45" : ""}`}>
              +
            </span>
          </button>
        </div>

        {isMobileMenuOpen ? (
          <div className="border-t border-white/8 pb-5 pt-4 lg:hidden">
            <div className="grid gap-3">
              {navigation.map((item) => (
                <Link
                  key={item.label}
                  href={item.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="rounded-[1rem] border border-white/8 bg-black/20 px-4 py-4 font-[family:var(--font-supporting)] text-[10px] uppercase tracking-[0.24em] text-[var(--color-text-primary)] transition hover:border-[var(--color-border-strong)]"
                >
                  {item.label}
                </Link>
              ))}
            </div>
            <div className="mt-4 flex flex-wrap gap-3">
              {utilityLinks.map((item) => renderUtilityItem(item, true))}
            </div>
          </div>
        ) : null}
      </Container>
    </header>
  );
}
