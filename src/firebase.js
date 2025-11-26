// firebase.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyADtV06zQSN1mgfHPGyMd9XMrcnaBDbIl8",
  authDomain: "bazar-coltrolpanel.firebaseapp.com",
  projectId: "bazar-coltrolpanel",
  storageBucket: "bazar-coltrolpanel.firebasestorage.app",
  messagingSenderId: "434325187483",
  appId: "1:434325187483:web:2bbdf219d027545798cf3e",
  measurementId: "G-JRFJTKQ2XK",
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
