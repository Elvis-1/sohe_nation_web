import { notFound } from "next/navigation";

import { Container } from "@/core/ui/container";
import { getLookbookStory } from "@/features/editorial/data/services/get-lookbook-story";
import { LookbookHotspots } from "@/features/editorial/presentation/components/lookbook-hotspots";
import { RelatedProducts } from "@/features/product-detail/presentation/components/related-products";

export default async function StoryPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
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
