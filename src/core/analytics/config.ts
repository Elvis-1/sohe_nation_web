// Public IDs, set per deployment. Leaving one unset turns that tracker off entirely; with
// neither set there is nothing optional to consent to, so no banner is shown.
export const GA_MEASUREMENT_ID = (process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID ?? "").trim();
export const META_PIXEL_ID = (process.env.NEXT_PUBLIC_META_PIXEL_ID ?? "").trim();

export const ANALYTICS_CONFIGURED = Boolean(GA_MEASUREMENT_ID || META_PIXEL_ID);
