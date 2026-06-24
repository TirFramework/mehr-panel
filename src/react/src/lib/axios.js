import axios from "axios";
import Config from "../constants/config";
import responseErrorHandler from "./helpers/responseErrorHandler";
import { applyAuthHeader, getApiToken } from "./authToken";
import { parseJsonResponse } from "./parseJsonResponse";

/**
 * Axios defaults
 */

axios.defaults.baseURL = Config.apiBaseUrl + "/" + Config.perfix;

// Headers
axios.defaults.headers.common["Content-Type"] = "application/json";
axios.defaults.headers.common.Accept = "application/json";

delete axios.defaults.headers.common.Authorization;

axios.defaults.paramsSerializer = (params) => {
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
};

axios.defaults.timeout = 600000;

// Add a request interceptor
axios.interceptors.request.use(
    async (inputConfig) => {
        applyAuthHeader(inputConfig.headers, getApiToken());
        delete axios.defaults.headers.common.Authorization;

        return inputConfig;
    },
    (error) => {
        throw error;
    },
);
// Add a response interceptor
axios.interceptors.response.use(
    (response) => {
        response.data = parseJsonResponse(response.data);
        return response;
    },
    function (error) {
        if (error?.response?.data !== undefined) {
            error.response.data = parseJsonResponse(error.response.data);
        }
        responseErrorHandler(error);
        return Promise.reject(error);
    },
);

export default axios;
