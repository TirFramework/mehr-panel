import { initializeApp } from "firebase/app";
import {
  getMessaging,
  getToken,
  onMessage,
  isSupported,
} from "firebase/messaging";
import Config from "../constants/config";

const firebaseConfig = Config.firebase;

console.log("🚀 ~ firebaseConfig:", firebaseConfig);

// Initialize Firebase

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
      console.log(
        "🚀 ~ file: firebase.js:44 ~ .then ~ currentToken:",
        currentToken
      );
      if (currentToken) {
        return currentToken;
        // Track the token -> client mapping, by sending to backend server
        // show on the UI that permission is secured
      } else {
        console.log(
          "No registration token available. Request permission to generate one."
        );
        return false;
        // shows on the UI that permission is required
      }
    })
    .catch((err) => {
      console.log("An error occurred while retrieving token. ", err);
      // catch error while creating client token
    });
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
  } catch (error) {
    console.log("An error occurred while getting user permission. ", error);
  }
};

// window.addEventListener("push", (event) => {
//   console.log("🚀 ~ window.addEventListener ~ event:", event);
// });
