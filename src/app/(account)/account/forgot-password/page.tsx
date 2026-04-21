import { Container } from "@/core/ui/container";
import { AccountForgotPasswordShell } from "@/features/account-auth/presentation/components/account-forgot-password-shell";

export default function AccountForgotPasswordPage() {
  return (
    <Container className="py-10 md:py-14">
      <AccountForgotPasswordShell />
    </Container>
  );
}
