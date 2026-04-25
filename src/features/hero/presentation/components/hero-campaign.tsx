import Link from "next/link";

import type { HeroCampaign as HeroCampaignType } from "@/core/types/commerce";
import { Container } from "@/core/ui/container";
import { safeHref } from "@/core/utils/safe-href";

export function HeroCampaign({
  campaign,
}: {
  campaign: HeroCampaignType;
}) {
  return (
    <section className="relative overflow-hidden py-6 md:py-10">
      <Container>
        <div className="noise-overlay relative overflow-hidden rounded-[2rem] border border-white/8 bg-[linear-gradient(135deg,rgba(26,25,24,0.98),rgba(11,11,11,0.88))] shadow-[var(--shadow-gold)]">
          <div className="grid min-h-[78svh] gap-8 p-6 md:p-10 lg:grid-cols-[1.05fr_0.95fr] lg:p-14">
            <div className="relative z-10 flex flex-col justify-between gap-10">
              <div>
                <p className="font-[family:var(--font-supporting)] text-xs uppercase tracking-[0.34em] text-[var(--color-accent-gold-highlight)]">
                  {campaign.eyebrow}
                </p>
                <h1 className="mt-5 max-w-4xl font-[family:var(--font-heading)] text-7xl uppercase leading-[0.88] text-[var(--color-text-primary)] sm:text-8xl lg:text-[10rem]">
                  {campaign.title}
                </h1>
                <p className="mt-4 max-w-xl font-[family:var(--font-supporting)] text-sm uppercase tracking-[0.28em] text-[var(--color-text-secondary)]">
                  {campaign.statement}
                </p>
                <p className="mt-6 max-w-2xl text-lg leading-8 text-[var(--color-text-secondary)] text-balance">
                  {campaign.description}
                </p>
              </div>

              <div className="flex flex-wrap gap-4">
                <Link
                  href={safeHref(campaign.primaryCta.href)}
                  className="rounded-full bg-[var(--color-accent-gold)] px-6 py-3 font-[family:var(--font-supporting)] text-xs uppercase tracking-[0.24em] text-black transition hover:bg-[var(--color-accent-gold-highlight)]"
                >
                  {campaign.primaryCta.label}
                </Link>
                <Link
                  href={safeHref(campaign.secondaryCta.href)}
                  className="rounded-full border border-[var(--color-border-strong)] px-6 py-3 font-[family:var(--font-supporting)] text-xs uppercase tracking-[0.24em] text-[var(--color-text-primary)] transition hover:bg-white/6"
                >
                  {campaign.secondaryCta.label}
                </Link>
              </div>

              {campaign.campaignStats.length > 0 && (
                <div className="grid gap-4 border-t border-white/8 pt-6 sm:grid-cols-3">
                  {campaign.campaignStats.map((stat) => (
                    <div key={stat.label}>
                      <p className="font-[family:var(--font-heading)] text-4xl uppercase leading-none text-[var(--color-text-primary)]">
                        {stat.value}
                      </p>
                      <p className="mt-2 font-[family:var(--font-supporting)] text-[10px] uppercase tracking-[0.24em] text-[var(--color-text-muted)]">
                        {stat.label}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="relative min-h-[28rem] overflow-hidden rounded-[1.6rem] border border-white/10 bg-black/35">
              {campaign.media.type === "video" ? (
                <video
                  autoPlay
                  muted
                  loop
                  playsInline
                  poster={campaign.media.posterUrl}
                  className="absolute inset-0 h-full w-full object-cover opacity-70"
                >
                  <source src={campaign.media.url} />
                </video>
              ) : (
                <img
                  src={campaign.media.url}
                  alt={campaign.media.alt}
                  className="absolute inset-0 h-full w-full object-cover opacity-70"
                />
              )}
              <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.16),rgba(0,0,0,0.7))]" />
              <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-6 p-6">
                <div>
                  <p className="font-[family:var(--font-supporting)] text-[10px] uppercase tracking-[0.3em] text-[var(--color-text-muted)]">
                    Launch Film
                  </p>
                  <p className="mt-2 max-w-sm font-[family:var(--font-heading)] text-4xl uppercase leading-none text-[var(--color-text-primary)]">
                    The first frame of the drop.
                  </p>
                </div>
                <div className="hidden rounded-full border border-white/10 bg-black/35 px-4 py-3 font-[family:var(--font-supporting)] text-[10px] uppercase tracking-[0.26em] text-[var(--color-text-secondary)] md:block">
                  Campaign motion
                </div>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
