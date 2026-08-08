/* =========================================================
   SK JOB BD
   EMPLOYER / COMPANY REGISTRATION SYSTEM

   Account Flow:

   Registration
        ↓
   Firebase Authentication
        ↓
   Company Profile
        ↓
   Active Account
        ↓
   Login

   Admin Approval is NOT required.
   ========================================================= */


import { db, auth } from "../firebase.js";


/* =========================================================
   FIRESTORE
   ========================================================= */

import {
    doc,
    setDoc,
    serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.13.2/firebase-firestore.js";


/* =========================================================
   FIREBASE AUTHENTICATION
   ========================================================= */

import {
    createUserWithEmailAndPassword
} from "https://www.gstatic.com/firebasejs/10.13.2/firebase-auth.js";



/* =========================================================
   ELEMENTS
   ========================================================= */

const registerForm =
    document.getElementById("registerForm");

const message =
    document.getElementById("message");



/* =========================================================
   CHECK FORM
   ========================================================= */

if (!registerForm) {

    console.error(
        "SK Job BD: Register Form Not Found."
    );

}



/* =========================================================
   SUBMIT EVENT
   ========================================================= */

if (registerForm) {

    registerForm.addEventListener(
        "submit",
        async (e) => {

            e.preventDefault();


            /* =================================================
               CLEAR MESSAGE
            ================================================= */

            if (message) {

                message.style.color = "red";

                message.innerHTML = "";

            }



            /* =================================================
               GET FORM DATA
            ================================================= */

            const companyName =
                document
                    .getElementById("companyName")
                    ?.value
                    .trim() || "";


            const institutionCode =
                document
                    .getElementById("institutionCode")
                    ?.value
                    .trim() || "";


            const ownerName =
                document
                    .getElementById("ownerName")
                    ?.value
                    .trim() || "";


            const mobile =
                document
                    .getElementById("mobile")
                    ?.value
                    .trim() || "";


            const email =
                document
                    .getElementById("email")
                    ?.value
                    .trim() || "";


            const password =
                document
                    .getElementById("password")
                    ?.value || "";


            const confirmPassword =
                document
                    .getElementById("confirmPassword")
                    ?.value || "";



            /* =================================================
               REQUIRED FIELD VALIDATION

               Required:
               - Company Name
               - Owner Name
               - Mobile
               - Password
               - Confirm Password

               Optional:
               - Institution Code
               - Gmail
               - Logo
            ================================================= */

            if (
                companyName === "" ||
                ownerName === "" ||
                mobile === "" ||
                password === "" ||
                confirmPassword === ""
            ) {

                if (message) {

                    message.innerHTML =
                        "❌ সকল বাধ্যতামূলক তথ্য পূরণ করুন।";

                }

                return;

            }



            /* =================================================
               MOBILE VALIDATION
            ================================================= */

            const mobilePattern =
                /^01[3-9]\d{8}$/;


            if (!mobilePattern.test(mobile)) {

                if (message) {

                    message.innerHTML =
                        "❌ সঠিক ১১ সংখ্যার বাংলাদেশি মোবাইল নম্বর লিখুন।";

                }

                return;

            }



            /* =================================================
               EMAIL VALIDATION

               Gmail is OPTIONAL.

               If user enters Gmail,
               it must be valid.
            ================================================= */

            if (email !== "") {

                const emailPattern =
                    /^[^\s@]+@[^\s@]+\.[^\s@]+$/;


                if (!emailPattern.test(email)) {

                    if (message) {

                        message.innerHTML =
                            "❌ সঠিক Gmail / Email Address লিখুন।";

                    }

                    return;

                }

            }



            /* =================================================
               PASSWORD LENGTH
            ================================================= */

            if (password.length < 8) {

                if (message) {

                    message.innerHTML =
                        "❌ Password কমপক্ষে ৮ অক্ষরের হতে হবে।";

                }

                return;

            }



            /* =================================================
               HIGH SECURITY PASSWORD
            ================================================= */

            const hasUppercase =
                /[A-Z]/.test(password);


            const hasLowercase =
                /[a-z]/.test(password);


            const hasNumber =
                /[0-9]/.test(password);


            const hasSpecial =
                /[^A-Za-z0-9]/.test(password);



            if (
                !hasUppercase ||
                !hasLowercase ||
                !hasNumber ||
                !hasSpecial
            ) {

                if (message) {

                    message.innerHTML =

                        "❌ High Security Password ব্যবহার করুন।<br><br>" +

                        "Password-এ থাকতে হবে:<br>" +

                        "• কমপক্ষে ৮ অক্ষর<br>" +

                        "• বড় হাতের অক্ষর (A-Z)<br>" +

                        "• ছোট হাতের অক্ষর (a-z)<br>" +

                        "• সংখ্যা (0-9)<br>" +

                        "• বিশেষ চিহ্ন (@, #, $, %, ইত্যাদি)";

                }

                return;

            }



            /* =================================================
               CONFIRM PASSWORD
            ================================================= */

            if (password !== confirmPassword) {

                if (message) {

                    message.innerHTML =
                        "❌ Password এবং Confirm Password মিলছে না।";

                }

                return;

            }



            /* =================================================
               FIREBASE AUTH EMAIL

               আপনার Login System মোবাইল নম্বর ভিত্তিক।

               Firebase Email/Password Authentication ব্যবহার
               করার জন্য মোবাইল থেকে একটি internal email তৈরি
               করা হচ্ছে।

               এটি ব্যবহারকারীকে দেখানো হবে না।
            ================================================= */

            const authEmail =
                mobile + "@skjobbd-auth.local";



            /* =================================================
               CREATE ACCOUNT
            ================================================= */

            try {


                /* =================================================
                   CREATE FIREBASE AUTH USER
                ================================================= */

                const userCredential =
                    await createUserWithEmailAndPassword(
                        auth,
                        authEmail,
                        password
                    );


                const user =
                    userCredential.user;



                /* =================================================
                   COMPANY DOCUMENT
                ================================================= */

                await setDoc(

                    doc(
                        db,
                        "companies",
                        user.uid
                    ),

                    {

                        /* =========================================
                           USER INFORMATION
                        ========================================= */

                        uid:
                            user.uid,


                        companyName:
                            companyName,


                        institutionCode:
                            institutionCode,


                        ownerName:
                            ownerName,


                        mobile:
                            mobile,


                        email:
                            email,



                        /* =========================================
                           ACCOUNT INFORMATION
                        ========================================= */

                        accountType:
                            "company",


                        status:
                            "active",


                        approved:
                            true,


                        blocked:
                            false,


                        profileCompleted:
                            false,



                        /* =========================================
                           COMPANY LOGO
                        ========================================= */

                        logoUrl:
                            "",



                        /* =========================================
                           SUBSCRIPTION
                        ========================================= */

                        subscription: {

                            active:
                                false,

                            plan:
                                "Free",

                            expireDate:
                                null

                        },



                        /* =========================================
                           WALLET
                        ========================================= */

                        wallet: {

                            balance:
                                0,

                            totalIncome:
                                0,

                            totalWithdraw:
                                0

                        },



                        /* =========================================
                           JOB / POST INFORMATION
                        ========================================= */

                        totalPosts:
                            0,


                        totalApplications:
                            0,



                        /* =========================================
                           ACCOUNT CREATED TIME
                        ========================================= */

                        createdAt:
                            serverTimestamp(),


                        updatedAt:
                            serverTimestamp()

                    }

                );



                /* =================================================
                   SUCCESS MESSAGE
                ================================================= */

                if (message) {

                    message.style.color =
                        "green";


                    message.innerHTML =

                        "✅ কোম্পানি অ্যাকাউন্ট সফলভাবে তৈরি হয়েছে।<br><br>" +

                        "🏢 প্রতিষ্ঠান: " +
                        companyName +
                        "<br>" +

                        "📱 মোবাইল: " +
                        mobile +
                        "<br><br>" +

                        "✅ আপনার Account Active হয়েছে।<br>" +

                        "এখন আপনি Login করতে পারবেন।";

                }



                /* =================================================
                   RESET FORM
                ================================================= */

                registerForm.reset();



                /* =================================================
                   REDIRECT TO LOGIN
                ================================================= */

                setTimeout(

                    () => {

                        window.location.href =
                            "login.html";

                    },

                    3000

                );



            }


            /* =================================================
               ERROR HANDLING
            ================================================= */

            catch (error) {

                console.error(
                    "SK Job BD Registration Error:",
                    error
                );


                if (message) {

                    message.style.color =
                        "red";

                }



                /* =================================================
                   EMAIL / MOBILE ALREADY EXISTS
                ================================================= */

                if (
                    error.code ===
                    "auth/email-already-in-use"
                ) {

                    if (message) {

                        message.innerHTML =
                            "❌ এই মোবাইল নম্বর দিয়ে ইতোমধ্যে একটি Account রয়েছে।";

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
                            "❌ Account তৈরির তথ্য সঠিক নয়।";

                    }

                    return;

                }



                /* =================================================
                   WEAK PASSWORD
                ================================================= */

                if (
                    error.code ===
                    "auth/weak-password"
                ) {

                    if (message) {

                        message.innerHTML =
                            "❌ Password দুর্বল। High Security Password ব্যবহার করুন।";

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
                   OPERATION NOT ALLOWED
                ================================================= */

                if (
                    error.code ===
                    "auth/operation-not-allowed"
                ) {

                    if (message) {

                        message.innerHTML =

                            "❌ Firebase Authentication-এর Email/Password Sign-in চালু করা নেই।<br><br>" +

                            "Firebase Console → Authentication → Sign-in method থেকে Email/Password Enable করুন।";

                    }

                    return;

                }



                /* =================================================
                   DEFAULT ERROR
                ================================================= */

                if (message) {

                    message.innerHTML =

                        "❌ Registration Failed.<br><br>" +

                        error.message;

                }

            }

        }

    );

}



/* =========================================================
   OFFLINE STATUS
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



/* =========================================================
   ONLINE STATUS
   ========================================================= */

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
   PROFESSIONAL EMPLOYER REGISTRATION
   ACTIVE ACCOUNT SYSTEM
   ========================================================= */
