const BOM = "\uFEFF";

export function parseJsonResponse(data) {
    if (data === null || data === undefined) {
        return data;
    }

    if (typeof data !== "string") {
        return data;
    }

    const trimmed = data.replace(/^\uFEFF/, "").trim();

    if (!trimmed) {
        return data;
    }

    try {
        return JSON.parse(trimmed);
    } catch {
        return data;
    }
}
