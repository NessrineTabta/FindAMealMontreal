// Import Firebase dependencies
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore"; 

// Firebase Configuration
const firebaseConfig = {
  apiKey: "AIzaSyDz65-F0EbmZplQ2kbIewXxzkWIy5Qut5U",
  authDomain: "tp1web-8cb6b.firebaseapp.com",
  projectId: "tp1web-8cb6b",
  storageBucket: "tp1web-8cb6b.appspot.com",
  messagingSenderId: "1051443096756",
  appId: "1:1051443096756:web:7d1e494952225f0ed43be1",
  measurementId: "G-D1EV07JTFY"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app); // ✅ Firestore Initialized

// Optional: Initialize Analytics ONLY if running in a browser
let analytics;
if (typeof window !== "undefined") {
  import("firebase/analytics").then(({ getAnalytics }) => {
    analytics = getAnalytics(app);
  });
}

export { db, app }; 
