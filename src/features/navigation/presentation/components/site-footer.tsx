import { Container } from "@/core/ui/container";
import { NewsletterSignup } from "@/features/navigation/presentation/components/newsletter-signup";

export function SiteFooter() {
  return (
    <footer className="border-t border-white/8 bg-[rgba(8,8,8,0.92)] py-12">
      <Container className="grid gap-8 lg:grid-cols-[1.05fr_0.95fr]">
        <div>
          <p className="font-[family:var(--font-supporting)] text-xs uppercase tracking-[0.32em] text-[var(--color-accent-gold-highlight)]">
            Stay Briefed
          </p>
          <h2 className="mt-4 max-w-xl font-[family:var(--font-heading)] text-5xl uppercase leading-none text-[var(--color-text-primary)]">
            Campaign releases, fitted first.
          </h2>
          <p className="mt-5 max-w-2xl text-base leading-7 text-[var(--color-text-secondary)]">
            First access to new drops, early lookbook frames, and release notes from the Sohe&apos;s Nation line before they spread wider.
          </p>
          <div className="mt-8 grid gap-3 sm:grid-cols-3">
            <div className="rounded-[1.25rem] border border-white/8 bg-white/3 p-4">
              <p className="font-[family:var(--font-supporting)] text-[10px] uppercase tracking-[0.24em] text-[var(--color-text-muted)]">
                Drop Focus
              </p>
              <p className="mt-3 font-[family:var(--font-heading)] text-3xl uppercase leading-none text-[var(--color-text-primary)]">
                Outerwear
              </p>
            </div>
            <div className="rounded-[1.25rem] border border-white/8 bg-white/3 p-4">
              <p className="font-[family:var(--font-supporting)] text-[10px] uppercase tracking-[0.24em] text-[var(--color-text-muted)]">
                Lead Story
              </p>
              <p className="mt-3 font-[family:var(--font-heading)] text-3xl uppercase leading-none text-[var(--color-text-primary)]">
                Lookbook 01
              </p>
            </div>
            <div className="rounded-[1.25rem] border border-white/8 bg-white/3 p-4">
              <p className="font-[family:var(--font-supporting)] text-[10px] uppercase tracking-[0.24em] text-[var(--color-text-muted)]">
                Release Mode
              </p>
              <p className="mt-3 font-[family:var(--font-heading)] text-3xl uppercase leading-none text-[var(--color-text-primary)]">
                Live Now
              </p>
            </div>
          </div>
        </div>
        <NewsletterSignup />
      </Container>
    </footer>
  );
}
