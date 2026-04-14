import Link from "next/link";

export default function NotFound() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[var(--color-surface-base)] px-6 text-[var(--color-text-primary)]">
      <div className="max-w-lg text-center">
        <p className="font-[family:var(--font-supporting)] text-xs uppercase tracking-[0.32em] text-[var(--color-text-muted)]">
          404
        </p>
        <h1 className="mt-4 font-[family:var(--font-heading)] text-6xl uppercase leading-none">
          Route off-grid
        </h1>
        <p className="mt-5 text-base leading-7 text-[var(--color-text-secondary)]">
          The page you tried to reach is not part of the current storefront map.
        </p>
        <Link
          href="/"
          className="mt-8 inline-flex rounded-full border border-[var(--color-border-strong)] px-5 py-3 font-[family:var(--font-supporting)] text-xs uppercase tracking-[0.24em] text-[var(--color-text-primary)] transition hover:bg-[var(--color-accent-gold)] hover:text-black"
        >
          Return home
        </Link>
      </div>
    </main>
  );
}
