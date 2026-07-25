// ======================================================
// SK Job BD
// Firebase Final Configuration
// ======================================================

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.13.2/firebase-app.js";

import { getFirestore } from "https://www.gstatic.com/firebasejs/10.13.2/firebase-firestore.js";

import { getAuth } from "https://www.gstatic.com/firebasejs/10.13.2/firebase-auth.js";

import { getStorage } from "https://www.gstatic.com/firebasejs/10.13.2/firebase-storage.js";

const firebaseConfig = {

    apiKey: "AIzaSyBunjHskHSpPQHyyoaf1eMdx2E3ygw8Amw",

    authDomain: "sk-job-bd.firebaseapp.com",

    projectId: "sk-job-bd",

    storageBucket: "sk-job-bd.firebasestorage.app",

    messagingSenderId: "548971925971",

    appId: "1:548971925971:web:3526256d6b25456ed01f26"

};

// Initialize Firebase

const app = initializeApp(firebaseConfig);

// Firestore

const db = getFirestore(app);

// Authentication

const auth = getAuth(app);

// Storage

const storage = getStorage(app);

// Export

export {

    app,

    db,

    auth,

    storage

};
