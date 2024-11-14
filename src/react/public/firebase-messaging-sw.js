importScripts(
  "https://www.gstatic.com/firebasejs/10.7.2/firebase-app-compat.js"
);
importScripts(
  "https://www.gstatic.com/firebasejs/10.7.2/firebase-messaging-compat.js"
);

// Initialize the Firebase app in the service worker by passing the generated config
const firebaseConfig = {
  apiKey: "AIzaSyBNSWwoEmgNeFmEXGlZbHSaO5X74qUNdY8",
  authDomain: "test-for-dev-4c979.firebaseapp.com",
  projectId: "test-for-dev-4c979",
  storageBucket: "test-for-dev-4c979.appspot.com",
  messagingSenderId: "34527836370",
  appId: "1:34527836370:web:4713867b83e73c42f2950b",
};
firebase.initializeApp(firebaseConfig);

// Retrieve firebase messaging
const messaging = firebase.messaging();
