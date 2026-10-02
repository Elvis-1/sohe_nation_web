import type { Metadata } from "next";

import { Container } from "@/core/ui/container";
import { NewsletterConfirmShell } from "@/features/newsletter/presentation/components/newsletter-confirm-shell";

export const metadata: Metadata = {
  title: "Confirm drop alerts",
  robots: { index: false, follow: false },
};

export default async function NewsletterConfirmPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const { token } = await searchParams;
  const value = Array.isArray(token) ? token[0] ?? "" : token ?? "";

  return (
    <Container className="py-10 md:py-14">
      <NewsletterConfirmShell token={value.trim()} />
    </Container>
  );
}
