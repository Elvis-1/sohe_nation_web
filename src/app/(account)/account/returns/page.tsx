import { Container } from "@/core/ui/container";
import { AccountReturnsExperience } from "@/features/account/presentation/components/account-returns-experience";

type Props = { searchParams: Promise<{ order?: string | string[] }> };

export default async function AccountReturnsPage({ searchParams }: Props) {
  const { order } = await searchParams;
  return (
    <Container className="py-10 md:py-14">
      <AccountReturnsExperience initialOrderId={typeof order === "string" ? order : undefined} />
    </Container>
  );
}
