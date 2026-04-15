import { Container } from "@/core/ui/container";
import { AccountReturnsExperience } from "@/features/account/presentation/components/account-returns-experience";

export default function AccountReturnsPage() {
  return (
    <Container className="py-10 md:py-14">
      <AccountReturnsExperience />
    </Container>
  );
}
