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
  panelVersion: "3.4.2-beta",
  interactionCharacter:
    process.env.MIX_APP_INTERACTION_CHARACTER ||
    process.env.REACT_APP_INTERACTION_CHARACTER ||
    "id",
};

export default Config;

export const defaultFilter = {
  current: 1,
  pageSize: 15,
  total: 0,
  search: null,
  filters: {},
  sorter: {},
};
