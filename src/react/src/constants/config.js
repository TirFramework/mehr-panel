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

// const domain =
//   process.env.MIX_APP_API_DOMAIN ||
//   process.env.REACT_APP_API_DOMAIN ||
//   "http://localhost:8000";
// const apiBasePATH =
//   process.env.MIX_APP_API_PATH ||
//   process.env.REACT_APP_API_PATH ||
//   "http://localhost:8000";

// const Config = {
//   domain: domain,
//   apiBaseUrl: `${domain}${apiBasePATH}`,
//   storage:
//     process.env.MIX_APP_API_STORAGE ||
//     process.env.REACT_APP_API_STORAGE ||
//     "/storage",
//   tinyemcApiKey: process.env.MIX_APP_TINYEMC || process.env.REACT_APP_TINYEMC,
// };

// export default Config;
