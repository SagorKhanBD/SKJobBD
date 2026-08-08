/* =========================================================
   SK JOB BD
   EMPLOYER / COMPANY REGISTRATION
   Mobile Number + Password Login System
   ========================================================= */

import { db, auth } from "../firebase.js";

import {
    doc,
    setDoc,
    serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.13.2/firebase-firestore.js";

import {
    createUserWithEmailAndPassword
} from "https://www.gstatic.com/firebasejs/10.13.2/firebase-auth.js";


/* =========================================================
   ELEMENTS
   ========================================================= */

const registerForm = document.getElementById("registerForm");
const message = document.getElementById("message");


/* =========================================================
   FORM CHECK
   ========================================================= */

if (!registerForm) {

    console.error("Register Form Not Found");

}


/* =========================================================
   SUBMIT EVENT
   ========================================================= */

if (registerForm) {

    registerForm.addEventListener("submit", async (e) => {

        e.preventDefault();


        /* -------------------------------------------------
           CLEAR MESSAGE
        ------------------------------------------------- */

        if (message) {

            message.style.color = "red";
            message.innerHTML = "";

        }


        /* =================================================
           GET FORM DATA
        ================================================= */

        const companyName =
            document.getElementById("companyName")?.value.trim() || "";

        const institutionCode =
            document.getElementById("institutionCode")?.value.trim() || "";

        const ownerName =
            document.getElementById("ownerName")?.value.trim() || "";

        const mobile =
            document.getElementById("mobile")?.value.trim() || "";

        const email =
            document.getElementById("email")?.value.trim() || "";

        const password =
            document.getElementById("password")?.value || "";

        const confirmPassword =
            document.getElementById("confirmPassword")?.value || "";


        /* =================================================
           REQUIRED FIELD VALIDATION

           Gmail OPTIONAL
           Institution Code OPTIONAL
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

        const mobilePattern = /^01[3-9]\d{8}$/;

        if (!mobilePattern.test(mobile)) {

            if (message) {

                message.innerHTML =
                    "❌ সঠিক ১১ সংখ্যার বাংলাদেশি মোবাইল নম্বর লিখুন।";

            }

            return;

        }


        /* =================================================
           EMAIL VALIDATION

           Gmail OPTIONAL
           কিন্তু দিলে সঠিক হতে হবে
        ================================================= */

        if (email !== "") {

            const emailPattern =
                /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

            if (!emailPattern.test(email)) {

                if (message) {

                    message.innerHTML =
                        "❌ সঠিক Email Address লিখুন।";

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
           HIGH SECURITY PASSWORD CHECK
        ================================================= */

        const hasUppercase = /[A-Z]/.test(password);
        const hasLowercase = /[a-z]/.test(password);
        const hasNumber = /[0-9]/.test(password);
        const hasSpecial = /[^A-Za-z0-9]/.test(password);


        if (
            !hasUppercase ||
            !hasLowercase ||
            !hasNumber ||
            !hasSpecial
        ) {

            if (message) {

                message.innerHTML =
                    "❌ High Security Password ব্যবহার করুন।<br>" +
                    "কমপক্ষে ৮ অক্ষর এবং বড় হাতের অক্ষর, ছোট হাতের অক্ষর, সংখ্যা ও বিশেষ চিহ্ন থাকতে হবে।";

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
           FIREBASE AUTHENTICATION

           Firebase Email/Password Authentication ব্যবহার
           করা হচ্ছে।

           যেহেতু Gmail OPTIONAL এবং Login হবে Mobile দিয়ে,
           তাই Mobile থেকে একটি internal authentication
           identifier তৈরি করা হচ্ছে।

           এটি ব্যবহারকারীকে দেখানো হবে না।
        ================================================= */

        const authEmail =
            mobile + "@skjobbd-auth.local";


        /* =================================================
           REGISTRATION
        ================================================= */

        try {


            /* ------------------------------------------------
               CREATE FIREBASE AUTH USER
            ------------------------------------------------ */

            const userCredential =
                await createUserWithEmailAndPassword(
                    auth,
                    authEmail,
                    password
                );


            const user = userCredential.user;


            /* =================================================
               SAVE COMPANY INFORMATION
            ================================================= */

            await setDoc(

                doc(
                    db,
                    "companies",
                    user.uid
                ),

                {

                    /* -----------------------------------------
                       BASIC INFORMATION
                    ----------------------------------------- */

                    uid: user.uid,

                    companyName: companyName,

                    institutionCode: institutionCode,

                    ownerName: ownerName,

                    mobile: mobile,

                    email: email,


                    /* -----------------------------------------
                       ACCOUNT INFORMATION
                    ----------------------------------------- */

                    accountType: "company",

                    status: "pending",

                    approved: false,


                    /* -----------------------------------------
                       PROFILE
                    ----------------------------------------- */

                    profileCompleted: false,

                    logoUrl: "",


                    /* -----------------------------------------
                       SUBSCRIPTION
                    ----------------------------------------- */

                    subscription: {

                        active: false,

                        plan: "Free",

                        expireDate: null

                    },


                    /* -----------------------------------------
                       WALLET
                    ----------------------------------------- */

                    wallet: {

                        balance: 0,

                        totalIncome: 0,

                        totalWithdraw: 0

                    },


                    /* -----------------------------------------
                       POST INFORMATION
                    ----------------------------------------- */

                    totalPosts: 0,


                    /* -----------------------------------------
                       TIMESTAMP
                    ----------------------------------------- */

                    createdAt:
                        serverTimestamp(),

                    updatedAt:
                        serverTimestamp()

                }

            );


            /* =================================================
               SUCCESS
            ================================================= */

            if (message) {

                message.style.color = "green";

                message.innerHTML =

                    "✅ কোম্পানি অ্যাকাউন্ট সফলভাবে তৈরি হয়েছে।<br><br>" +

                    "🏢 প্রতিষ্ঠান: " +
                    companyName +
                    "<br>" +

                    "📱 মোবাইল: " +
                    mobile +
                    "<br><br>" +

                    "⏳ আপনার Account এখন Admin Approval-এর অপেক্ষায় আছে।";

            }


            /* =================================================
               RESET FORM
            ================================================= */

            registerForm.reset();


            /* =================================================
               REDIRECT TO LOGIN
            ================================================= */

            setTimeout(() => {

                window.location.href =
                    "login.html";

            }, 5000);


        }


        /* =================================================
           ERROR HANDLING
        ================================================= */

        catch (error) {

            console.error(
                "Registration Error:",
                error
            );


            if (message) {

                message.style.color = "red";

            }


            switch (error.code) {


                /* -----------------------------------------
                   EMAIL ALREADY USED
                ----------------------------------------- */

                case "auth/email-already-in-use":

                    if (message) {

                        message.innerHTML =
                            "❌ এই মোবাইল নম্বর দিয়ে ইতোমধ্যে একটি Account রয়েছে।";

                    }

                    break;


                /* -----------------------------------------
                   INVALID EMAIL
                ----------------------------------------- */

                case "auth/invalid-email":

                    if (message) {

                        message.innerHTML =
                            "❌ Account তৈরির তথ্য সঠিক নয়।";

                    }

                    break;


                /* -----------------------------------------
                   WEAK PASSWORD
                ----------------------------------------- */

                case "auth/weak-password":

                    if (message) {

                        message.innerHTML =
                            "❌ Password দুর্বল। High Security Password ব্যবহার করুন।";

                    }

                    break;


                /* -----------------------------------------
                   NETWORK ERROR
                ----------------------------------------- */

                case "auth/network-request-failed":

                    if (message) {

                        message.innerHTML =
                            "❌ Internet Connection পাওয়া যাচ্ছে না।";

                    }

                    break;


                /* -----------------------------------------
                   DEFAULT
                ----------------------------------------- */

                default:

                    if (message) {

                        message.innerHTML =
                            "❌ Registration Failed : " +
                            error.message;

                    }

                    break;

            }

        }

    });

}


/* =========================================================
   OFFLINE
   ========================================================= */

window.addEventListener(
    "offline",
    () => {

        if (message) {

            message.style.color = "red";

            message.innerHTML =
                "❌ Internet Connection বিচ্ছিন্ন হয়েছে।";

        }

    }
);


/* =========================================================
   ONLINE
   ========================================================= */

window.addEventListener(
    "online",
    () => {

        if (message) {

            message.style.color = "green";

            message.innerHTML =
                "✅ Internet Connection পুনরায় চালু হয়েছে।";

        }

    }
);


/* =========================================================
   SK JOB BD
   Professional Employer Registration
   ========================================================= */
