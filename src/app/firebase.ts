import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getAuth } from "firebase/auth";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyBwNNTbOw_SzfdTEGA9_jbGiYWBpqD8h0g",
  authDomain: "riyas-crochet-corner.firebaseapp.com",
  projectId: "riyas-crochet-corner",
  storageBucket: "riyas-crochet-corner.firebasestorage.app",
  messagingSenderId: "805907573879",
  appId: "1:805907573879:web:d355b6afd6be0acbf22a72",
  measurementId: "G-D5QSS1KEY9",
};

const app = initializeApp(firebaseConfig);

export const analytics = getAnalytics(app);

export const db = getFirestore(app);

export const storage = getStorage(app);

export const auth = getAuth(app);

export default app;
