// Firebase SDK
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.13.2/firebase-app.js";

import { 
    getFirestore 
} from "https://www.gstatic.com/firebasejs/10.13.2/firebase-firestore.js";


// Firebase Configuration

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


// Firestore

const db = getFirestore(app);


// Export

export { db };
