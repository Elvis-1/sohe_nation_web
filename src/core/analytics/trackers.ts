/**
 * Command queues for GA4 (`dataLayer`/`gtag`) and the Meta Pixel (`fbq`), set up in code the
 * first time they are needed so events queue correctly however the external scripts load.
 * Only called once the matching consent category is granted.
 */

import { GA_MEASUREMENT_ID, META_PIXEL_ID } from "./config";
import type { ConsentChoice } from "./consent";

declare global {
  interface Window {
    dataLayer?: unknown[];
  }
}

type FbqQueue = ((...args: unknown[]) => void) & {
  callMethod?: (...args: unknown[]) => void;
  queue: unknown[];
  push: FbqQueue;
  loaded: boolean;
  version: string;
};

let gtagReady = false;
let fbqReady = false;

function consentSignals(choice: ConsentChoice) {
  const marketing = choice.marketing ? "granted" : "denied";
  return {
    analytics_storage: choice.analytics ? "granted" : "denied",
    ad_storage: marketing,
    ad_user_data: marketing,
    ad_personalization: marketing,
  };
}

/** GA4 with Consent Mode v2: everything denied by default, then the visitor's choice. */
export function ensureGtag(choice: ConsentChoice) {
  if (!GA_MEASUREMENT_ID || !choice.analytics) return;
  if (!gtagReady) {
    window.dataLayer = window.dataLayer ?? [];
    window.gtag = function gtag() {
      // gtag.js reads the `arguments` object itself, so push it unchanged.
      // eslint-disable-next-line prefer-rest-params
      window.dataLayer!.push(arguments);
    };
    window.gtag("consent", "default", {
      analytics_storage: "denied",
      ad_storage: "denied",
      ad_user_data: "denied",
      ad_personalization: "denied",
    });
    window.gtag("consent", "update", consentSignals(choice));
    window.gtag("js", new Date());
    window.gtag("config", GA_MEASUREMENT_ID);
    gtagReady = true;
    return;
  }
  window.gtag?.("consent", "update", consentSignals(choice));
}

export function withdrawGtag(choice: ConsentChoice) {
  if (gtagReady) window.gtag?.("consent", "update", consentSignals(choice));
}

/** Meta Pixel, only with marketing consent. */
export function ensureFbq() {
  if (!META_PIXEL_ID) return;
  if (!fbqReady) {
    if (!window.fbq) {
      const fbq = ((...args: unknown[]) => {
        if (fbq.callMethod) fbq.callMethod(...args);
        else fbq.queue.push(args);
      }) as FbqQueue;
      fbq.push = fbq;
      fbq.loaded = true;
      fbq.version = "2.0";
      fbq.queue = [];
      window.fbq = fbq;
    }
    window.fbq("consent", "grant");
    window.fbq("init", META_PIXEL_ID);
    fbqReady = true;
    return;
  }
  window.fbq?.("consent", "grant");
}

export function withdrawFbq() {
  if (fbqReady) window.fbq?.("consent", "revoke");
}
