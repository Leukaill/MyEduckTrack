import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBrCKuMRbgUd_Oif1qvt7PeNELPoooOnZs",
  authDomain: "eductrack-v2.firebaseapp.com",
  projectId: "eductrack-v2",
  storageBucket: "eductrack-v2.firebasestorage.app",
  messagingSenderId: "1039036456847",
  appId: "1:1039036456847:web:696da8b4e0967d1062f5fa",
  measurementId: "G-58ND73P193"
};

// Initialize Firebase only if it hasn't been initialized already
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
export const auth = getAuth(app);
export const db = getFirestore(app);

export default app;
