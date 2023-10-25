import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyA61_a1cztE7_ygTRUdET6qN62cnYrOMvY",
  authDomain: "beautyverse-87e3a.firebaseapp.com",
  projectId: "beautyverse-87e3a",
  storageBucket: "beautyverse-87e3a.appspot.com",
  messagingSenderId: "854934438439",
  appId: "1:854934438439:web:737684e0ba31100885c402",
  measurementId: "G-9VE3E4TXDD",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
