// ======================================================
// SK JOB BD
// COMPANY / EMPLOYER LOGIN SYSTEM
// ======================================================
//
// Login Method:
//
// Mobile Number
//       ↓
// Internal Firebase Auth Email
//       ↓
// Firebase Authentication
//       ↓
// Firestore companies/{UID}
//       ↓
// Dashboard
//
// Registration System-এর সঙ্গে সম্পূর্ণ সামঞ্জস্যপূর্ণ
// ======================================================


import { db, auth } from "../firebase.js";

import {
    doc,
    getDoc
} from "https://www.gstatic.com/firebasejs/10.13.2/firebase-firestore.js";

import {
    signInWithEmailAndPassword,
    signOut
} from "https://www.gstatic.com/firebasejs/10.13.2/firebase-auth.js";


// ======================================================
// HTML ELEMENTS
// ======================================================

const loginForm =
    document.getElementById("loginForm");

const message =
    document.getElementById("message");

const rememberMe =
    document.getElementById("rememberMe");

const passwordInput =
    document.getElementById("password");

const togglePassword =
    document.getElementById("togglePassword");


// ======================================================
// CREATE INTERNAL AUTH EMAIL
// ======================================================
//
// Registration-এর register.js-এও একই পদ্ধতি ব্যবহার করা হয়েছে:
//
// mobile + "@skjobbd-auth.local"
//
// উদাহরণ:
// 01827775115
//
// হবে:
//
// 01827775115@skjobbd-auth.local
// ======================================================

function createAuthEmail(mobile) {

    return (
        mobile +
        "@skjobbd-auth.local"
    );

}


// ======================================================
// SHOW MESSAGE
// ======================================================

function showMessage(
    text,
    color = "red"
) {

    if (!message) {
        return;
    }

    message.style.color =
        color;

    message.innerHTML =
        text;

}


// ======================================================
// MOBILE VALIDATION
// ======================================================

function isValidMobile(mobile) {

    const mobilePattern =
        /^01[3-9]\d{8}$/;

    return mobilePattern.test(
        mobile
    );

}


// ======================================================
// PASSWORD SHOW / HIDE
// ======================================================

if (
    passwordInput &&
    togglePassword
) {

    togglePassword.textContent =
        "👁";


    togglePassword.addEventListener(
        "click",
        () => {

            if (
                passwordInput.type ===
                "password"
            ) {

                passwordInput.type =
                    "text";

                togglePassword.textContent =
                    "👁";

            }

            else {

                passwordInput.type =
                    "password";

                togglePassword.textContent =
                    "👁";

            }

        }
    );

}


// ======================================================
// LOGIN FORM
// ======================================================

if (loginForm) {

    loginForm.addEventListener(
        "submit",
        async (e) => {

            e.preventDefault();


            // --------------------------------------------------
            // CLEAR OLD MESSAGE
            // --------------------------------------------------

            showMessage(
                "",
                "red"
            );


            // --------------------------------------------------
            // GET MOBILE
            // --------------------------------------------------

            const mobile =
                document
                    .getElementById("mobile")
                    ?.value
                    .trim() || "";


            // --------------------------------------------------
            // GET PASSWORD
            // --------------------------------------------------

            const password =
                document
                    .getElementById("password")
                    ?.value || "";


            // ==================================================
            // REQUIRED CHECK
            // ==================================================

            if (
                mobile === "" ||
                password === ""
            ) {

                showMessage(
                    "❌ মোবাইল নম্বর এবং Password লিখুন।"
                );

                return;

            }


            // ==================================================
            // MOBILE CHECK
            // ==================================================

            if (
                !isValidMobile(mobile)
            ) {

                showMessage(
                    "❌ সঠিক ১১ সংখ্যার বাংলাদেশি মোবাইল নম্বর লিখুন।"
                );

                return;

            }


            // ==================================================
            // CREATE INTERNAL AUTH EMAIL
            // ==================================================

            const authEmail =
                createAuthEmail(
                    mobile
                );


            console.log(
                "Login Auth Email:",
                authEmail
            );


            // ==================================================
            // FIREBASE LOGIN
            // ==================================================

            try {

                showMessage(
                    "⏳ Login হচ্ছে...",
                    "blue"
                );


                // ------------------------------------------------
                // SIGN IN WITH FIREBASE AUTH
                // ------------------------------------------------

                const userCredential =
                    await signInWithEmailAndPassword(
                        auth,
                        authEmail,
                        password
                    );


                const user =
                    userCredential.user;


                console.log(
                    "Firebase User:",
                    user.uid
                );


                // ==================================================
                // GET COMPANY PROFILE
                // ==================================================

                const companyRef =
                    doc(
                        db,
                        "companies",
                        user.uid
                    );


                const companySnapshot =
                    await getDoc(
                        companyRef
                    );


                // ==================================================
                // COMPANY PROFILE NOT FOUND
                // ==================================================

                if (
                    !companySnapshot.exists()
                ) {

                    await signOut(
                        auth
                    );


                    showMessage(

                        "❌ কোম্পানি Profile পাওয়া যায়নি। " +
                        "Registration তথ্য পরীক্ষা করুন।"

                    );

                    return;

                }


                // ==================================================
                // COMPANY DATA
                // ==================================================

                const company =
                    companySnapshot.data();


                console.log(
                    "Company Data:",
                    company
                );


                // ==================================================
                // BLOCKED CHECK
                // ==================================================

                if (
                    company.blocked ===
                    true
                ) {

                    await signOut(
                        auth
                    );


                    showMessage(
                        "❌ আপনার কোম্পানি অ্যাকাউন্টটি Block করা হয়েছে।"
                    );

                    return;

                }


                // ==================================================
                // STATUS CHECK
                // ==================================================
                //
                // আপনার Registration System:
                //
                // status: "active"
                // approved: true
                //
                // তাই নতুন Account সরাসরি Active হবে।
                // ==================================================

                const status =
                    company.status ||
                    "active";


                if (
                    status !== "active"
                ) {

                    await signOut(
                        auth
                    );


                    showMessage(
                        "⏳ আপনার কোম্পানি অ্যাকাউন্টটি বর্তমানে Active নয়।"
                    );

                    return;

                }


                // ==================================================
                // APPROVAL CHECK
                // ==================================================
                //
                // Admin Approval Required নয়।
                //
                // তাই approved === false হলে Login বন্ধ করা হবে না।
                // ==================================================


                // ==================================================
                // CREATE LOGIN DATA
                // ==================================================

                const loginData = {

                    uid:
                        user.uid,

                    companyId:
                        user.uid,

                    companyName:
                        company.companyName ||
                        "",

                    ownerName:
                        company.ownerName ||
                        "",

                    mobile:
                        company.mobile ||
                        mobile,

                    email:
                        company.email ||
                        "",

                    accountType:
                        company.accountType ||
                        "company",

                    status:
                        company.status ||
                        "active",

                    approved:
                        company.approved !== false,

                    blocked:
                        company.blocked === true,

                    logoUrl:
                        company.logoUrl ||
                        ""

                };


                // ==================================================
                // REMEMBER ME
                // ==================================================

                if (
                    rememberMe &&
                    rememberMe.checked
                ) {

                    // ------------------------------------------------
                    // SAVE TO LOCAL STORAGE
                    // ------------------------------------------------

                    localStorage.setItem(

                        "employerLogin",

                        JSON.stringify(
                            loginData
                        )

                    );


                    // ------------------------------------------------
                    // REMOVE OLD SESSION LOGIN
                    // ------------------------------------------------

                    sessionStorage.removeItem(
                        "employerLogin"
                    );

                }

                else {

                    // ------------------------------------------------
                    // SAVE TO SESSION STORAGE
                    // ------------------------------------------------

                    sessionStorage.setItem(

                        "employerLogin",

                        JSON.stringify(
                            loginData
                        )

                    );


                    // ------------------------------------------------
                    // REMOVE OLD LOCAL LOGIN
                    // ------------------------------------------------

                    localStorage.removeItem(
                        "employerLogin"
                    );

                }


                // ==================================================
                // SUCCESS
                // ==================================================

                showMessage(
                    "✅ Login সফল হয়েছে। Dashboard-এ নেওয়া হচ্ছে...",
                    "green"
                );


                // ==================================================
                // DASHBOARD
                // ==================================================

                setTimeout(
                    () => {

                        window.location.href =
                            "dashboard.html";

                    },
                    1000
                );


            }

            // ======================================================
            // FIREBASE ERROR
            // ======================================================

            catch (error) {

                console.error(
                    "SK Job BD Login Error:",
                    error
                );


                // --------------------------------------------------
                // WRONG PASSWORD / EMAIL
                // --------------------------------------------------

                if (
                    error.code ===
                    "auth/invalid-credential"
                ) {

                    showMessage(
                        "❌ মোবাইল নম্বর অথবা Password সঠিক নয়।"
                    );

                    return;

                }


                // --------------------------------------------------
                // WRONG PASSWORD
                // --------------------------------------------------

                if (
                    error.code ===
                    "auth/wrong-password"
                ) {

                    showMessage(
                        "❌ Password সঠিক নয়।"
                    );

                    return;

                }


                // --------------------------------------------------
                // USER NOT FOUND
                // --------------------------------------------------

                if (
                    error.code ===
                    "auth/user-not-found"
                ) {

                    showMessage(
                        "❌ এই মোবাইল নম্বর দিয়ে কোনো Account পাওয়া যায়নি।"
                    );

                    return;

                }


                // --------------------------------------------------
                // INVALID EMAIL
                // --------------------------------------------------

                if (
                    error.code ===
                    "auth/invalid-email"
                ) {

                    showMessage(
                        "❌ Login তথ্য সঠিক নয়।"
                    );

                    return;

                }


                // --------------------------------------------------
                // TOO MANY REQUESTS
                // --------------------------------------------------

                if (
                    error.code ===
                    "auth/too-many-requests"
                ) {

                    showMessage(
                        "❌ অনেকবার ভুল Login চেষ্টা হয়েছে। কিছুক্ষণ পরে আবার চেষ্টা করুন।"
                    );

                    return;

                }


                // --------------------------------------------------
                // NETWORK ERROR
                // --------------------------------------------------

                if (
                    error.code ===
                    "auth/network-request-failed"
                ) {

                    showMessage(
                        "❌ Internet Connection পাওয়া যাচ্ছে না।"
                    );

                    return;

                }


                // --------------------------------------------------
                // AUTH DISABLED
                // --------------------------------------------------

                if (
                    error.code ===
                    "auth/operation-not-allowed"
                ) {

                    showMessage(
                        "❌ Firebase Email/Password Authentication চালু করা নেই।"
                    );

                    return;

                }


                // --------------------------------------------------
                // DEFAULT ERROR
                // --------------------------------------------------

                showMessage(
                    "❌ Login করতে সমস্যা হয়েছে। আবার চেষ্টা করুন।"
                );

            }

        }
    );

}


// ======================================================
// AUTO LOGIN CHECK
// ======================================================

window.addEventListener(
    "load",
    () => {

        const localLogin =
            localStorage.getItem(
                "employerLogin"
            );


        const sessionLogin =
            sessionStorage.getItem(
                "employerLogin"
            );


        if (
            localLogin ||
            sessionLogin
        ) {

            window.location.href =
                "dashboard.html";

        }

    }
);


// ======================================================
// ONLINE / OFFLINE
// ======================================================

window.addEventListener(
    "offline",
    () => {

        showMessage(
            "❌ Internet Connection বিচ্ছিন্ন হয়েছে।"
        );

    }
);


window.addEventListener(
    "online",
    () => {

        showMessage(
            "✅ Internet Connection পুনরায় চালু হয়েছে।",
            "green"
        );

    }
);


// ======================================================
// SK JOB BD
// COMPANY LOGIN SYSTEM
// Firebase Authentication
// Mobile Number Login
// ======================================================
