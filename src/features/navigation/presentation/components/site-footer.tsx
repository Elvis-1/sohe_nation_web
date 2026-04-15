import { Container } from "@/core/ui/container";
import { NewsletterSignup } from "@/features/navigation/presentation/components/newsletter-signup";

export function SiteFooter() {
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
    </footer>
  );
}
