export type LookbookStory = {
  slug: string;
  eyebrow: string;
  title: string;
  summary: string;
  heroMedia: {
    type: "image" | "video";
    url: string;
    posterUrl?: string;
    alt: string;
  };
  chapterLabel: string;
  campaignStatement: string;
  modules: Array<{
    title: string;
    body: string;
  }>;
  hotspots: Array<{
    id: string;
    label: string;
    productSlug: string;
    top: string;
    left: string;
    note: string;
  }>;
};
