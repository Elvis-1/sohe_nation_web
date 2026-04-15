export type HomepageCampaignDto = {
  hero: {
    eyebrow: string;
    title: string;
    statement: string;
    description: string;
    primaryCta: {
      label: string;
      href: string;
    };
    secondaryCta: {
      label: string;
      href: string;
    };
    campaignStats: Array<{
      label: string;
      value: string;
    }>;
    media: {
      id: string;
      type: "image" | "video";
      url: string;
      posterUrl?: string;
      alt: string;
    };
  };
};
