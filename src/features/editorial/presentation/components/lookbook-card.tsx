import Link from "next/link";

import { Container } from "@/core/ui/container";
import type { LookbookStory } from "@/features/editorial/domain/entities/lookbook-story";

export function LookbookCard({
  story,
}: {
  story: LookbookStory & { linkedProducts: unknown[] };
}) {
  return (
    <article className="rounded-[2rem] border border-[var(--color-border-subtle)] bg-[linear-gradient(180deg,rgba(30,27,23,0.94),rgba(10,10,10,0.98))] p-6 md:p-8">
      <p className="font-[family:var(--font-supporting)] text-[10px] uppercase tracking-[0.28em] text-[var(--color-accent-gold-highlight)]">
        {story.eyebrow}
      </p>
      <div className="mt-4 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
        <div className="max-w-3xl">
          <h2 className="font-[family:var(--font-heading)] text-5xl uppercase leading-none text-[var(--color-text-primary)] md:text-6xl">
            {story.title}
          </h2>
          <p className="mt-5 max-w-2xl text-base leading-8 text-[var(--color-text-secondary)]">
            {story.summary}
          </p>
        </div>
        <Link
          href={`/stories/${story.slug}`}
          className="rounded-full bg-[var(--color-accent-gold)] px-5 py-3 font-[family:var(--font-supporting)] text-[10px] uppercase tracking-[0.24em] text-black transition hover:bg-[var(--color-accent-gold-highlight)]"
        >
          Enter Story
        </Link>
      </div>

      <div className="mt-8 grid gap-4 md:grid-cols-3">
        <div className="rounded-[1.5rem] border border-white/8 bg-black/20 p-5">
          <p className="font-[family:var(--font-supporting)] text-[10px] uppercase tracking-[0.22em] text-[var(--color-text-muted)]">
            Story Focus
          </p>
          <p className="mt-3 font-[family:var(--font-heading)] text-3xl uppercase leading-none text-[var(--color-text-primary)]">
            {story.chapterLabel}
          </p>
        </div>
        <div className="rounded-[1.5rem] border border-white/8 bg-black/20 p-5">
          <p className="font-[family:var(--font-supporting)] text-[10px] uppercase tracking-[0.22em] text-[var(--color-text-muted)]">
            Mood
          </p>
          <p className="mt-3 font-[family:var(--font-heading)] text-3xl uppercase leading-none text-[var(--color-text-primary)]">
            Tactical
          </p>
        </div>
        <div className="rounded-[1.5rem] border border-white/8 bg-black/20 p-5">
          <p className="font-[family:var(--font-supporting)] text-[10px] uppercase tracking-[0.22em] text-[var(--color-text-muted)]">
            Lead Looks
          </p>
          <p className="mt-3 font-[family:var(--font-heading)] text-3xl uppercase leading-none text-[var(--color-text-primary)]">
            {story.linkedProducts.length}
          </p>
        </div>
      </div>
    </article>
  );
}

export function LookbookIndex({ stories }: { stories: Array<LookbookStory & { linkedProducts: unknown[] }> }) {
  return (
    <Container className="py-10 md:py-14">
      <section className="rounded-[2rem] border border-white/8 bg-[linear-gradient(135deg,rgba(26,25,24,0.98),rgba(11,11,11,0.92))] p-6 shadow-[var(--shadow-gold)] md:p-8">
        <p className="font-[family:var(--font-supporting)] text-[10px] uppercase tracking-[0.3em] text-[var(--color-accent-gold-highlight)]">
          Editorial
        </p>
        <h1 className="mt-4 font-[family:var(--font-heading)] text-6xl uppercase leading-[0.9] text-[var(--color-text-primary)] md:text-7xl lg:text-[5.5rem]">
          Stories cut with command.
        </h1>
        <p className="mt-5 max-w-3xl text-base leading-8 text-[var(--color-text-secondary)]">
          Step deeper into the release frames, trace the styling decisions, and move through the collection the way the campaign intends it to be seen.
        </p>
      </section>

      <div className="mt-8 grid gap-6">
        {stories.map((story) => (
          <LookbookCard key={story.slug} story={story} />
        ))}
      </div>
    </Container>
  );
}
