import { Container } from "@/core/ui/container";

export function SiteFooter() {
  return (
    <footer className="border-t border-white/8 bg-[rgba(8,8,8,0.92)] py-12">
      <Container className="grid gap-8 md:grid-cols-[1.4fr_0.8fr]">
        <div>
          <p className="font-[family:var(--font-supporting)] text-xs uppercase tracking-[0.32em] text-[var(--color-accent-gold-highlight)]">
            Stay Briefed
          </p>
          <h2 className="mt-4 max-w-xl font-[family:var(--font-heading)] text-5xl uppercase leading-none text-[var(--color-text-primary)]">
            Campaign releases, fitted first.
          </h2>
          <p className="mt-5 max-w-2xl text-base leading-7 text-[var(--color-text-secondary)]">
            The storefront is being built in phases, but the brand system starts here:
            premium release storytelling, commerce-ready product rails, and payment flows
            prepared for PayPal and Flutterwave.
          </p>
        </div>
        <div className="rounded-[1.75rem] border border-[var(--color-border-subtle)] bg-[var(--color-surface-panel)] p-6">
          <p className="font-[family:var(--font-supporting)] text-xs uppercase tracking-[0.24em] text-[var(--color-text-muted)]">
            Phase 0
          </p>
          <ul className="mt-4 space-y-3 text-sm text-[var(--color-text-secondary)]">
            <li>Storefront architecture scaffolded</li>
            <li>Shared API contracts drafted</li>
            <li>Campaign-led homepage shell live</li>
          </ul>
        </div>
      </Container>
    </footer>
  );
}
