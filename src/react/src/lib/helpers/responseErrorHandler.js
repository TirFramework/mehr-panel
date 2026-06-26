import Config from "../../constants/config";
import { clearApiToken } from "../authToken";
import { getT } from "../../context/translations";

const DEFAULT_DURATION = 10;

const normalizeDuration = (value) => {
    if (value === undefined || value === null || value === "undefined") {
        return DEFAULT_DURATION;
    }
    const numeric = Number(value);
    return Number.isNaN(numeric) ? DEFAULT_DURATION : numeric;
};

export const handleErrorSideEffects = (error) => {
    const response = error?.response;
    const data = response?.data;

    if (!response) {
        return;
    }

    if (data?.redirect !== undefined) {
        const page = window.location.pathname + window.location.search;
        const redirect = `/${Config.prefix}${data.redirect}`;

        setTimeout(() => {
            if (page !== redirect) {
                window.location.replace(redirect);
            }
        }, 500);
    }

    if (response.status === 401) {
        clearApiToken();
        setTimeout(() => {
            if (window.location.pathname !== `/${Config.prefix}/login`) {
                window.location.replace(`/${Config.prefix}/login`);
            }
        }, 1000);
    }
};

const responseErrorHandler = (error) => {
    const t = getT(document.documentElement.lang || "en");
    const data = error?.response?.data;
    const messages = [];

    if (!error?.response) {
        return {
            message: t.ERROR_UNKNOWN,
            duration: DEFAULT_DURATION,
            description: null,
        };
    }

    if (data?.message) {
        if (typeof data.message === "object") {
            Object.values(data.message).forEach((value) => {
                if (Array.isArray(value)) {
                    messages.push(...value);
                } else if (value) {
                    messages.push(String(value));
                }
            });
        } else {
            messages.push(String(data.message));
        }

        return {
            message: data.title || t.ERROR_TITLE,
            description: messages.length > 0 ? messages : null,
            duration: normalizeDuration(data.duration),
        };
    }

    return {
        message: t.ERROR_UNKNOWN,
        duration: normalizeDuration(data?.duration),
        description: null,
    };
};

export default responseErrorHandler;
