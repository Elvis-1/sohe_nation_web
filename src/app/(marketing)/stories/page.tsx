import { LookbookIndex } from "@/features/editorial/presentation/components/lookbook-card";
import { getLookbookStories } from "@/features/editorial/data/services/get-lookbook-story";

export const dynamic = "force-dynamic";

export default async function StoriesPage() {
  const stories = await getLookbookStories();

  return <LookbookIndex stories={stories} />;
}
