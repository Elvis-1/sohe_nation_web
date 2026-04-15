import { LookbookIndex } from "@/features/editorial/presentation/components/lookbook-card";
import { getLookbookStories } from "@/features/editorial/data/services/get-lookbook-story";

export default async function StoriesPage() {
  const stories = await getLookbookStories();

  return <LookbookIndex stories={stories} />;
}
