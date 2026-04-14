"use client";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[var(--color-surface-base)] px-6 text-[var(--color-text-primary)]">
      <div className="max-w-xl rounded-[2rem] border border-[var(--color-border-subtle)] bg-black/40 p-8 shadow-[0_32px_120px_rgba(0,0,0,0.45)]">
        <p className="font-[family:var(--font-supporting)] text-xs uppercase tracking-[0.35em] text-[var(--color-text-muted)]">
          Storefront Error
        </p>
        <h1 className="mt-4 font-[family:var(--font-heading)] text-5xl uppercase leading-none text-[var(--color-text-primary)]">
          Mission paused.
        </h1>
        <p className="mt-4 text-base leading-7 text-[var(--color-text-secondary)]">
          {error.message || "Something interrupted the current campaign view."}
        </p>
        <button
          className="mt-8 rounded-full border border-[var(--color-border-strong)] px-5 py-3 font-[family:var(--font-supporting)] text-xs uppercase tracking-[0.24em] text-[var(--color-text-primary)] transition hover:bg-[var(--color-accent-gold)] hover:text-black"
          onClick={reset}
          type="button"
        >
          Retry
        </button>
      </div>
    </main>
  );
}
