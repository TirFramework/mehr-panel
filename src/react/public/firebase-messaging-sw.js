importScripts(
  "https://www.gstatic.com/firebasejs/10.8.0/firebase-app-compat.js"
);
importScripts(
  "https://www.gstatic.com/firebasejs/10.8.0/firebase-messaging-compat.js"
);

// Initialize the Firebase app in the service worker by passing the generated config
const firebaseConfig = {
  apiKey: "AIzaSyDwTbAMzNqsBimV8GXjtP6cTcVPm7fUC3Y",
  authDomain: "team-a1315.firebaseapp.com",
  projectId: "team-a1315",
  storageBucket: "team-a1315.appspot.com",
  messagingSenderId: "532528895072",
  appId: "1:532528895072:web:a998f17c8a124fb2b61f05",
};
firebase.initializeApp(firebaseConfig);

// Retrieve firebase messaging
const messaging = firebase.messaging();
