import type { AccountSection, CustomerAccountData } from "../../data/services/get-customer-account";

type Props = {
  account: CustomerAccountData;
  /** Sections this page depends on; failures elsewhere are not shown here. */
  sections: AccountSection[];
  onRetry: () => void;
};

export function AccountLoadNotice({ account, sections, onRetry }: Props) {
  const failed = sections.filter((section) => account.loadErrors.includes(section));
  if (failed.length === 0) return null;

  return (
    <div
      role="alert"
      className="mb-6 flex flex-wrap items-center justify-between gap-4 rounded-[1.5rem] border border-[var(--color-danger)] bg-black/30 px-5 py-4"
    >
      <p className="text-sm leading-7 text-[var(--color-text-secondary)]">
        We couldn&apos;t load your {failed.join(" and ")} right now, so this page may be incomplete.
      </p>
      <button
        type="button"
        onClick={onRetry}
        className="rounded-full border border-[var(--color-border-strong)] px-4 py-3 font-[family:var(--font-supporting)] text-[10px] uppercase tracking-[0.22em] text-[var(--color-text-primary)] transition hover:border-[var(--color-accent-gold)]"
      >
        Try Again
      </button>
    </div>
  );
}
