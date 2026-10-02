import type { Metadata } from "next";

import { AUDIENCE_LANDINGS } from "@/features/product-discovery/data/catalog-landings";
import {
  buildCatalogLandingMetadata,
  CatalogLandingView,
} from "@/features/product-discovery/presentation/components/catalog-landing-view";

type Props = { searchParams: Promise<{ [key: string]: string | string[] | undefined }> };

const landing = AUDIENCE_LANDINGS.men;

export async function generateMetadata({ searchParams }: Props): Promise<Metadata> {
  return buildCatalogLandingMetadata(landing, await searchParams);
}

export default async function MenLandingPage({ searchParams }: Props) {
  return <CatalogLandingView landing={landing} searchParams={await searchParams} />;
}
