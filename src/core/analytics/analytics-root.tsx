"use client";

import Script from "next/script";
import { usePathname } from "next/navigation";
import { useEffect, useState, useSyncExternalStore } from "react";

import { ANALYTICS_CONFIGURED, GA_MEASUREMENT_ID, META_PIXEL_ID } from "./config";
import {
  readConsent,
  subscribeToConsent,
  subscribeToOpenSettings,
  type ConsentChoice,
} from "./consent";
import { ConsentBanner } from "./consent-banner";
import { ensureFbq, ensureGtag, withdrawFbq, withdrawGtag } from "./trackers";

// The cookie string is compared by value so the snapshot is stable between reads.
let lastRaw: string | null = null;
let lastChoice: ConsentChoice | null = null;
function consentSnapshot(): ConsentChoice | null {
  const choice = readConsent();
  const raw = choice ? `${choice.analytics}:${choice.marketing}` : null;
  if (raw !== lastRaw) {
    lastRaw = raw;
    lastChoice = choice;
  }
  return lastChoice;
}

/**
 * Consent banner plus the tracker scripts, which load only after their category is accepted.
 * Renders nothing when no tracker is configured for this deployment.
 */
export function AnalyticsRoot() {
  if (!ANALYTICS_CONFIGURED) return null;
  return <ConfiguredAnalytics />;
}

function ConfiguredAnalytics() {
  const consent = useSyncExternalStore(subscribeToConsent, consentSnapshot, () => null);
  const hydrated = useSyncExternalStore(
    () => () => undefined,
    () => true,
    () => false,
  );
  const [settingsOpen, setSettingsOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => subscribeToOpenSettings(() => setSettingsOpen(true)), []);

  useEffect(() => {
    if (!consent) return;
    if (consent.analytics) ensureGtag(consent);
    else withdrawGtag(consent);
    if (consent.marketing) ensureFbq();
    else withdrawFbq();
  }, [consent]);

  // GA4 records page views itself (on `config`, then enhanced measurement for client-side
  // navigations); the Pixel needs one PageView per route.
  useEffect(() => {
    if (consent?.marketing && META_PIXEL_ID) {
      window.fbq?.("track", "PageView");
    }
  }, [pathname, consent?.marketing]);

  const showBanner = hydrated && (settingsOpen || !consent);

  return (
    <>
      {consent?.analytics && GA_MEASUREMENT_ID ? (
        <Script
          id="ga4"
          src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
          strategy="afterInteractive"
        />
      ) : null}
      {consent?.marketing && META_PIXEL_ID ? (
        <Script id="meta-pixel" src="https://connect.facebook.net/en_US/fbevents.js" strategy="afterInteractive" />
      ) : null}
      {showBanner ? (
        <ConsentBanner
          current={consent}
          offerMarketing={Boolean(META_PIXEL_ID)}
          offerAnalytics={Boolean(GA_MEASUREMENT_ID)}
          startExpanded={settingsOpen}
          onClose={() => setSettingsOpen(false)}
        />
      ) : null}
    </>
  );
}
