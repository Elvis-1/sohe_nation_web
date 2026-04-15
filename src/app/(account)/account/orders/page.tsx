import { Container } from "@/core/ui/container";
import { AccountOrdersExperience } from "@/features/account/presentation/components/account-orders-experience";

export default function AccountOrdersPage() {
  return (
    <Container className="py-10 md:py-14">
      <AccountOrdersExperience />
    </Container>
  );
}
