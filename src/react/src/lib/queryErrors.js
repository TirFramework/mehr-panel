/**
 * HTTP status from a TanStack Query error result (axios-style).
 * @param {{ isError?: boolean, error?: { response?: { status?: number } } }} query
 * @returns {number | null}
 */
export function getQueryHttpStatus(query) {
  if (!query?.isError) return null;
  const status = query.error?.response?.status;
  return typeof status === "number" ? status : null;
}

/**
 * Axios / query failure that must not be retried or refetched.
 */
export function isAccessDeniedStatus(status) {
  return status === 403 || status === 404;
}

export function isAccessDeniedError(error) {
  return isAccessDeniedStatus(error?.response?.status);
}

/**
 * True when load failed with 404 or 403 — show access/error page like NotFound.
 * @param {object} query
 */
export function isQueryLoadBlocked(query) {
  return isAccessDeniedStatus(getQueryHttpStatus(query));
}

/**
 * Pick the most relevant blocked status from several queries (403 preferred over 404).
 * @param {...object} queries
 * @returns {404 | 403 | null}
 */
export function getLoadBlockedStatus(...queries) {
  let found404 = false;
  for (const query of queries) {
    const status = getQueryHttpStatus(query);
    if (status === 403) return 403;
    if (status === 404) found404 = true;
  }
  return found404 ? 404 : null;
}

/**
 * Shared React Query options for module loads (index/list/create/detail).
 * After a 403/404, do not hit the API again on remount/reconnect.
 */
export const moduleLoadQueryOptions = {
  retry: false,
  retryOnMount: false,
  refetchOnMount: false,
  refetchOnReconnect: false,
  refetchOnWindowFocus: false,
};
