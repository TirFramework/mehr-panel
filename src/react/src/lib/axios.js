import axios from "axios";
import Config from "../constants/config";
import { handleErrorSideEffects } from "./helpers/responseErrorHandler";
import { applyAuthHeader, getApiToken } from "./authToken";
import { parseJsonResponse } from "./parseJsonResponse";

/**
 * Dedicated Mehr Panel HTTP client — does not mutate global axios defaults,
 * so host-app requests stay unaffected.
 */
const panelAxios = axios.create({
    baseURL: Config.apiBaseUrl + "/" + Config.prefix,
    timeout: 600000,
    headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
    },
    paramsSerializer: (params) => {
        const oldData = { ...params };
        const newData = {};

        Object.keys(oldData).forEach((key) => {
            if (oldData[key] !== null) {
                if (typeof oldData[key] === "object") {
                    newData[key] = JSON.stringify(oldData[key]);
                } else {
                    newData[key] = oldData[key];
                }
            }
        });
        return new URLSearchParams(newData).toString();
    },
});

delete panelAxios.defaults.headers.common.Authorization;

panelAxios.interceptors.request.use(
    async (inputConfig) => {
        applyAuthHeader(inputConfig.headers, getApiToken());
        delete panelAxios.defaults.headers.common.Authorization;

        return inputConfig;
    },
    (error) => {
        throw error;
    },
);

panelAxios.interceptors.response.use(
    (response) => {
        response.data = parseJsonResponse(response.data);
        return response;
    },
    async (error) => {
        if (error?.response?.data instanceof Blob) {
            try {
                const text = await error.response.data.text();
                error.response.data = JSON.parse(text);
            } catch {
                // Keep the original blob if parsing fails
            }
        } else if (error?.response?.data !== undefined) {
            error.response.data = parseJsonResponse(error.response.data);
        }

        handleErrorSideEffects(error);
        return Promise.reject(error);
    },
);

export default panelAxios;
