/*
================================================
SK Job BD
Firebase Core Configuration
Version: 2.0
================================================
*/


// Firebase App
import { 
    initializeApp 
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";


// Firebase Database
import { 
    getDatabase,
    ref,
    push,
    set,
    get,
    update,
    remove,
    onValue,
    child
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-database.js";


// Firebase Authentication
import {
    getAuth,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut,
    onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";


// Firebase Storage
import {
    getStorage
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-storage.js";



// ================================================
// Firebase Configuration
// ================================================

const firebaseConfig = {

    apiKey: "AIzaSyBunjHskHSpPQHyyoaf1eMdx2E3ygw8Amw",

    authDomain: "sk-job-bd.firebaseapp.com",

    databaseURL:
    "https://sk-job-bd-default-rtdb.firebaseio.com",

    projectId:
    "sk-job-bd",

    storageBucket:
    "sk-job-bd.firebasestorage.app",

    messagingSenderId:
    "548971925971",

    appId:
    "1:548971925971:web:3526256d6b25456ed01f26",

    measurementId:
    "G-TFG7JG25GG"

};



// ================================================
// Initialize Firebase
// ================================================

const app = initializeApp(firebaseConfig);


const database = getDatabase(app);


const auth = getAuth(app);


const storage = getStorage(app);



// ================================================
// Global Access
// ================================================

window.firebaseApp = app;

window.database = database;

window.auth = auth;

window.storage = storage;



console.log(
"🔥 SK Job BD Firebase Connected Successfully"
);
