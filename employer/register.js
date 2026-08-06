/*
================================================
SK Job BD
Employer Registration System
Professional Version
Part 1/3
================================================
*/

import { db, auth } from "../firebase.js";

import {
    doc,
    setDoc,
    serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.13.2/firebase-firestore.js";

import {
    createUserWithEmailAndPassword,
    sendEmailVerification
} from "https://www.gstatic.com/firebasejs/10.13.2/firebase-auth.js";

/*=========================================
Elements
=========================================*/

const registerForm = document.getElementById("registerForm");
const message = document.getElementById("message");

/*=========================================
Submit Event
=========================================*/

registerForm.addEventListener("submit", async (e) => {

    e.preventDefault();

    message.style.color = "red";
    message.innerHTML = "";

/*=========================================
Get Form Data
=========================================*/

    const companyName =
        document.getElementById("companyName").value.trim();

    const institutionCode =
        document.getElementById("institutionCode").value.trim();

    const ownerName =
        document.getElementById("ownerName").value.trim();

    const mobile =
        document.getElementById("mobile").value.trim();

    const email =
        document.getElementById("email").value.trim();

    const password =
        document.getElementById("password").value;

    const confirmPassword =
        document.getElementById("confirmPassword").value;

/*=========================================
Validation
=========================================*/

    if (
        companyName === "" ||
        ownerName === "" ||
        mobile === "" ||
        email === "" ||
        password === "" ||
        confirmPassword === ""
    ) {

        message.innerHTML =
            "❌ সকল বাধ্যতামূলক তথ্য পূরণ করুন।";

        return;

    }

    const mobilePattern = /^01[3-9]\d{8}$/;

    if (!mobilePattern.test(mobile)) {

        message.innerHTML =
            "❌ সঠিক মোবাইল নম্বর লিখুন।";

        return;

    }

    const emailPattern =
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailPattern.test(email)) {

        message.innerHTML =
            "❌ সঠিক Email লিখুন।";

        return;

    }

    if (password.length < 8) {

        message.innerHTML =
            "❌ Password কমপক্ষে ৮ অক্ষরের হতে হবে।";

        return;

    }

    if (password !== confirmPassword) {

        message.innerHTML =
            "❌ Password মিলছে না।";

        return;

    }

/*=========================================
Firebase Authentication
=========================================*/

    try {

        const userCredential =
            await createUserWithEmailAndPassword(
                auth,
                email,
                password
            );

        const user = userCredential.user;

        await sendEmailVerification(user);
        /*=========================================
Save Company Information
=========================================*/

        await setDoc(

            doc(db, "companies", user.uid),

            {

                uid: user.uid,

                companyName: companyName,

                institutionCode: institutionCode,

                ownerName: ownerName,

                mobile: mobile,

                email: email,

                accountType: "company",

                status: "pending",

                emailVerified: false,

                subscription: {

                    active: false,

                    plan: "Free",

                    expireDate: null

                },

                wallet: {

                    balance: 0,

                    totalIncome: 0,

                    totalWithdraw: 0

                },

                createdAt: serverTimestamp(),

                updatedAt: serverTimestamp()

            }

        );

/*=========================================
Success Message
=========================================*/

        message.style.color = "green";

        message.innerHTML =

        "✅ কোম্পানি অ্যাকাউন্ট সফলভাবে তৈরি হয়েছে।<br>"

        + "আপনার Email Verification সম্পন্ন করুন।<br>"

        + "Admin Approval-এর পরে Login করতে পারবেন।";

/*=========================================
Reset Form
=========================================*/

        registerForm.reset();

/*=========================================
Redirect
=========================================*/

        setTimeout(() => {

            window.location.href = "login.html";

        }, 5000);
/*=========================================
Error Handling
=========================================*/

    } catch (error) {

        console.error("Registration Error:", error);

        message.style.color = "red";

        switch (error.code) {

            case "auth/email-already-in-use":
                message.innerHTML =
                    "❌ এই Email দিয়ে ইতোমধ্যে একটি অ্যাকাউন্ট রয়েছে।";
                break;

            case "auth/invalid-email":
                message.innerHTML =
                    "❌ সঠিক Email Address লিখুন।";
                break;

            case "auth/weak-password":
                message.innerHTML =
                    "❌ Password খুব দুর্বল। কমপক্ষে ৮ অক্ষর ব্যবহার করুন।";
                break;

            case "auth/network-request-failed":
                message.innerHTML =
                    "❌ Internet Connection পাওয়া যাচ্ছে না।";
                break;

            default:
                message.innerHTML =
                    "❌ Registration Failed : " + error.message;
        }

    }

});

/*=========================================
Security Check
=========================================*/

if (!registerForm) {

    console.error("Register Form Not Found");

}

window.addEventListener("offline", () => {

    message.style.color = "red";

    message.innerHTML =
        "❌ Internet Connection বিচ্ছিন্ন হয়েছে।";

});

window.addEventListener("online", () => {

    message.style.color = "green";

    message.innerHTML =
        "✅ Internet Connection পুনরায় চালু হয়েছে।";

});

/*=========================================
SK Job BD
Professional Employer Registration
Completed
=========================================*/
