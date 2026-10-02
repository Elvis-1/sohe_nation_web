"use client";

import { ANALYTICS_CONFIGURED } from "./config";
import { openCookieSettings } from "./consent";

/** Footer link that reopens the consent panel; hidden when no tracker is configured. */
export function CookieSettingsButton({ className }: { className?: string }) {
  if (!ANALYTICS_CONFIGURED) return null;
  return (
    <button type="button" onClick={openCookieSettings} className={className}>
      Cookie settings
    </button>
  );
}
