import { NextResponse, type NextRequest } from "next/server";

import { CATEGORY_COLLECTIONS } from "@/features/product-discovery/data/catalog-landings";

/**
 * Permanently moves the old query-string catalog URLs to their landing pages so links and
 * search engines consolidate on one address:
 *   /products?gender=men&size=M      → /men?size=M
 *   /products?category=outerwear     → /collections/outerwear
 *   /products?gender=women&category=tops → /women?category=tops (category stays a filter)
 * Other /products URLs (search, unisex, size, price, sort) are left alone.
 */
export function proxy(request: NextRequest) {
  const url = request.nextUrl.clone();
  const gender = url.searchParams.get("gender")?.trim().toLowerCase() ?? "";
  const category = url.searchParams.get("category")?.trim().toLowerCase() ?? "";

  if (gender === "men" || gender === "women") {
    url.pathname = `/${gender}`;
    url.searchParams.delete("gender");
    return NextResponse.redirect(url, 308);
  }

  if (!gender && category && Object.hasOwn(CATEGORY_COLLECTIONS, category)) {
    url.pathname = `/collections/${CATEGORY_COLLECTIONS[category]}`;
    url.searchParams.delete("category");
    return NextResponse.redirect(url, 308);
  }

  return NextResponse.next();
}

export const config = {
  matcher: "/products",
};
