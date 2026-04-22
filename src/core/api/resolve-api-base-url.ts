const DEFAULT_API_BASE_URL = "https://sohe-nation-api.onrender.com/api/v1";

type ResolveApiBaseUrlOptions = {
  preferInternal?: boolean;
};

function normalizeBaseUrl(value: string | undefined): string {
  return (value ?? "").trim().replace(/\/+$/, "");
}

export function resolveApiBaseUrl(options: ResolveApiBaseUrlOptions = {}): string {
  const preferInternal =
    options.preferInternal ?? (typeof window === "undefined");

  const internalBaseUrl = normalizeBaseUrl(process.env.API_INTERNAL_BASE_URL);
  const publicBaseUrl = normalizeBaseUrl(process.env.NEXT_PUBLIC_API_BASE_URL);

  if (preferInternal && internalBaseUrl) {
    return internalBaseUrl;
  }
  if (publicBaseUrl) {
    return publicBaseUrl;
  }
  if (internalBaseUrl) {
    return internalBaseUrl;
  }
  return DEFAULT_API_BASE_URL;
}
