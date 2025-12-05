// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration - MedAI Project
const firebaseConfig = {
  apiKey: "AIzaSyDMTYK6NDWmb1qSo8gp0mzolKcZ-eGG5dg",
  authDomain: "medai-ce771.firebaseapp.com",
  projectId: "medai-ce771",
  storageBucket: "medai-ce771.firebasestorage.app",
  messagingSenderId: "562867269914",
  appId: "1:562867269914:web:639d477fe78e77695cbca3",
  measurementId: "G-YEQ10JTZ5W",
};

// Debug: Log Firebase config on initialization
console.log("Firebase Config being used:", {
  apiKey: firebaseConfig.apiKey ? firebaseConfig.apiKey.substring(0, 15) + "..." : "MISSING",
  authDomain: firebaseConfig.authDomain,
  projectId: firebaseConfig.projectId,
});

// Initialize Firebase
const app = initializeApp(firebaseConfig);
console.log("Firebase app initialized:", app.name);

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);
console.log("Firebase Auth initialized for project:", app.options.projectId);
