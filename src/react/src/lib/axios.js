import axios from "axios";
import Config from "../constants/config";
import Cookies from "js-cookie";
import ErrorHandler from "./helpers/ErrorHandler";

/**
 * Axios defaults
 */
axios.defaults.baseURL = Config.apiBaseUrl;

// Headers
axios.defaults.headers.common["Content-Type"] = "application/json";
axios.defaults.headers.common.Accept = "application/json";

const token = Cookies.get("api_token");
axios.defaults.headers.common = {
  Authorization: `Bearer ${token}`,
  Accept: "application/json",
};

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
    // if(token  inputConfig.url === '/login') {
    //   return inputConfig;
    // }

    return inputConfig;
  },
  (error) => {
    throw error;
  }
);
// Add a response interceptor
axios.interceptors.response.use(
  (response) => {
    // Any status code that lie within the range of 2xx cause this function to trigger
    // Do something with response data
    return response;
  },
  function (error) {
    ErrorHandler(error);
    // Any status codes that falls outside the range of 2xx cause this function to trigger
    // Do something with response error

    return Promise.reject(error);
  }
);

export default axios;
