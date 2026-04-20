import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, EmailAuthProvider, PhoneAuthProvider } from "firebase/auth";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyBxik7Z1vtUY79h3aQzD1I9Lb935v92g-0",
  authDomain: "medidosecare.firebaseapp.com",
  projectId: "medidosecare",
  storageBucket: "medidosecare.firebasestorage.app",
  messagingSenderId: "275331916292",
  appId: "1:275331916292:web:02bc5b8287477f3e6a0b51",
  measurementId: "G-N9G63L8MLM"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = typeof window !== 'undefined' ? getAnalytics(app) : null;

export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export { EmailAuthProvider, PhoneAuthProvider };
export { app, analytics };
