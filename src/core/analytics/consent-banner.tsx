"use client";

import Link from "next/link";
import { useId, useState } from "react";

import { writeConsent, type ConsentChoice } from "./consent";

type Props = {
  current: ConsentChoice | null;
  offerAnalytics: boolean;
  offerMarketing: boolean;
  startExpanded: boolean;
  onClose: () => void;
};

const buttonBase =
  "h-11 rounded-full px-5 font-[family:var(--font-supporting)] text-[10px] uppercase tracking-[0.22em] transition";
// Reject carries the same visual weight as Accept, as UK guidance requires.
const primary = `${buttonBase} bg-[var(--color-accent-gold)] text-black hover:bg-[var(--color-accent-gold-highlight)]`;
const secondary = `${buttonBase} border border-white/15 text-[var(--color-text-primary)] hover:border-[var(--color-border-strong)]`;

/**
 * Non-blocking consent panel. Nothing optional loads until a choice is made, and every
 * category starts off. "Cookie settings" in the footer reopens it.
 */
export function ConsentBanner({ current, offerAnalytics, offerMarketing, startExpanded, onClose }: Props) {
  const titleId = useId();
  const [expanded, setExpanded] = useState(startExpanded);
  const [analytics, setAnalytics] = useState(current?.analytics ?? false);
  const [marketing, setMarketing] = useState(current?.marketing ?? false);

  function save(choice: ConsentChoice) {
    writeConsent({
      analytics: offerAnalytics && choice.analytics,
      marketing: offerMarketing && choice.marketing,
    });
    onClose();
  }

  return (
    <section
      role="dialog"
      aria-modal="false"
      aria-labelledby={titleId}
      className="fixed inset-x-3 bottom-3 z-50 mx-auto max-h-[calc(100dvh-1.5rem)] max-w-3xl overflow-y-auto rounded-[1.5rem] border border-[var(--color-border-strong)] bg-[rgba(12,12,12,0.97)] p-5 shadow-[0_24px_80px_rgba(0,0,0,0.6)] backdrop-blur md:inset-x-6 md:bottom-6 md:p-6"
    >
      <h2
        id={titleId}
        className="font-[family:var(--font-heading)] text-3xl uppercase leading-none text-[var(--color-text-primary)]"
      >
        Your cookie choices
      </h2>
      <p className="mt-3 text-sm leading-6 text-[var(--color-text-secondary)]">
        We use essential storage to run your bag and sign-in. With your permission we also measure
        visits{offerMarketing ? " and the reach of our ads" : ""} to improve the store. Nothing
        optional runs until you choose. See our{" "}
        <Link
          href="/privacy"
          className="text-[var(--color-accent-gold-highlight)] underline underline-offset-4"
        >
          privacy and cookies policy
        </Link>
        .
      </p>

      {expanded ? (
        <fieldset className="mt-4 grid gap-3">
          <legend className="sr-only">Optional cookies</legend>
          <label className="flex items-start gap-3 rounded-[1rem] border border-white/8 p-3 text-sm text-[var(--color-text-secondary)]">
            <input type="checkbox" checked disabled className="mt-1 accent-[var(--color-accent-gold)]" />
            <span>
              <strong className="text-[var(--color-text-primary)]">Essential</strong> — bag, sign-in,
              and remembering this choice. Always on.
            </span>
          </label>
          {offerAnalytics ? (
            <label className="flex items-start gap-3 rounded-[1rem] border border-white/8 p-3 text-sm text-[var(--color-text-secondary)]">
              <input
                type="checkbox"
                checked={analytics}
                onChange={(event) => setAnalytics(event.target.checked)}
                className="mt-1 accent-[var(--color-accent-gold)]"
              />
              <span>
                <strong className="text-[var(--color-text-primary)]">Analytics</strong> — Google
                Analytics counts visits and purchases so we can see what works.
              </span>
            </label>
          ) : null}
          {offerMarketing ? (
            <label className="flex items-start gap-3 rounded-[1rem] border border-white/8 p-3 text-sm text-[var(--color-text-secondary)]">
              <input
                type="checkbox"
                checked={marketing}
                onChange={(event) => setMarketing(event.target.checked)}
                className="mt-1 accent-[var(--color-accent-gold)]"
              />
              <span>
                <strong className="text-[var(--color-text-primary)]">Marketing</strong> — Meta
                measures our Instagram and Facebook ads and who they reach.
              </span>
            </label>
          ) : null}
        </fieldset>
      ) : null}

      <div className="mt-5 flex flex-wrap gap-3">
        <button type="button" className={primary} onClick={() => save({ analytics: true, marketing: true })}>
          Accept all
        </button>
        <button type="button" className={primary} onClick={() => save({ analytics: false, marketing: false })}>
          Reject all
        </button>
        {expanded ? (
          <button type="button" className={secondary} onClick={() => save({ analytics, marketing })}>
            Save choices
          </button>
        ) : (
          <button type="button" className={secondary} onClick={() => setExpanded(true)}>
            Manage
          </button>
        )}
      </div>
    </section>
  );
}
