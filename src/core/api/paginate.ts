/** Largest `page_size` the API accepts (`api/apps/common/pagination.py`). */
export const MAX_PAGE_SIZE = 100;

type PageResult<T> = { count?: number; results?: T[] };

/**
 * Read every page of a paginated list endpoint.
 * Stops on a short page or once `count` records are collected.
 */
export async function fetchAllPages<T>(
  fetchPage: (page: number, pageSize: number) => Promise<PageResult<T>>,
): Promise<T[]> {
  const records: T[] = [];

  for (let page = 1; ; page += 1) {
    const { count, results = [] } = await fetchPage(page, MAX_PAGE_SIZE);
    records.push(...results);

    const reachedCount = typeof count === "number" && records.length >= count;
    if (results.length < MAX_PAGE_SIZE || reachedCount) {
      return records;
    }
  }
}

/** `?page=N&page_size=M` for list endpoints. */
export function pageQuery(page: number, pageSize: number, params?: URLSearchParams): string {
  const query = new URLSearchParams(params);
  query.set("page", String(page));
  query.set("page_size", String(pageSize));
  return `?${query}`;
}
