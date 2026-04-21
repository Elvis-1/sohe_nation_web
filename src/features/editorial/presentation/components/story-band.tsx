import Link from "next/link";

import { Container } from "@/core/ui/container";
import { safeHref } from "@/core/utils/safe-href";

export function StoryBand({
  promo,
}: {
  promo: null | {
    eyebrow: string;
    headline: string;
    body: string;
    call_to_action_label: string;
    call_to_action_href: string;
    modules: Array<{ title: string; body: string }>;
  };
}) {
  if (!promo) {
    return null;
  }

  return (
    <section id="story-band" className="pb-24">
      <Container>
        <div className="grid gap-6 rounded-[2rem] border border-[var(--color-border-subtle)] bg-[linear-gradient(180deg,rgba(30,27,23,0.92),rgba(12,12,12,0.98))] p-6 md:grid-cols-[0.8fr_1.2fr] md:p-8">
          <div>
            <p className="font-[family:var(--font-supporting)] text-xs uppercase tracking-[0.3em] text-[var(--color-accent-gold-highlight)]">
              {promo.eyebrow}
            </p>
            <h2 className="mt-4 font-[family:var(--font-heading)] text-5xl uppercase leading-none text-[var(--color-text-primary)]">
              {promo.headline}
            </h2>
            <p className="mt-5 max-w-xl text-base leading-7 text-[var(--color-text-secondary)]">
              {promo.body}
            </p>
            <Link
              href={safeHref(promo.call_to_action_href)}
              className="mt-6 inline-flex rounded-full border border-[var(--color-border-strong)] px-5 py-3 font-[family:var(--font-supporting)] text-[10px] uppercase tracking-[0.24em] text-[var(--color-text-primary)] transition hover:bg-white/6"
            >
              {promo.call_to_action_label}
            </Link>
          </div>
          <div className="grid gap-4">
            {promo.modules.map((pillar) => (
              <article
                key={pillar.title}
                className="rounded-[1.5rem] border border-white/8 bg-black/20 p-5"
              >
                <h3 className="font-[family:var(--font-heading)] text-3xl uppercase leading-none text-[var(--color-text-primary)]">
                  {pillar.title}
                </h3>
                <p className="mt-3 text-sm leading-7 text-[var(--color-text-secondary)]">
                  {pillar.body}
                </p>
              </article>
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}
