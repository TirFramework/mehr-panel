const API_TOKEN_KEY = "api_token";

function isValidToken(token) {
    return Boolean(token) && token !== "undefined" && token !== "null";
}

export function purgeInvalidApiToken() {
    const token = localStorage.getItem(API_TOKEN_KEY);

    if (token !== null && !isValidToken(token)) {
        localStorage.removeItem(API_TOKEN_KEY);
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
    return true;
}

export function clearApiToken() {
    localStorage.removeItem(API_TOKEN_KEY);
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
