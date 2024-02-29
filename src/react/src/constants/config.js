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
  panelVersion: "3.4.3-beta",
  interactionCharacter:
    process.env.MIX_APP_INTERACTION_CHARACTER ||
    process.env.REACT_APP_INTERACTION_CHARACTER ||
    "id",
  firebase: {
    apiKey:
      process.env.MIX_APP_FIREBASE_API_KEY ||
      process.env.REACT_APP_FIREBASE_API_KEY,
    authDomain:
      process.env.MIX_APP_FIREBASE_AUTH_DOMAIN ||
      process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
    projectId:
      process.env.MIX_APP_FIREBASE_AUTH_PROJECT_ID ||
      process.env.REACT_APP_FIREBASE_AUTH_PROJECT_ID,
    storageBucket:
      process.env.MIX_APP_FIREBASE_STORAGE_BUCKET ||
      process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
    messagingSenderId:
      process.env.MIX_APP_FIREBASE_MESSAGEING_SENDER_ID ||
      process.env.REACT_APP_FIREBASE_MESSAGEING_SENDER_ID,
    appId:
      process.env.MIX_APP_FIREBASE_APP_ID ||
      process.env.REACT_APP_FIREBASE_APP_ID,
  },
  firebaseVapidKey:
    process.env.MIX_APP_FIREBASE_VAPID_KEY ||
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
