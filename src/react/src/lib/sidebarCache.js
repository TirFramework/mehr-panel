import { getApiToken } from "./authToken";

/** Keep in sync with clearApiToken() in authToken.js */
export const SIDEBAR_CACHE_KEY = "mp-sidebar-cache";

/** Persistent sidebar cache is production-only (skip in Vite DEV). */
const persistEnabled = !import.meta.env.DEV;

/**
 * Persist sidebar menu across full page reloads (sidebar-only).
 * Entries are scoped to the current api_token so users never share menus.
 */
export function readSidebarCache() {
  if (!persistEnabled) return null;

  const token = getApiToken();
  if (!token) return null;

  try {
    const raw = localStorage.getItem(SIDEBAR_CACHE_KEY);
    if (!raw) return null;

    const parsed = JSON.parse(raw);
    if (parsed?.token !== token) return null;
    if (!Array.isArray(parsed?.data)) return null;

    return {
      data: parsed.data,
      updatedAt: typeof parsed.updatedAt === "number" ? parsed.updatedAt : 0,
    };
  } catch {
    return null;
  }
}

export function writeSidebarCache(data) {
  if (!persistEnabled) return;

  const token = getApiToken();
  if (!token || !Array.isArray(data)) return;

  try {
    localStorage.setItem(
      SIDEBAR_CACHE_KEY,
      JSON.stringify({
        token,
        data,
        updatedAt: Date.now(),
      })
    );
  } catch {
    // Quota / private mode — ignore; in-memory query cache still works.
  }
}

export function clearSidebarCache() {
  try {
    localStorage.removeItem(SIDEBAR_CACHE_KEY);
  } catch {
    // ignore
  }
}
