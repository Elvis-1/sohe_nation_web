import Link from "next/link";

import { CookieSettingsButton } from "@/core/analytics/cookie-settings-button";
import { Container } from "@/core/ui/container";
import { footerNavigation } from "@/features/navigation/data/navigation-links";
import { NewsletterSignup } from "@/features/newsletter/presentation/components/newsletter-signup";
import type { StorefrontSettings } from "@/features/settings/data/services/get-storefront-settings";

export function SiteFooter({ settings }: { settings: StorefrontSettings }) {
  return (
    <footer className="border-t border-white/8 bg-[rgba(8,8,8,0.92)] py-12">
      <Container className="grid gap-8 lg:grid-cols-[1.05fr_0.95fr]">
        <div>
          <p className="font-[family:var(--font-supporting)] text-xs uppercase tracking-[0.32em] text-[var(--color-accent-gold-highlight)]">
            Stay Close
          </p>
          <h2 className="mt-4 max-w-xl font-[family:var(--font-heading)] text-5xl uppercase leading-none text-[var(--color-text-primary)]">
            The release moves on. Stay with it.
          </h2>
          <p className="mt-5 max-w-2xl text-base leading-7 text-[var(--color-text-secondary)]">
            Stay near the next drop, the next frame, and the next shift in the line before it lands everywhere else.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <div className="rounded-full border border-white/10 bg-black/25 px-4 py-3 font-[family:var(--font-supporting)] text-[10px] uppercase tracking-[0.22em] text-[var(--color-text-primary)]">
              {settings.storeName}
            </div>
            <a
              href={`mailto:${settings.supportEmail}`}
              className="rounded-full border border-white/10 bg-black/25 px-4 py-3 font-[family:var(--font-supporting)] text-[10px] uppercase tracking-[0.22em] text-[var(--color-text-primary)] transition hover:border-[var(--color-border-strong)]"
            >
              {settings.supportEmail}
            </a>
          </div>
          <div className="mt-8 rounded-[1.5rem] border border-white/8 bg-white/3 p-5">
            <p className="font-[family:var(--font-supporting)] text-[10px] uppercase tracking-[0.24em] text-[var(--color-text-muted)]">
              End Note
            </p>
            <p className="mt-4 max-w-xl font-[family:var(--font-heading)] text-3xl uppercase leading-none text-[var(--color-text-primary)]">
              Built to be worn hard. Framed to be remembered.
            </p>
            <p className="mt-4 max-w-2xl text-sm leading-7 text-[var(--color-text-secondary)]">
              The storefront closes on the same idea it opens with: strong silhouettes, disciplined styling, and a release story that keeps its edge all the way through.
            </p>
          </div>
        </div>
        <NewsletterSignup />
      </Container>

      <Container className="mt-12 grid gap-10 border-t border-white/8 pt-10 md:grid-cols-[repeat(4,minmax(0,1fr))_minmax(0,1.2fr)]">
        {footerNavigation.map((group) => (
          <nav key={group.title} aria-label={`Footer ${group.title.toLowerCase()}`}>
            <p className="font-[family:var(--font-supporting)] text-[10px] uppercase tracking-[0.26em] text-[var(--color-accent-gold-highlight)]">
              {group.title}
            </p>
            <ul className="mt-4 grid gap-3 text-sm">
              {group.links.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-[var(--color-text-secondary)] transition hover:text-[var(--color-text-primary)]"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        ))}

        {settings.socialLinks.length ? (
          <nav aria-label="Social media">
            <p className="font-[family:var(--font-supporting)] text-[10px] uppercase tracking-[0.26em] text-[var(--color-accent-gold-highlight)]">
              Follow
            </p>
            <ul className="mt-4 flex flex-wrap gap-2">
              {settings.socialLinks.map((link) => (
                <li key={link.platform}>
                  <a
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer me"
                    aria-label={`${settings.storeName} on ${link.label} (opens in a new tab)`}
                    className="inline-flex rounded-full border border-white/10 bg-black/25 px-4 py-2 font-[family:var(--font-supporting)] text-[10px] uppercase tracking-[0.22em] text-[var(--color-text-primary)] transition hover:border-[var(--color-border-strong)]"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        ) : null}
      </Container>

      <Container className="mt-10 flex flex-wrap items-center justify-between gap-3 font-[family:var(--font-supporting)] text-[10px] uppercase tracking-[0.22em] text-[var(--color-text-muted)]">
        <p>
          &copy; {new Date().getFullYear()} {settings.storeName}. Built like an army.
        </p>
        <p>
          <Link href="/privacy" className="transition hover:text-[var(--color-text-primary)]">
            Privacy
          </Link>
          <span aria-hidden="true"> · </span>
          <Link href="/terms" className="transition hover:text-[var(--color-text-primary)]">
            Terms
          </Link>
          <CookieSettingsButton className="uppercase tracking-[0.22em] transition before:content-['_·_'] hover:text-[var(--color-text-primary)]" />
        </p>
      </Container>
    </footer>
  );
}
