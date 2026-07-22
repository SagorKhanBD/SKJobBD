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

// ================================================
// SK Job BD Database References
// ================================================


// Admin
const adminsRef = ref(database, "admins");


// Companies
const companiesRef = ref(database, "companies");


// Company Subscription
const subscriptionsRef = ref(database, "subscriptions");


// Jobs
const jobsRef = ref(database, "jobs");


// Job Applications
const applicationsRef = ref(database, "applications");


// Applicant Users
const usersRef = ref(database, "users");


// Company Wallet
const walletsRef = ref(database, "wallets");


// Wallet Transactions
const transactionsRef = ref(database, "transactions");


// Payment Records
const paymentsRef = ref(database, "payments");


// Education Institutions
const schoolsRef = ref(database, "schools");


// Student Results
const resultsRef = ref(database, "results");


// Website Settings
const settingsRef = ref(database, "settings");


// Advertisement System
const adsRef = ref(database, "ads");


// Premium Jobs
const premiumJobsRef = ref(database, "premiumJobs");



// ================================================
// Export References
// ================================================

window.DB = {

    adminsRef,

    companiesRef,

    subscriptionsRef,

    jobsRef,

    applicationsRef,

    usersRef,

    walletsRef,

    transactionsRef,

    paymentsRef,

    schoolsRef,

    resultsRef,

    settingsRef,

    adsRef,

    premiumJobsRef

};


console.log(
"✅ SK Job BD Database Structure Loaded"
);

// ================================================
// SK Job BD Helper Functions
// ================================================


// Generate Unique ID
function createID(){

    return Date.now().toString()
    + Math.random()
    .toString(36)
    .substring(2,10);

}



// Current Date

function currentDate(){

    let date = new Date();

    return date.toLocaleDateString("bn-BD");

}



// Current Time

function currentTime(){

    let time = new Date();

    return time.toLocaleTimeString("bn-BD");

}



// Format Number

function formatMoney(amount){

    return "৳ " + Number(amount).toFixed(2);

}



// Success Message

function showSuccess(message){

    alert(
        "✅ " + message
    );

}



// Error Message

function showError(message){

    alert(
        "❌ " + message
    );

}



// Loading Start

function loadingOn(){

    let loader =
    document.getElementById("loader");


    if(loader){

        loader.style.display="block";

    }

}



// Loading Stop

function loadingOff(){

    let loader =
    document.getElementById("loader");


    if(loader){

        loader.style.display="none";

    }

}



// ================================================
// Validation Functions
// ================================================


function validateEmail(email){

    return email.includes("@");

}



function validatePhone(phone){

    return phone.length >= 11;

}



// ================================================
// Global Export
// ================================================


window.SK = {

    createID,

    currentDate,

    currentTime,

    formatMoney,

    showSuccess,

    showError,

    loadingOn,

    loadingOff,

    validateEmail,

    validatePhone

};



console.log(
"🚀 SK Job BD Firebase Core Ready"
);

