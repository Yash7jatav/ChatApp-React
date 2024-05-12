import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_API_KEY,
  authDomain: "chatapp-react-41f6b.firebaseapp.com",
  projectId: "chatapp-react-41f6b",
  storageBucket: "chatapp-react-41f6b.appspot.com",
  messagingSenderId: "965431238464",
  appId: "1:965431238464:web:1908d611fa141c918be4a5"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth()
export const db = getFirestore()
export const storage = getStorage()