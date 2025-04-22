import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore, collection, addDoc } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDruvkq6yM-Wo4bSog1utflaiPz9Ttb41I",
  authDomain: "ai-tripplanner-13450.firebaseapp.com",
  projectId: "ai-tripplanner-13450",
  storageBucket: "ai-tripplanner-13450.firebasestorage.app",
  messagingSenderId: "475819053642",
  appId: "1:475819053642:web:262874f854d0607e5b0cb3",
  measurementId: "G-WJ8KN7V9FN",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const database = getFirestore(app);

export { app, auth, database, collection, addDoc };
