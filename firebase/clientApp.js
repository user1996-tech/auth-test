// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAxfvDgswRjlenYYQyHrOUMi99SIXzZ3S8",
  authDomain: "agehc-91a32.firebaseapp.com",
  databaseURL:
    "https://agehc-91a32-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "agehc-91a32",
  storageBucket: "agehc-91a32.appspot.com",
  messagingSenderId: "349919625170",
  appId: "1:349919625170:web:a96a78c2a01e954b48920b",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { app, db };
