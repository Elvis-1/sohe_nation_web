import { Container } from "@/core/ui/container";
import { AccountResetPasswordShell } from "@/features/account-auth/presentation/components/account-reset-password-shell";

export default function AccountResetPasswordPage() {
  return (
    <Container className="py-10 md:py-14">
      <AccountResetPasswordShell />
    </Container>
  );
}
