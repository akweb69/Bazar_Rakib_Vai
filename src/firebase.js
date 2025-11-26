// firebase.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyAA4ZVtYlgYaJe-QZSYVOwWIlKg5FJqtpM",
  authDomain: "my-meal-ca4d9.firebaseapp.com",
  projectId: "my-meal-ca4d9",
  storageBucket: "my-meal-ca4d9.firebasestorage.app",
  messagingSenderId: "1080440226094",
  appId: "1:1080440226094:web:f791ed9fe545139b58fabf",
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
