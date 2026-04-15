import type { ProductDetail } from "@/features/product-detail/domain/entities/product-detail";

export function ProductStoryBlocks({ detail }: { detail: ProductDetail }) {
  return (
    <section className="grid gap-5">
      <div className="rounded-[2rem] border border-[var(--color-border-subtle)] bg-[linear-gradient(180deg,rgba(29,27,24,0.98),rgba(10,10,10,0.98))] p-6 md:p-8">
        <p className="font-[family:var(--font-supporting)] text-[10px] uppercase tracking-[0.28em] text-[var(--color-accent-gold-highlight)]">
          The Read
        </p>
        <h2 className="mt-4 font-[family:var(--font-heading)] text-5xl uppercase leading-none text-[var(--color-text-primary)]">
          Built to hold the frame.
        </h2>
        <p className="mt-5 max-w-3xl text-base leading-8 text-[var(--color-text-secondary)]">
          {detail.campaignNote}
        </p>
      </div>

      <div className="grid gap-5 lg:grid-cols-3">
        <article className="rounded-[1.75rem] border border-white/8 bg-black/20 p-5">
          <p className="font-[family:var(--font-supporting)] text-[10px] uppercase tracking-[0.22em] text-[var(--color-text-muted)]">
            Fit Guidance
          </p>
          <p className="mt-4 text-sm leading-7 text-[var(--color-text-secondary)]">
            {detail.fitGuidance}
          </p>
        </article>
        <article className="rounded-[1.75rem] border border-white/8 bg-black/20 p-5">
          <p className="font-[family:var(--font-supporting)] text-[10px] uppercase tracking-[0.22em] text-[var(--color-text-muted)]">
            Material Story
          </p>
          <p className="mt-4 text-sm leading-7 text-[var(--color-text-secondary)]">
            {detail.materialStory}
          </p>
        </article>
        <article className="rounded-[1.75rem] border border-white/8 bg-black/20 p-5">
          <p className="font-[family:var(--font-supporting)] text-[10px] uppercase tracking-[0.22em] text-[var(--color-text-muted)]">
            Sustainability
          </p>
          <p className="mt-4 text-sm leading-7 text-[var(--color-text-secondary)]">
            {detail.sustainabilityNote}
          </p>
        </article>
      </div>

      <div className="rounded-[2rem] border border-[var(--color-border-subtle)] bg-[linear-gradient(180deg,rgba(22,20,18,0.98),rgba(6,6,6,0.98))] p-6 md:p-8">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="font-[family:var(--font-supporting)] text-[10px] uppercase tracking-[0.28em] text-[var(--color-accent-gold-highlight)]">
              Styling Notes
            </p>
            <h2 className="mt-4 font-[family:var(--font-heading)] text-5xl uppercase leading-none text-[var(--color-text-primary)]">
              Wear it with intention.
            </h2>
          </div>
          <div className="rounded-full border border-white/10 px-4 py-2 font-[family:var(--font-supporting)] text-[10px] uppercase tracking-[0.22em] text-[var(--color-text-secondary)]">
            {detail.deliveryNote}
          </div>
        </div>

        <div className="mt-8 grid gap-4 lg:grid-cols-3">
          {detail.lookbookMoments.map((moment) => (
            <article
              key={moment.title}
              className="rounded-[1.5rem] border border-white/8 bg-black/20 p-5"
            >
              <h3 className="font-[family:var(--font-heading)] text-3xl uppercase leading-none text-[var(--color-text-primary)]">
                {moment.title}
              </h3>
              <p className="mt-4 text-sm leading-7 text-[var(--color-text-secondary)]">
                {moment.body}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
