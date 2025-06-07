// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from 'firebase/firestore'
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "find-my-company-30652.firebaseapp.com",
  projectId: "find-my-company-30652",
  storageBucket: "find-my-company-30652.firebasestorage.app",
  messagingSenderId: "563118719650",
  appId: "1:563118719650:web:ebaaf3d949d66323168dfb",
  measurementId: "G-LYWPQXCMYB"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app)
export { db }
