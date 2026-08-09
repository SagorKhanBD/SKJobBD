// ======================================================
// SK JOB BD
// COMPANY / EMPLOYER LOGIN SYSTEM
//
// Login Method:
// Mobile Number + Password
//
// Firebase Authentication:
// Mobile থেকে Internal Auth Email তৈরি হবে
//
// Company Collection:
// companies/{Firebase Auth UID}
//
// Admin Approval:
// প্রয়োজন নেই
//
// Account Status:
// active হলে Login করা যাবে
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
// ELEMENTS
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
// CHECK LOGIN FORM
// ======================================================

if (!loginForm) {

    console.error(
        "SK Job BD: loginForm not found."
    );

}


// ======================================================
// CREATE INTERNAL AUTH EMAIL
//
// Registration-এর সময় যেই Email তৈরি করা হয়েছে
// Login-এর সময়ও ঠিক একই Email তৈরি করতে হবে।
//
// Example:
// 01827775115
//
// becomes:
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
// PASSWORD SHOW / HIDE
// ======================================================

if (
    passwordInput &&
    togglePassword
) {

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
                    "🙈";

                togglePassword.title =
                    "Hide Password";

                togglePassword.setAttribute(
                    "aria-label",
                    "Hide Password"
                );

            } else {

                passwordInput.type =
                    "password";

                togglePassword.textContent =
                    "👁";

                togglePassword.title =
                    "Show Password";

                togglePassword.setAttribute(
                    "aria-label",
                    "Show Password"
                );

            }

        }
    );

}


// ======================================================
// LOGIN
// ======================================================

if (loginForm) {

    loginForm.addEventListener(
        "submit",
        async (e) => {

            e.preventDefault();


            // ==========================================
            // CLEAR MESSAGE
            // ==========================================

            if (message) {

                message.style.color =
                    "red";

                message.innerHTML =
                    "";

            }


            // ==========================================
            // GET MOBILE
            // ==========================================

            const mobile =
                document
                    .getElementById("mobile")
                    ?.value
                    .trim() || "";


            // ==========================================
            // GET PASSWORD
            // ==========================================

            const password =
                document
                    .getElementById("password")
                    ?.value || "";


            // ==========================================
            // REQUIRED CHECK
            // ==========================================

            if (
                mobile === "" ||
                password === ""
            ) {

                if (message) {

                    message.innerHTML =
                        "❌ মোবাইল নম্বর এবং Password লিখুন।";

                }

                return;

            }


            // ==========================================
            // MOBILE VALIDATION
            // ==========================================

            const mobilePattern =
                /^01[3-9]\d{8}$/;


            if (
                !mobilePattern.test(mobile)
            ) {

                if (message) {

                    message.innerHTML =
                        "❌ সঠিক ১১ সংখ্যার বাংলাদেশি মোবাইল নম্বর লিখুন।";

                }

                return;

            }


            // ==========================================
            // CREATE INTERNAL AUTH EMAIL
            // ==========================================

            const authEmail =
                createAuthEmail(
                    mobile
                );


            // ==========================================
            // FIREBASE LOGIN
            // ==========================================

            try {

                // --------------------------------------
                // Firebase Authentication Login
                // --------------------------------------

                const userCredential =
                    await signInWithEmailAndPassword(
                        auth,
                        authEmail,
                        password
                    );


                const user =
                    userCredential.user;


                // ======================================
                // LOAD COMPANY PROFILE
                // ======================================

                const companyRef =
                    doc(
                        db,
                        "companies",
                        user.uid
                    );


                const companySnap =
                    await getDoc(
                        companyRef
                    );


                // ======================================
                // COMPANY PROFILE NOT FOUND
                // ======================================

                if (
                    !companySnap.exists()
                ) {

                    await signOut(auth);

                    if (message) {

                        message.innerHTML =
                            "❌ আপনার কোম্পানি তথ্য পাওয়া যায়নি।";

                    }

                    return;

                }


                // ======================================
                // COMPANY DATA
                // ======================================

                const company =
                    companySnap.data();


                // ======================================
                // CHECK BLOCKED
                // ======================================

                if (
                    company.blocked === true
                ) {

                    await signOut(auth);

                    if (message) {

                        message.style.color =
                            "red";

                        message.innerHTML =
                            "❌ আপনার কোম্পানি অ্যাকাউন্টটি Block করা হয়েছে।";

                    }

                    return;

                }


                // ======================================
                // CHECK ACCOUNT STATUS
                //
                // Registration code-এ:
                //
                // status: "active"
                // approved: true
                //
                // তাই active থাকলেই Login হবে।
                // ======================================

                if (
                    company.status !==
                    "active"
                ) {

                    await signOut(auth);

                    if (message) {

                        message.style.color =
                            "orange";

                        message.innerHTML =
                            "⏳ আপনার কোম্পানি অ্যাকাউন্টটি বর্তমানে Active নয়।";

                    }

                    return;

                }


                // ======================================
                // LOGIN DATA
                // ======================================

                const loginData = {

                    companyId:
                        user.uid,

                    uid:
                        user.uid,

                    companyName:
                        company.companyName ||
                        "",

                    institutionCode:
                        company.institutionCode ||
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
                        "active"

                };


                // ======================================
                // REMEMBER ME
                // ======================================

                if (
                    rememberMe &&
                    rememberMe.checked
                ) {

                    localStorage.setItem(
                        "employerLogin",
                        JSON.stringify(
                            loginData
                        )
                    );

                    // আগের Session থাকলে সরিয়ে দিচ্ছি
                    sessionStorage.removeItem(
                        "employerLogin"
                    );

                } else {

                    sessionStorage.setItem(
                        "employerLogin",
                        JSON.stringify(
                            loginData
                        )
                    );

                    // আগের Local Login থাকলে সরিয়ে দিচ্ছি
                    localStorage.removeItem(
                        "employerLogin"
                    );

                }


                // ======================================
                // SUCCESS MESSAGE
                // ======================================

                if (message) {

                    message.style.color =
                        "green";

                    message.innerHTML =

                        "✅ Login সফল হয়েছে।<br>" +

                        "🏢 " +
                        (
                            company.companyName ||
                            "কোম্পানি"
                        ) +
                        "<br><br>" +

                        "Dashboard-এ নিয়ে যাওয়া হচ্ছে...";

                }


                // ======================================
                // REDIRECT DASHBOARD
                // ======================================

                setTimeout(
                    () => {

                        window.location.href =
                            "dashboard.html";

                    },
                    1200
                );


            } catch (error) {

                // ======================================
                // ERROR LOG
                // ======================================

                console.error(
                    "SK Job BD Login Error:",
                    error
                );


                if (message) {

                    message.style.color =
                        "red";

                }


                // ======================================
                // WRONG PASSWORD
                // ======================================

                if (
                    error.code ===
                    "auth/wrong-password"
                ) {

                    if (message) {

                        message.innerHTML =
                            "❌ পাসওয়ার্ড সঠিক নয়।";

                    }

                    return;

                }


                // ======================================
                // INVALID CREDENTIAL
                //
                // Firebase নতুন Version-এ
                // wrong password / wrong account
                // অনেক সময় এই Error দেয়।
                // ======================================

                if (
                    error.code ===
                    "auth/invalid-credential"
                ) {

                    if (message) {

                        message.innerHTML =
                            "❌ মোবাইল নম্বর অথবা পাসওয়ার্ড সঠিক নয়।";

                    }

                    return;

                }


                // ======================================
                // USER NOT FOUND
                // ======================================

                if (
                    error.code ===
                    "auth/user-not-found"
                ) {

                    if (message) {

                        message.innerHTML =
                            "❌ এই মোবাইল নম্বর দিয়ে কোনো Account পাওয়া যায়নি।";

                    }

                    return;

                }


                // ======================================
                // INVALID EMAIL
                // ======================================

                if (
                    error.code ===
                    "auth/invalid-email"
                ) {

                    if (message) {

                        message.innerHTML =
                            "❌ Account তথ্য সঠিক নয়।";

                    }

                    return;

                }


                // ======================================
                // TOO MANY REQUESTS
                // ======================================

                if (
                    error.code ===
                    "auth/too-many-requests"
                ) {

                    if (message) {

                        message.innerHTML =
                            "❌ অনেকবার Login চেষ্টা করা হয়েছে। কিছুক্ষণ পরে আবার চেষ্টা করুন।";

                    }

                    return;

                }


                // ======================================
                // NETWORK ERROR
                // ======================================

                if (
                    error.code ===
                    "auth/network-request-failed"
                ) {

                    if (message) {

                        message.innerHTML =
                            "❌ Internet Connection পাওয়া যাচ্ছে না।";

                    }

                    return;

                }


                // ======================================
                // OPERATION NOT ALLOWED
                // ======================================

                if (
                    error.code ===
                    "auth/operation-not-allowed"
                ) {

                    if (message) {

                        message.innerHTML =
                            "❌ Firebase Email/Password Authentication চালু করা নেই।";

                    }

                    return;

                }


                // ======================================
                // DEFAULT ERROR
                // ======================================

                if (message) {

                    message.innerHTML =
                        "❌ Login করতে সমস্যা হয়েছে। আবার চেষ্টা করুন।";

                }

            }

        }
    );

}


// ======================================================
// AUTO LOGIN
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

        if (message) {

            message.style.color =
                "red";

            message.innerHTML =
                "❌ Internet Connection বিচ্ছিন্ন হয়েছে।";

        }

    }
);


window.addEventListener(
    "online",
    () => {

        if (message) {

            message.style.color =
                "green";

            message.innerHTML =
                "✅ Internet Connection পুনরায় চালু হয়েছে।";

        }

    }
);


// ======================================================
// SK JOB BD
// COMPANY LOGIN SYSTEM
// PROFESSIONAL VERSION
// ======================================================
