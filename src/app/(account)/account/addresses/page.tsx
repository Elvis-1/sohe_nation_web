import { Container } from "@/core/ui/container";
import { AccountAddressesExperience } from "@/features/account/presentation/components/account-addresses-experience";

export default function AccountAddressesPage() {
  return (
    <Container className="py-10 md:py-14">
      <AccountAddressesExperience />
    </Container>
  );
}
