import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyC6xzb2p6z-8D5Zao91fYqTeas5KJxkxhQ",
  authDomain: "pos-system-39556.firebaseapp.com",
  projectId: "pos-system-39556",
  storageBucket: "pos-system-39556.firebasestorage.app",
  messagingSenderId: "444417495928",
  appId: "1:444417495928:web:7edd55880c991f3814ee8d",
  measurementId: "G-N1S79CGNTK"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);

export default app;