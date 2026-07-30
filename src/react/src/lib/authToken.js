const API_TOKEN_KEY = "api_token";
export const API_TOKEN_CHANGED = "api_token_changed";

/** Keep in sync with lib/sidebarCache.js */
const SIDEBAR_CACHE_KEY = "mp-sidebar-cache";

function isValidToken(token) {
    return Boolean(token) && token !== "undefined" && token !== "null";
}

function notifyTokenChange() {
    window.dispatchEvent(new Event(API_TOKEN_CHANGED));
}

export function purgeInvalidApiToken() {
    const token = localStorage.getItem(API_TOKEN_KEY);

    if (token !== null && !isValidToken(token)) {
        localStorage.removeItem(API_TOKEN_KEY);
        notifyTokenChange();
    }
}

export function getApiToken() {
    purgeInvalidApiToken();
    const token = localStorage.getItem(API_TOKEN_KEY);

    return isValidToken(token) ? token : null;
}

export function setApiToken(token) {
    if (!isValidToken(token)) {
        return false;
    }

    localStorage.setItem(API_TOKEN_KEY, token);
    notifyTokenChange();
    return true;
}

export function clearApiToken() {
    localStorage.removeItem(API_TOKEN_KEY);
    // Sidebar-only persistent cache (see lib/sidebarCache.js)
    try {
        localStorage.removeItem(SIDEBAR_CACHE_KEY);
    } catch {
        // ignore
    }
    notifyTokenChange();
}

export function applyAuthHeader(headers, token = getApiToken()) {
    if (!headers) {
        return;
    }

    const value = token ? `Bearer ${token}` : null;

    if (typeof headers.set === "function") {
        if (value) {
            headers.set("Authorization", value);
        } else {
            headers.delete("Authorization");
        }
        return;
    }

    if (value) {
        headers.Authorization = value;
    } else {
        delete headers.Authorization;
    }
}

purgeInvalidApiToken();
