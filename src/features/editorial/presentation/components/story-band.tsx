import Link from "next/link";

import { Container } from "@/core/ui/container";

const pillars = [
  {
    title: "Uniform Energy",
    body: "Every look is cut to feel disciplined, sharp, and unmistakably part of the same command language.",
  },
  {
    title: "Runway Utility",
    body: "The collection holds both posture and movement, pairing strong lines with everyday wearability.",
  },
  {
    title: "Story To Product",
    body: "Editorial frames, product detail, and the buy path now move as one continuous release experience.",
  },
];

export function StoryBand() {
  return (
    <section id="story-band" className="pb-24">
      <Container>
        <div className="grid gap-6 rounded-[2rem] border border-[var(--color-border-subtle)] bg-[linear-gradient(180deg,rgba(30,27,23,0.92),rgba(12,12,12,0.98))] p-6 md:grid-cols-[0.8fr_1.2fr] md:p-8">
          <div>
            <p className="font-[family:var(--font-supporting)] text-xs uppercase tracking-[0.3em] text-[var(--color-accent-gold-highlight)]">
              Editorial Cut
            </p>
            <h2 className="mt-4 font-[family:var(--font-heading)] text-5xl uppercase leading-none text-[var(--color-text-primary)]">
              The campaign keeps moving after the hero.
            </h2>
            <p className="mt-5 max-w-xl text-base leading-7 text-[var(--color-text-secondary)]">
              Step into the release story, follow the styling decisions, and move directly from the frame into the pieces that hold it together.
            </p>
            <Link
              href="/stories/built-like-an-army"
              className="mt-6 inline-flex rounded-full border border-[var(--color-border-strong)] px-5 py-3 font-[family:var(--font-supporting)] text-[10px] uppercase tracking-[0.24em] text-[var(--color-text-primary)] transition hover:bg-white/6"
            >
              Enter Lookbook
            </Link>
          </div>
          <div className="grid gap-4">
            {pillars.map((pillar) => (
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
