import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { getCollectionLanding } from "@/features/product-discovery/data/catalog-landings";
import {
  buildCatalogLandingMetadata,
  CatalogLandingView,
} from "@/features/product-discovery/presentation/components/catalog-landing-view";

type Props = {
  params: Promise<{ collection: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export async function generateMetadata({ params, searchParams }: Props): Promise<Metadata> {
  const landing = getCollectionLanding((await params).collection);
  return landing ? buildCatalogLandingMetadata(landing, await searchParams) : {};
}

export default async function CollectionPage({ params, searchParams }: Props) {
  const landing = getCollectionLanding((await params).collection);
  if (!landing) {
    notFound();
  }
  return <CatalogLandingView landing={landing} searchParams={await searchParams} />;
}
