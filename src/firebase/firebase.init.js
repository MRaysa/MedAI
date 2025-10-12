// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDp6kczSuYHLEybmJEyASrQHLZqiyUHl-k",
  authDomain: "all-projects-demo-auth.firebaseapp.com",
  projectId: "all-projects-demo-auth",
  storageBucket: "all-projects-demo-auth.firebasestorage.app",
  messagingSenderId: "363126145417",
  appId: "web:d305dbf8af5ae8d6c1a158",
  // apiKey: import.meta.env.VITE_API_KEY,
  // authDomain: import.meta.env.VITE_AUTH_DOMAIN,
  // projectId: import.meta.env.VITE_PROJECT_ID,
  // storageBucket: import.meta.env.VITE_STORAGE_BUCKET,
  // messagingSenderId: import.meta.env.VITE_MESSAGING_SENDER_ID,
  // appId: import.meta.env.VITE_APP_ID,
};

// console.log("API Key:", import.meta.env.VITE_API_KEY);
// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);
