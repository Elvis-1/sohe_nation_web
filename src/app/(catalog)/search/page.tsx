import { redirect } from "next/navigation";

export default async function SearchRoute({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const resolvedSearchParams = await searchParams;
  const queryValue = resolvedSearchParams.query;
  const query = Array.isArray(queryValue) ? queryValue[0] ?? "" : queryValue ?? "";
  const trimmed = query.trim();

  if (trimmed) {
    redirect(`/products?query=${encodeURIComponent(trimmed)}`);
  }

  redirect("/products");
}
