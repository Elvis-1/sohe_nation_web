import { StorefrontShell } from "@/features/navigation/presentation/components/storefront-shell";

export default function AccountLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <StorefrontShell>{children}</StorefrontShell>;
}
