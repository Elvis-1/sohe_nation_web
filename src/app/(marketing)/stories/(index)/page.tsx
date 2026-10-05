import type { Metadata } from "next";
import { connection } from "next/server";

import { buildPageMetadata } from "@/core/config/page-metadata";
import { LookbookIndex } from "@/features/editorial/presentation/components/lookbook-card";
import { getLookbookStories } from "@/features/editorial/data/services/get-lookbook-story";

export const metadata: Metadata = buildPageMetadata({
  title: "Stories and Lookbooks",
  description:
    "Campaign stories and lookbooks from Sohe's Nation: the drops, the styling, and the pieces behind each release.",
  path: "/stories",
});

export default async function StoriesPage() {
  // Render per request (content itself is cached briefly; see core/api/cache.ts).
  await connection();
  const stories = await getLookbookStories();

  return <LookbookIndex stories={stories} />;
}
