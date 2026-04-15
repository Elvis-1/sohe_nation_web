import type { HomepageCampaign } from "@/features/hero/domain/entities/homepage-campaign";

import type { HomepageCampaignDto } from "../dto/homepage-content-dto";

export function mapHomepageCampaign(dto: HomepageCampaignDto): HomepageCampaign {
  return {
    eyebrow: dto.hero.eyebrow,
    title: dto.hero.title,
    statement: dto.hero.statement,
    description: dto.hero.description,
    primaryCta: dto.hero.primaryCta,
    secondaryCta: dto.hero.secondaryCta,
    campaignStats: dto.hero.campaignStats,
    media: dto.hero.media,
  };
}
