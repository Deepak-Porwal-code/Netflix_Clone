import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDwazkD44atJ8VEM0CfLjlBsCzJ61a-1n8",
  authDomain: "netflix-clone-8bb12.firebaseapp.com",
  projectId: "netflix-clone-8bb12",
  storageBucket: "netflix-clone-8bb12.firebasestorage.app",
  messagingSenderId: "610115468079",
  appId: "1:610115468079:web:25039f9821bdc7e6f63fda",
  measurementId: "G-KEPS4P2LP4"
};

const app = initializeApp(firebaseConfig);
export const firebaseAuth = getAuth(app);