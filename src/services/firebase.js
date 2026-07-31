import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyD17rS1PqXR0GfiP3SXQPDBzTF8RjSs5-A",
  authDomain: "kota-plan.firebaseapp.com",
  projectId: "kota-plan",
  storageBucket: "kota-plan.firebasestorage.app",
  messagingSenderId: "154283828707",
  appId: "1:154283828707:web:a97a5b155bde4114912cd6"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Cloud Firestore and get a reference to the service
export const db = getFirestore(app);
