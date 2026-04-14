export function SectionHeading({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string;
  title: string;
  description: string;
}) {
  return (
    <div className="max-w-2xl">
      <p className="font-[family:var(--font-supporting)] text-xs uppercase tracking-[0.28em] text-[var(--color-accent-gold-highlight)]">
        {eyebrow}
      </p>
      <h2 className="mt-4 font-[family:var(--font-heading)] text-5xl uppercase leading-none text-[var(--color-text-primary)] md:text-6xl">
        {title}
      </h2>
      <p className="mt-5 text-base leading-7 text-[var(--color-text-secondary)] md:text-lg">
        {description}
      </p>
    </div>
  );
}
