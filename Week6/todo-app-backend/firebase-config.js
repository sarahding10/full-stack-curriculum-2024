// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyA3DdoICxdgFcQPHwBPuMivLldKdEwTR7Y",
  authDomain: "todoapp-d2136.firebaseapp.com",
  projectId: "todoapp-d2136",
  storageBucket: "todoapp-d2136.firebasestorage.app",
  messagingSenderId: "837788957657",
  appId: "1:837788957657:web:9b0d7aa4cb1ca110f877c8",
  measurementId: "G-V5V8KLT4YP"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);