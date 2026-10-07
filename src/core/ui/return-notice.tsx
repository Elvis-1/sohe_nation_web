import type { ReturnNotice as ReturnNoticeValue } from "@/core/utils/return-rule";

/** One-line return rule for a product or line; final sale is highlighted. */
export function ReturnNotice({ notice, className = "" }: { notice: ReturnNoticeValue; className?: string }) {
  return (
    <p
      data-return-notice={notice.isFinalSale ? "final-sale" : "returnable"}
      className={`text-xs leading-6 ${
        notice.isFinalSale ? "text-[var(--color-warning)]" : "text-[var(--color-text-muted)]"
      } ${className}`}
    >
      {notice.text}
    </p>
  );
}
