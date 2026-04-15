import Link from "next/link";

import { Container } from "@/core/ui/container";

const pillars = [
  {
    title: "Frame The Look",
    body: "Follow the lead silhouettes as they move from still image to full release posture.",
  },
  {
    title: "Hold The Line",
    body: "See how the outerwear, shirting, and tactical base pieces are built to carry one clear visual language.",
  },
  {
    title: "Step Inside",
    body: "Move from the campaign frame into the lookbook and from the lookbook into the exact pieces that define it.",
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
              The drop doesn&apos;t end at the first frame.
            </h2>
            <p className="mt-5 max-w-xl text-base leading-7 text-[var(--color-text-secondary)]">
              Enter the release story, follow the styling rhythm, and step deeper into the silhouettes, layers, and decisions that give the collection its command.
            </p>
            <Link
              href="/stories/built-like-an-army"
              className="mt-6 inline-flex rounded-full border border-[var(--color-border-strong)] px-5 py-3 font-[family:var(--font-supporting)] text-[10px] uppercase tracking-[0.24em] text-[var(--color-text-primary)] transition hover:bg-white/6"
            >
              Read The Lookbook
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
