const path = window.location.pathname; // "/panelName/pageModule"
const parts = path.split("/");
const panelName = parts[1];

const Config = {
  defaultLang:
    process.env.PANEL_APP_DEFAULT_LANG ||
    process.env.REACT_APP_DEFAULT_LANG ||
    "en",
  apiBaseUrl:
    process.env.PANEL_APP_API_BASE_URL ||
    process.env.REACT_APP_API_BASE_URL ||
    `https://timeleft.test/api/v1`,
  storage:
    process.env.PANEL_APP_API_STORAGE ||
    process.env.REACT_APP_API_STORAGE ||
    "/storage",
  tinyemcApiKey: process.env.PANEL_APP_TINYEMC || process.env.REACT_APP_TINYEMC,
  perfix: panelName,
  panelVersion: "12.6",
  interactionCharacter:
    process.env.PANEL_APP_INTERACTION_CHARACTER ||
    process.env.REACT_APP_INTERACTION_CHARACTER ||
    "id",
  firebase: {
    apiKey:
      process.env.PANEL_APP_FIREBASE_API_KEY ||
      process.env.REACT_APP_FIREBASE_API_KEY,
    authDomain:
      process.env.PANEL_APP_FIREBASE_AUTH_DOMAIN ||
      process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
    projectId:
      process.env.PANEL_APP_FIREBASE_AUTH_PROJECT_ID ||
      process.env.REACT_APP_FIREBASE_AUTH_PROJECT_ID,
    storageBucket:
      process.env.PANEL_APP_FIREBASE_STORAGE_BUCKET ||
      process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
    messagingSenderId:
      process.env.PANEL_APP_FIREBASE_MESSAGEING_SENDER_ID ||
      process.env.REACT_APP_FIREBASE_MESSAGEING_SENDER_ID,
    appId:
      process.env.PANEL_APP_FIREBASE_APP_ID ||
      process.env.REACT_APP_FIREBASE_APP_ID,
  },
  firebaseVapidKey:
    process.env.PANEL_APP_FIREBASE_VAPID_KEY ||
    process.env.REACT_APP_FIREBASE_VAPID_KEY,
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
