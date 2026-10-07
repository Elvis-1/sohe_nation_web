import type {
  ProductReturnPolicy,
  ProductReturnRule,
  RegionCode,
  StoreReturnRules,
} from "@/core/types/commerce";

export const DEFAULT_STORE_RETURN_RULES: StoreReturnRules = {
  returnWindowDays: 14,
  finalSaleRegions: ["NG", "GB", "US", "EU"],
};

const REGION_NAMES: Record<RegionCode, string> = {
  NG: "Nigeria",
  GB: "the UK",
  US: "the US",
  EU: "the EU",
};
const ALL_REGIONS = Object.keys(REGION_NAMES) as RegionCode[];

const POLICIES: ProductReturnPolicy[] = ["standard", "final_sale", "custom"];

/** Normalises the API's `return_policy` / `return_window_days`; unknown or missing → standard. */
export function toReturnRule(policy: string | undefined, windowDays: number | null | undefined): ProductReturnRule {
  const known = POLICIES.find((candidate) => candidate === policy) ?? "standard";
  return { policy: known, windowDays: known === "custom" ? (windowDays ?? null) : null };
}

/** Normalises the storefront settings `returns` block, keeping only known regions. */
export function toStoreReturnRules(
  api: { return_window_days?: number; final_sale_regions?: string[] } | undefined,
): StoreReturnRules {
  if (!api) return DEFAULT_STORE_RETURN_RULES;
  return {
    returnWindowDays: api.return_window_days || DEFAULT_STORE_RETURN_RULES.returnWindowDays,
    finalSaleRegions: (api.final_sale_regions ?? []).filter((code): code is RegionCode => code in REGION_NAMES),
  };
}

export type ReturnNotice = {
  text: string;
  /** Returnable only if faulty, for this delivery region or for some regions. */
  isFinalSale: boolean;
};

function joinNames(names: string[]): string {
  return names.length <= 1 ? names.join("") : `${names.slice(0, -1).join(", ")} and ${names.at(-1)}`;
}

/**
 * The return notice shown next to a product, bag line, or checkout line. Mirrors the API's
 * `resolve_line_rules`: final sale applies only to deliveries in the ticked regions. Pass the
 * delivery region once it is known (checkout); without it, the notice names the regions.
 */
export function describeReturnRule(
  rule: ProductReturnRule,
  store: StoreReturnRules,
  deliveryRegion?: RegionCode,
): ReturnNotice {
  const windowText = (days: number) => `Returnable within ${days} days of delivery.`;

  if (rule.policy === "custom" && rule.windowDays) {
    return { text: windowText(rule.windowDays), isFinalSale: false };
  }
  if (rule.policy !== "final_sale") {
    return { text: windowText(store.returnWindowDays), isFinalSale: false };
  }

  const regions = store.finalSaleRegions;
  const appliesHere = deliveryRegion
    ? regions.includes(deliveryRegion)
    : ALL_REGIONS.every((region) => regions.includes(region));
  if (appliesHere) {
    return { text: "Final sale: returnable only if faulty.", isFinalSale: true };
  }
  if (deliveryRegion || regions.length === 0) {
    return { text: windowText(store.returnWindowDays), isFinalSale: false };
  }
  return {
    text: `Final sale for delivery to ${joinNames(regions.map((region) => REGION_NAMES[region]))}: returnable only if faulty. Elsewhere, returnable within ${store.returnWindowDays} days of delivery.`,
    isFinalSale: true,
  };
}
