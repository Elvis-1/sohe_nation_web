import { storefrontMock } from "@/mocks/storefront";

import type { HomepageCampaignDto } from "../dto/homepage-content-dto";
import { mapHomepageCampaign } from "../mappers/map-homepage-campaign";

export async function getHomepageCampaign() {
  const dto: HomepageCampaignDto = {
    hero: storefrontMock.heroCampaign,
  };

  return mapHomepageCampaign(dto);
}
