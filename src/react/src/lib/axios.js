import axios from "axios";
import Config from "../constants/config";
import Cookies from "js-cookie";
import { notification } from "antd";

/**
 * Axios defaults
 */
axios.defaults.baseURL = Config.apiBaseUrl;

// Headers
axios.defaults.headers.common["Content-Type"] = "application/json";
axios.defaults.headers.common.Accept = "application/json";

const token = Cookies.get("api_token");
axios.defaults.headers.common = { Authorization: `Bearer ${token}` };

axios.defaults.timeout = 5000;

// Add a request interceptor
axios.interceptors.request.use(
  (config) => {
    // Do something before request is sent

    // const token = Cookies.get('api_token')
    // config.params = { api_token: token };
    // config.params = { locale: 'Fa' };

    // console.log("🚀 ~ file: axios.js ~ line 26 ~ axios.interceptors.request.use ~ config", config)
    return config;
  },
  (error) => {
    // Do something with request error
    return Promise.reject(error);
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
    console.log("-> error", error);
    if (error.response.status === 401) {
      // Cookies.remove('token');
      // TODO: Add route path
      // window.location.replace('/admin/login');
    } else if (error.response.status === 403) {
      notification["error"]({
        message: error.message,
      });
    }
    // Any status codes that falls outside the range of 2xx cause this function to trigger
    // Do something with response error

    return Promise.reject(error);
  }
);

export default axios;
