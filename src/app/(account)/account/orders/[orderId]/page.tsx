import { Container } from "@/core/ui/container";
import { AccountOrderDetailExperience } from "@/features/account/presentation/components/account-order-detail-experience";

type AccountOrderDetailPageProps = {
  params: Promise<{ orderId: string }>;
};

export default async function AccountOrderDetailPage({ params }: AccountOrderDetailPageProps) {
  const { orderId } = await params;

  return (
    <Container className="py-10 md:py-14">
      <AccountOrderDetailExperience orderId={orderId} />
    </Container>
  );
}
