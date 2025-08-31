
// firebase/firebaseConfig.ts
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getStorage } from "firebase/storage";

// Your Firebase config (replace with your real keys from Firebase Console)
const firebaseConfig = {
  apiKey: "AIzaSyDRrVmJHRbviqYgIx-ZR67-dMCgen6YoLU",
  authDomain: "yourtube-6a4a5.firebaseapp.com",
  projectId: "yourtube-6a4a5",
  storageBucket: "yourtube-6a4a5.firebasestorage.app",
  messagingSenderId: "475427234619",
  appId: "1:475427234619:web:7c63b447b0a9b2c7b3cd1e"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Firebase Authentication
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export const storage = getStorage(app);
export default app;