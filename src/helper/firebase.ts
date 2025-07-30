import { initializeApp } from 'firebase/app';
import { getMessaging, getToken } from 'firebase/messaging';
  const firebaseConfig = {
  apiKey: "AIzaSyBnC9ZYgKU4F6bhM9_TWIkoQ1mBrnBsjNQ",
  authDomain: "hulu-c625c.firebaseapp.com",
  projectId: "hulu-c625c",
  storageBucket: "hulu-c625c.firebasestorage.app",
  messagingSenderId: "315817526361",
  appId: "1:315817526361:web:4133c6b2803b04dda0dd48",
  measurementId: "G-VVXBFM1G5L"
};

   // Initialize Firebase
   const app = initializeApp(firebaseConfig);
   const messaging = getMessaging(app);

   export { messaging, getToken };