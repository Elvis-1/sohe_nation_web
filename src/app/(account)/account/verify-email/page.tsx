import { Container } from "@/core/ui/container";
import { AccountVerifyEmailShell } from "@/features/account-auth/presentation/components/account-verify-email-shell";

export default function AccountVerifyEmailPage() {
  return (
    <Container className="py-10 md:py-14">
      <AccountVerifyEmailShell />
    </Container>
  );
}
