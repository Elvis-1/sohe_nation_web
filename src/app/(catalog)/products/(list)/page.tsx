import type { Metadata } from "next";

import { ALL_PRODUCTS_LANDING } from "@/features/product-discovery/data/catalog-landings";
import {
  buildCatalogLandingMetadata,
  CatalogLandingView,
} from "@/features/product-discovery/presentation/components/catalog-landing-view";

type Props = { searchParams: Promise<{ [key: string]: string | string[] | undefined }> };

// `?gender=men|women` and `?category=` alone are redirected to their landing pages by src/proxy.ts.
export async function generateMetadata({ searchParams }: Props): Promise<Metadata> {
  return buildCatalogLandingMetadata(ALL_PRODUCTS_LANDING, await searchParams);
}

export default async function ProductsPage({ searchParams }: Props) {
  return <CatalogLandingView landing={ALL_PRODUCTS_LANDING} searchParams={await searchParams} />;
}
