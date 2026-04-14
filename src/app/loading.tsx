export default function Loading() {
  return (
    <main className="min-h-screen bg-[var(--color-surface-base)] px-6 py-20 text-[var(--color-text-primary)]">
      <div className="mx-auto flex max-w-6xl animate-pulse flex-col gap-6">
        <div className="h-4 w-32 rounded-full bg-white/10" />
        <div className="h-24 w-full rounded-[2rem] bg-white/8" />
        <div className="grid gap-4 md:grid-cols-3">
          <div className="h-64 rounded-[1.5rem] bg-white/8" />
          <div className="h-64 rounded-[1.5rem] bg-white/8" />
          <div className="h-64 rounded-[1.5rem] bg-white/8" />
        </div>
      </div>
    </main>
  );
}
