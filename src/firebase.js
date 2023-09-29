import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyD6Is45YcFu8p3PoqpV1mcEhjZOZ9ydf5A",
  authDomain: "chrome-extension-ee1a5.firebaseapp.com",
  projectId: "chrome-extension-ee1a5",
  storageBucket: "chrome-extension-ee1a5.appspot.com",
  messagingSenderId: "478928576968",
  appId: "1:478928576968:web:965bf234f2c6cf077a60fd"
};

const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);