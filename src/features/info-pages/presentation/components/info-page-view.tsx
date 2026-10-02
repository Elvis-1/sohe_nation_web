import Link from "next/link";

import { footerNavigation } from "@/features/navigation/data/navigation-links";

import type { InfoPage } from "../../data/services/get-info-page";
import { RichText } from "./rich-text";

const dateFormatter = new Intl.DateTimeFormat("en-GB", {
  day: "numeric",
  month: "long",
  year: "numeric",
  timeZone: "UTC",
});

export function InfoPageView({ page }: { page: InfoPage }) {
  const related = footerNavigation.filter((group) => group.title === "Help" || group.title === "Legal");

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_18rem]">
      <article className="rounded-[2rem] border border-white/8 bg-[linear-gradient(135deg,rgba(26,25,24,0.98),rgba(11,11,11,0.92))] p-6 shadow-[var(--shadow-gold)] md:p-10">
        <p className="font-[family:var(--font-supporting)] text-[10px] uppercase tracking-[0.3em] text-[var(--color-accent-gold-highlight)]">
          {page.group}
        </p>
        <h1 className="mt-4 font-[family:var(--font-heading)] text-5xl uppercase leading-[0.9] text-[var(--color-text-primary)] md:text-7xl">
          {page.title}
        </h1>
        {page.summary ? (
          <p className="mt-5 max-w-2xl text-base leading-8 text-[var(--color-text-secondary)]">
            {page.summary}
          </p>
        ) : null}
        <p className="mt-4 font-[family:var(--font-supporting)] text-[10px] uppercase tracking-[0.22em] text-[var(--color-text-muted)]">
          Last updated{" "}
          <time dateTime={page.updatedAt}>{dateFormatter.format(new Date(page.updatedAt))}</time>
        </p>

        <div className="mt-8 max-w-3xl border-t border-white/8 pt-8">
          <RichText source={page.body} />
        </div>
      </article>

      <aside aria-label="More help" className="grid content-start gap-4">
        {related.map((group) => (
          <nav
            key={group.title}
            aria-label={group.title}
            className="rounded-[1.5rem] border border-white/8 bg-white/3 p-5"
          >
            <p className="font-[family:var(--font-supporting)] text-[10px] uppercase tracking-[0.24em] text-[var(--color-text-muted)]">
              {group.title}
            </p>
            <ul className="mt-3 grid gap-2 text-sm">
              {group.links.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    aria-current={link.href === `/${page.slug}` ? "page" : undefined}
                    className="text-[var(--color-text-secondary)] transition hover:text-[var(--color-text-primary)] aria-[current=page]:text-[var(--color-accent-gold-highlight)]"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        ))}
      </aside>
    </div>
  );
}
