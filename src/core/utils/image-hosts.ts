// Keep in sync with `images.remotePatterns` in next.config.ts.
const OPTIMIZED_IMAGE_HOSTS = new Set(["images.unsplash.com", "res.cloudinary.com"]);

/**
 * Whether next/image may optimise this URL. Staff can paste any image address into content,
 * and next/image throws for hosts it is not configured for, so others are served unoptimised.
 */
export function canOptimizeImage(url: string): boolean {
  if (url.startsWith("/") && !url.startsWith("//")) return true;
  try {
    const parsed = new URL(url);
    return parsed.protocol === "https:" && OPTIMIZED_IMAGE_HOSTS.has(parsed.hostname);
  } catch {
    return false;
  }
}

// Cloudinary delivery settings for background video: automatic "eco" quality and at most
// 960px wide (the hero shows it in half the viewport). Cuts the launch film from ~2.3 MB to ~0.4 MB.
const CLOUDINARY_VIDEO_TRANSFORM = "q_auto:eco,w_960";

/** Serve Cloudinary videos compressed; leave other hosts and already-transformed URLs alone. */
export function optimizeVideoUrl(url: string): string {
  try {
    const parsed = new URL(url);
    if (parsed.hostname !== "res.cloudinary.com") return url;
    const marker = "/video/upload/";
    const at = parsed.pathname.indexOf(marker);
    if (at === -1) return url;
    const rest = parsed.pathname.slice(at + marker.length);
    const firstSegment = rest.split("/")[0];
    // A version ("v1777113777") or folder name means no transformation is set yet.
    if (/^[a-z]{1,3}_/.test(firstSegment)) return url;
    parsed.pathname = `${parsed.pathname.slice(0, at + marker.length)}${CLOUDINARY_VIDEO_TRANSFORM}/${rest}`;
    return parsed.toString();
  } catch {
    return url;
  }
}
