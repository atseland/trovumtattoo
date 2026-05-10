export const ADMIN_SEARCH_SCAN_LIMIT = 1000
export const ADMIN_SEARCH_RESULT_LIMIT = 20

export function normalizeAdminSearchQuery(value: string) {
  return value.trim().toLowerCase()
}

export function adminSearchHasQuery(value: string) {
  return normalizeAdminSearchQuery(value).length >= 2
}

export function matchesAdminSearch(value: string, fields: Array<string | null | undefined>) {
  const normalizedQuery = normalizeAdminSearchQuery(value)
  if (normalizedQuery.length < 2) return false

  return fields
    .filter(Boolean)
    .join(' ')
    .toLowerCase()
    .includes(normalizedQuery)
}

export function limitAdminSearchResults<T>(rows: T[]) {
  return rows.slice(0, ADMIN_SEARCH_RESULT_LIMIT)
}
