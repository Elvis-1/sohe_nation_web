import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { connection } from "next/server";

import {
  buildPageMetadata,
  shareImagesFromMedia,
  shareImagesWithOverride,
} from "@/core/config/page-metadata";
import { Container } from "@/core/ui/container";
import { getLookbookStory } from "@/features/editorial/data/services/get-lookbook-story";
import { LookbookHotspots } from "@/features/editorial/presentation/components/lookbook-hotspots";
import { RelatedProducts } from "@/features/product-detail/presentation/components/related-products";

type Params = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const story = await getLookbookStory(slug).catch(() => null);
  if (!story) {
    return {};
  }
  return buildPageMetadata({
    title: story.seo?.title || story.title,
    description: story.seo?.description || story.summary || story.campaignStatement || story.title,
    path: `/stories/${story.slug}`,
    images: shareImagesWithOverride(story.seo, story.title, shareImagesFromMedia([story.heroMedia])),
    type: "article",
  });
}

export default async function StoryPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  await connection();
  const { slug } = await params;
  const story = await getLookbookStory(slug);

  if (!story) {
    notFound();
  }

  return (
    <Container className="py-10 md:py-14">
      <LookbookHotspots story={story} />

      <div className="mt-8">
        <RelatedProducts products={story.linkedProducts} />
      </div>
    </Container>
  );
}
