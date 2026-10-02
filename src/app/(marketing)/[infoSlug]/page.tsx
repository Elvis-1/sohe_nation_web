import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { connection } from "next/server";

import { buildPageMetadata } from "@/core/config/page-metadata";
import { Container } from "@/core/ui/container";
import { getInfoPage } from "@/features/info-pages/data/services/get-info-page";
import { InfoPageView } from "@/features/info-pages/presentation/components/info-page-view";

// Information and legal pages (/about, /privacy, ...). Only the slugs listed in
// INFO_PAGES resolve; everything else at the root 404s.
type Params = { params: Promise<{ infoSlug: string }> };

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { infoSlug } = await params;
  const page = await getInfoPage(infoSlug).catch(() => null);
  if (!page) {
    return {};
  }
  return buildPageMetadata({
    title: page.title,
    description: page.summary || page.title,
    path: `/${page.slug}`,
  });
}

export default async function InfoPageRoute({ params }: Params) {
  await connection();
  const { infoSlug } = await params;
  const page = await getInfoPage(infoSlug);

  if (!page) {
    notFound();
  }

  return (
    <Container className="py-10 md:py-14">
      <InfoPageView page={page} />
    </Container>
  );
}
