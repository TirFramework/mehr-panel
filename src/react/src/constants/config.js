const path = window.location.pathname; // "/panelName/pageModule"
const parts = path.split("/");
const panelName = parts[1];

function parseDynamicPages() {
  try {
    const raw = import.meta.env.VITE_DYNAMIC_PAGES;
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

const Config = {
  defaultLang: import.meta.env.VITE_APP_DEFAULT_LANG || "en",
  apiBaseUrl: import.meta.env.VITE_APP_API_BASE_URL || `/api/v1`,
  storage: import.meta.env.VITE_APP_API_STORAGE || "/storage",
  tinyemcApiKey: import.meta.env.VITE_APP_TINYEMC,
  prefix: panelName,
  panelVersion: "12.7.9",
  interactionCharacter: import.meta.env.VITE_APP_INTERACTION_CHARACTER || "id",
  firebase: {
    apiKey: import.meta.env.VITE_APP_FIREBASE_API_KEY,
    authDomain: import.meta.env.VITE_APP_FIREBASE_AUTH_DOMAIN,
    projectId: import.meta.env.VITE_APP_FIREBASE_AUTH_PROJECT_ID,
    storageBucket: import.meta.env.VITE_APP_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: import.meta.env.VITE_APP_FIREBASE_MESSAGEING_SENDER_ID,
    appId: import.meta.env.VITE_APP_FIREBASE_APP_ID,
  },
  firebaseVapidKey: import.meta.env.VITE_APP_FIREBASE_VAPID_KEY,
  dynamicPages: parseDynamicPages(),
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
