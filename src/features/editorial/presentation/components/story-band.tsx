import { Container } from "@/core/ui/container";

const pillars = [
  {
    title: "Campaign-first",
    body: "The homepage leads with a single commanding story before branching into merchandise.",
  },
  {
    title: "Region-ready contracts",
    body: "Commerce types already carry region and currency fields so expansion does not require a rebuild.",
  },
  {
    title: "Payments prepared",
    body: "Checkout will route into hosted PayPal and Flutterwave flows instead of storing sensitive payment details.",
  },
];

export function StoryBand() {
  return (
    <section id="story-band" className="pb-24">
      <Container>
        <div className="grid gap-6 rounded-[2rem] border border-[var(--color-border-subtle)] bg-[linear-gradient(180deg,rgba(30,27,23,0.92),rgba(12,12,12,0.98))] p-6 md:grid-cols-[0.8fr_1.2fr] md:p-8">
          <div>
            <p className="font-[family:var(--font-supporting)] text-xs uppercase tracking-[0.3em] text-[var(--color-accent-gold-highlight)]">
              System Direction
            </p>
            <h2 className="mt-4 font-[family:var(--font-heading)] text-5xl uppercase leading-none text-[var(--color-text-primary)]">
              Not just a landing page. A commerce platform with posture.
            </h2>
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
