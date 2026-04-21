const BLOCKED_PROTOCOLS = ["javascript:", "data:", "vbscript:"];

export function safeHref(href: string | undefined | null, fallback = "/"): string {
  if (!href?.trim()) return fallback;
  const lower = href.trim().toLowerCase();
  if (BLOCKED_PROTOCOLS.some((proto) => lower.startsWith(proto))) return fallback;
  return href.trim();
}
