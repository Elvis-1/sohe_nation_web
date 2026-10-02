// Only on routes that can never 404: a loading boundary starts streaming, which fixes the
// HTTP status at 200 before a page could call notFound().
export { PageSkeleton as default } from "@/core/ui/page-skeleton";
