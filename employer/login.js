/*
================================================
SK Job BD
Employer Login System
Professional Version
Part 1/3
================================================
*/

import { db, auth } from "../firebase.js";

import {
    doc,
    getDoc
} from "https://www.gstatic.com/firebasejs/10.13.2/firebase-firestore.js";

import {
    signInWithEmailAndPassword,
    setPersistence,
    browserLocalPersistence,
    browserSessionPersistence
} from "https://www.gstatic.com/firebasejs/10.13.2/firebase-auth.js";

/*=========================================
Elements
=========================================*/

const loginForm = document.getElementById("loginForm");

const message = document.getElementById("message");

const rememberMe = document.getElementById("rememberMe");

/*=========================================
Login Submit
=========================================*/

loginForm.addEventListener("submit", async (e) => {

    e.preventDefault();

    message.style.color = "red";
    message.innerHTML = "";

/*=========================================
Get Values
=========================================*/

    const mobile =
        document.getElementById("mobile").value.trim();

    const password =
        document.getElementById("password").value;

/*=========================================
Validation
=========================================*/

    if (mobile === "" || password === "") {

        message.innerHTML =
            "❌ মোবাইল নম্বর এবং Password লিখুন।";

        return;

    }

    const mobilePattern = /^01[3-9]\d{8}$/;

    if (!mobilePattern.test(mobile)) {

        message.innerHTML =
            "❌ সঠিক মোবাইল নম্বর লিখুন।";

        return;

    }

/*=========================================
Email Convert
=========================================*/

    const email =
        mobile + "@skjobbd.com";

/*=========================================
Remember Me
=========================================*/

    try {

        if (rememberMe.checked) {

            await setPersistence(
                auth,
                browserLocalPersistence
            );

        } else {

            await setPersistence(
                auth,
                browserSessionPersistence
            );

        }

/*=========================================
Firebase Login
=========================================*/

        const userCredential =
            await signInWithEmailAndPassword(
                auth,
                email,
                password
            );

        const user = userCredential.user;
/*=========================================
Load Company Information
=========================================*/

        const companyRef = doc(db, "companies", user.uid);

        const companySnap = await getDoc(companyRef);

        if (!companySnap.exists()) {

            message.style.color = "red";

            message.innerHTML =
                "❌ কোম্পানির তথ্য পাওয়া যায়নি।";

            return;

        }

        const company = companySnap.data();

/*=========================================
Approval Check
=========================================*/

        if (company.status !== "approved") {

            message.style.color = "orange";

            message.innerHTML =
                "⏳ Registration Successful. Admin Approval Pending.";

            await auth.signOut();

            return;

        }

/*=========================================
Session Storage
=========================================*/

        sessionStorage.setItem(
            "companyUID",
            user.uid
        );

        sessionStorage.setItem(
            "companyName",
            company.companyName
        );

        sessionStorage.setItem(
            "ownerName",
            company.ownerName
        );

        sessionStorage.setItem(
            "accountType",
            company.accountType
        );

/*=========================================
Success
=========================================*/

        message.style.color = "green";

        message.innerHTML =
            "✅ Login Successful...";

/*=========================================
Redirect
=========================================*/

        setTimeout(() => {

            window.location.href =
                "dashboard.html";

        }, 1500);
      /*=========================================
Error Handling
=========================================*/

    } catch (error) {

        console.error("Employer Login Error:", error);

        message.style.color = "red";

        switch (error.code) {

            case "auth/invalid-credential":
                message.innerHTML =
                    "❌ মোবাইল নম্বর অথবা Password সঠিক নয়।";
                break;

            case "auth/user-not-found":
                message.innerHTML =
                    "❌ কোনো অ্যাকাউন্ট পাওয়া যায়নি।";
                break;

            case "auth/wrong-password":
                message.innerHTML =
                    "❌ Password ভুল হয়েছে।";
                break;

            case "auth/too-many-requests":
                message.innerHTML =
                    "❌ অনেকবার ভুল Login হয়েছে। পরে আবার চেষ্টা করুন।";
                break;

            case "auth/network-request-failed":
                message.innerHTML =
                    "❌ Internet Connection পাওয়া যাচ্ছে না।";
                break;

            default:
                message.innerHTML =
                    "❌ Login Failed : " + error.message;
        }

    }

});

/*=========================================
Security Check
=========================================*/

if (!loginForm) {

    console.error("Login Form Not Found");

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
Auto Session Check
=========================================*/

import {
    onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.13.2/firebase-auth.js";

onAuthStateChanged(auth, async (user) => {

    if (!user) return;

    try {

        const companyRef = doc(db, "companies", user.uid);

        const companySnap = await getDoc(companyRef);

        if (!companySnap.exists()) return;

        const company = companySnap.data();

        if (company.status === "approved") {

            window.location.href = "dashboard.html";

        }

    } catch (err) {

        console.error(err);

    }

});

/*=========================================
SK Job BD
Employer Login System
Professional Version
Completed
=========================================*/
