const Config = {
  apiBaseUrl:
    process.env.MIX_APP_API_BASE_URL ||
    process.env.REACT_APP_API_BASE_URL ||
    "http://localhost:8000/api/v1/admin",
  storage:
    process.env.MIX_APP_API_STORAGE ||
    process.env.REACT_APP_API_STORAGE ||
    "/storage",
  tinyemcApiKey: process.env.MIX_APP_TINYEMC || process.env.REACT_APP_TINYEMC,
};

export default Config;
