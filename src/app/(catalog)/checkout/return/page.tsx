import { Container } from "@/core/ui/container";
import { CheckoutReturnPageShell } from "@/features/cart-and-checkout/presentation/components/checkout-return-page-shell";

export default function CheckoutReturnPage() {
  return (
    <Container className="pb-20 pt-14 md:pb-28 md:pt-20">
      <CheckoutReturnPageShell />
    </Container>
  );
}
