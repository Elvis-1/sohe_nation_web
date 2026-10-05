import type { Metadata } from "next";

import { PRIVATE_PAGE_ROBOTS } from "@/core/config/page-metadata";
import { Container } from "@/core/ui/container";
import { CheckoutReturnPageShell } from "@/features/cart-and-checkout/presentation/components/checkout-return-page-shell";

export const metadata: Metadata = { title: "Payment status", robots: PRIVATE_PAGE_ROBOTS };

export default function CheckoutReturnPage() {
  return (
    <Container className="pb-20 pt-14 md:pb-28 md:pt-20">
      <CheckoutReturnPageShell />
    </Container>
  );
}
