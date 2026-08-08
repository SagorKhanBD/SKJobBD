/* =========================================================
   SK JOB BD
   EMPLOYER / COMPANY LOGIN SYSTEM

   Login:
   Mobile Number + Password

   Authentication:
   Firebase Authentication

   Company Data:
   Firestore -> companies/{uid}

   Admin Approval:
   NOT REQUIRED
   ========================================================= */


import { db, auth } from "../firebase.js";


/* =========================================================
   FIRESTORE
   ========================================================= */

import {
    doc,
    getDoc
} from "https://www.gstatic.com/firebasejs/10.13.2/firebase-firestore.js";


/* =========================================================
   FIREBASE AUTHENTICATION
   ========================================================= */

import {
    signInWithEmailAndPassword,
    signOut
} from "https://www.gstatic.com/firebasejs/10.13.2/firebase-auth.js";



/* =========================================================
   ELEMENTS
   ========================================================= */

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



/* =========================================================
   LOGIN FORM CHECK
   ========================================================= */

if (!loginForm) {

    console.error(
        "SK Job BD: Login Form Not Found."
    );

}



/* =========================================================
   LOGIN
   ========================================================= */

if (loginForm) {

    loginForm.addEventListener(
        "submit",
        async (e) => {

            e.preventDefault();


            /* =================================================
               CLEAR MESSAGE
            ================================================= */

            if (message) {

                message.style.color =
                    "red";

                message.innerHTML =
                    "";

            }



            /* =================================================
               GET MOBILE
            ================================================= */

            const mobile =
                document
                    .getElementById("mobile")
                    ?.value
                    .trim() || "";



            /* =================================================
               GET PASSWORD
            ================================================= */

            const password =
                document
                    .getElementById("password")
                    ?.value || "";



            /* =================================================
               EMPTY CHECK
            ================================================= */

            if (
                mobile === "" ||
                password === ""
            ) {

                if (message) {

                    message.innerHTML =
                        "❌ মোবাইল নম্বর এবং পাসওয়ার্ড লিখুন।";

                }

                return;

            }



            /* =================================================
               MOBILE VALIDATION
            ================================================= */

            const mobilePattern =
                /^01[3-9]\d{8}$/;


            if (
                !mobilePattern.test(mobile)
            ) {

                if (message) {

                    message.innerHTML =
                        "❌ সঠিক ১১ সংখ্যার মোবাইল নম্বর লিখুন।";

                }

                return;

            }



            /* =================================================
               FIREBASE LOGIN
            ================================================= */

            try {


                /* =================================================
                   INTERNAL FIREBASE AUTH EMAIL

                   Registration-এর সময় একই পদ্ধতিতে
                   এই Email তৈরি করা হয়েছিল।

                   Example:

                   017XXXXXXXX@skjobbd-auth.local
                ================================================= */

                const authEmail =
                    mobile +
                    "@skjobbd-auth.local";



                /* =================================================
                   SIGN IN
                ================================================= */

                const userCredential =
                    await signInWithEmailAndPassword(
                        auth,
                        authEmail,
                        password
                    );


                const user =
                    userCredential.user;



                /* =================================================
                   GET COMPANY PROFILE
                ================================================= */

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



                /* =================================================
                   COMPANY PROFILE NOT FOUND
                ================================================= */

                if (
                    !companySnap.exists()
                ) {

                    await signOut(auth);


                    if (message) {

                        message.innerHTML =
                            "❌ কোম্পানি Profile পাওয়া যায়নি।";

                    }

                    return;

                }



                /* =================================================
                   COMPANY DATA
                ================================================= */

                const company =
                    companySnap.data();



                /* =================================================
                   BLOCKED ACCOUNT CHECK
                ================================================= */

                if (
                    company.blocked === true
                ) {

                    await signOut(auth);


                    if (message) {

                        message.style.color =
                            "red";

                        message.innerHTML =
                            "❌ আপনার কোম্পানি অ্যাকাউন্টটি বর্তমানে বন্ধ রয়েছে।";

                    }

                    return;

                }



                /* =================================================
                   ACTIVE ACCOUNT CHECK
                ================================================= */

                if (
                    company.status !== "active"
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



                /* =================================================
                   LOGIN DATA
                ================================================= */

                const loginData = {

                    uid:
                        user.uid,

                    companyId:
                        user.uid,

                    companyName:
                        company.companyName || "",

                    ownerName:
                        company.ownerName || "",

                    mobile:
                        company.mobile || mobile,

                    email:
                        company.email || "",

                    accountType:
                        company.accountType || "company",

                    status:
                        company.status || "active",

                    logoUrl:
                        company.logoUrl || ""

                };



                /* =================================================
                   REMEMBER ME
                ================================================= */

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


                    sessionStorage.removeItem(
                        "employerLogin"
                    );

                }

                else {

                    sessionStorage.setItem(
                        "employerLogin",
                        JSON.stringify(
                            loginData
                        )
                    );


                    localStorage.removeItem(
                        "employerLogin"
                    );

                }



                /* =================================================
                   SUCCESS
                ================================================= */

                if (message) {

                    message.style.color =
                        "green";

                    message.innerHTML =
                        "✅ লগইন সফল হয়েছে...";

                }



                /* =================================================
                   GO TO COMPANY PROFILE
                ================================================= */

                setTimeout(

                    () => {

                        window.location.href =
                            "dashboard.html";

                    },

                    1000

                );



            }


            /* =================================================
               ERROR HANDLING
            ================================================= */

            catch (error) {

                console.error(
                    "SK Job BD Employer Login Error:",
                    error
                );


                if (message) {

                    message.style.color =
                        "red";

                }



                /* =================================================
                   INVALID LOGIN
                ================================================= */

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



                /* =================================================
                   WRONG PASSWORD
                ================================================= */

                if (
                    error.code ===
                    "auth/wrong-password"
                ) {

                    if (message) {

                        message.innerHTML =
                            "❌ মোবাইল নম্বর অথবা পাসওয়ার্ড সঠিক নয়।";

                    }

                    return;

                }



                /* =================================================
                   USER NOT FOUND
                ================================================= */

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



                /* =================================================
                   INVALID EMAIL
                ================================================= */

                if (
                    error.code ===
                    "auth/invalid-email"
                ) {

                    if (message) {

                        message.innerHTML =
                            "❌ Login তথ্য সঠিক নয়।";

                    }

                    return;

                }



                /* =================================================
                   TOO MANY REQUESTS
                ================================================= */

                if (
                    error.code ===
                    "auth/too-many-requests"
                ) {

                    if (message) {

                        message.innerHTML =
                            "❌ অনেকবার ভুল Login চেষ্টা হয়েছে। কিছুক্ষণ পরে আবার চেষ্টা করুন।";

                    }

                    return;

                }



                /* =================================================
                   NETWORK ERROR
                ================================================= */

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



                /* =================================================
                   DEFAULT ERROR
                ================================================= */

                if (message) {

                    message.innerHTML =
                        "❌ Login করতে সমস্যা হয়েছে। আবার চেষ্টা করুন।";

                }

            }

        }

    );

}



/* =========================================================
   PASSWORD SHOW / HIDE
   ========================================================= */

if (
    passwordInput &&
    togglePassword
) {

    togglePassword.textContent =
        "👁";


    togglePassword.addEventListener(
        "click",
        function () {

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



/* =========================================================
   AUTO LOGIN CHECK
   ========================================================= */

window.addEventListener(
    "load",
    async () => {

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



/* =========================================================
   ONLINE / OFFLINE
   ========================================================= */

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



/* =========================================================
   SK JOB BD
   Employer Login System
   Mobile + Password
   Firebase Authentication
   ========================================================= */
