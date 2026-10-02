/**
 * Editorial reads (homepage, stories, information pages, store settings) change rarely, so
 * their API responses are kept in Next's data cache for a few minutes: pages still render per
 * request, but most requests skip the API round trip. Failed requests are never cached.
 * Catalog, stock, bag, checkout, and account reads stay uncached.
 */
export const CONTENT_REVALIDATE_SECONDS = 300;

export const cachedContentRequest: RequestInit = {
  next: { revalidate: CONTENT_REVALIDATE_SECONDS },
};
