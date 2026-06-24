import { initializeApp } from "firebase/app";
import {
  getMessaging,
  getToken,
  onMessage,
  isSupported,
} from "firebase/messaging";
import Config from "../constants/config";

const firebaseConfig = Config.firebase;

export const isWindowSupported = () => {
  return isSupported();
};

let firebaseApp;
let messaging;
(async () => {
  if (Config.firebase.projectId) {
    const arr = await isWindowSupported();
    if (arr) {
      firebaseApp = initializeApp(firebaseConfig);
      messaging = getMessaging(firebaseApp);
    }
  }
})();

export const fetchToken = () => {
  return getToken(messaging, {
    vapidKey: Config.firebaseVapidKey,
  })
    .then((currentToken) => {
      if (currentToken) {
        return currentToken;
      }
      return false;
    })
    .catch(() => false);
};

export const onMessageListener = () => {
  return new Promise((resolve) => {
    onMessage(messaging, (payload) => {
      resolve(payload);
    });
  });
};

export const requestForToken = async () => {
  try {
    const permission = await Notification.requestPermission();
    if (permission === "granted") {
      return await fetchToken();
    }
  } catch {
    return false;
  }
};
