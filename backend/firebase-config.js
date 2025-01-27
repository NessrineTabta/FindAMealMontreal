// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
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
const analytics = getAnalytics(app);