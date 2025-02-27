import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyCUYu7PQYjRFiSIwHRjbSV-XAdHdE6ybLA",
  authDomain: "alcon-wis.firebaseapp.com",
  projectId: "alcon-wis",
  storageBucket: "alcon-wis.firebasestorage.app",
  messagingSenderId: "97112539232",
  appId: "1:97112539232:web:d13153b746bcad7a4f4305",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const storage = getStorage(app);

export { storage };
