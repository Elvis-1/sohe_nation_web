import Image from "next/image";
import Link from "next/link";

import type { NavigationItem } from "@/core/types/commerce";
import { Container } from "@/core/ui/container";

export function SiteHeader({
  navigation,
  utilityLinks,
}: {
  navigation: NavigationItem[];
  utilityLinks: NavigationItem[];
}) {
  return (
    <header className="sticky top-0 z-30 border-b border-white/8 bg-[rgba(11,11,11,0.82)] backdrop-blur-xl">
      <Container className="flex min-h-20 items-center justify-between gap-6">
        <Link href="/" className="flex items-center gap-3">
          <div className="relative h-11 w-11 overflow-hidden rounded-full border border-[var(--color-border-strong)] bg-[var(--color-surface-panel)]">
            <Image src="/sohe-icon.jpeg" alt="Sohe's Nation icon" fill className="object-cover" />
          </div>
          <div className="leading-none">
            <p className="font-[family:var(--font-heading)] text-3xl uppercase tracking-[0.08em] text-[var(--color-text-primary)]">
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

        <div className="flex items-center gap-3">
          {utilityLinks.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className="rounded-full border border-white/10 px-3 py-2 font-[family:var(--font-supporting)] text-[10px] uppercase tracking-[0.22em] text-[var(--color-text-secondary)] transition hover:border-[var(--color-border-strong)] hover:text-[var(--color-text-primary)]"
            >
              {item.label}
            </Link>
          ))}
        </div>
      </Container>
    </header>
  );
}
