// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {getAuth} from "firebase/auth"


const firebaseConfig = {
  apiKey:import.meta.env.VITE_FIREBASE_API,
  authDomain: "merkova-f9cbc.firebaseapp.com",
  projectId: "merkova-f9cbc",
  storageBucket: "merkova-f9cbc.firebasestorage.app",
  messagingSenderId: "862932960962",
  appId: "1:862932960962:web:cb39e243108fadfd349d5b",
  measurementId: "G-EREH30ZYG9"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const Auth=getAuth(app)
export {app,Auth}