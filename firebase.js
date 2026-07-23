// Firebase SDK
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.13.2/firebase-app.js";

import { getAuth } from "https://www.gstatic.com/firebasejs/10.13.2/firebase-auth.js";

import { getFirestore } from "https://www.gstatic.com/firebasejs/10.13.2/firebase-firestore.js";

// Firebase Config
const firebaseConfig = {
  apiKey: "AIzaSyBunjHskHSpPQHyyoaf1eMdx2E3ygw8Amw",
  authDomain: "sk-job-bd.firebaseapp.com",
  databaseURL: "https://sk-job-bd-default-rtdb.firebaseio.com",
  projectId: "sk-job-bd",
  storageBucket: "sk-job-bd.firebasestorage.app",
  messagingSenderId: "548971925971",
  appId: "1:548971925971:web:3526256d6b25456ed01f26",
  measurementId: "G-TFG7JG25GG"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Authentication
const auth = getAuth(app);

// Firestore Database
const db = getFirestore(app);

// Export
export { auth, db };
