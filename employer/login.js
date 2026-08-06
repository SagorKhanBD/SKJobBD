/*
================================================
SK Job BD
Employer Login System
Professional Version
Part 1/3
================================================
*/

import { db } from "../firebase.js";

import {
    collection,
    query,
    where,
    getDocs
} from "https://www.gstatic.com/firebasejs/10.13.2/firebase-firestore.js";

const loginForm = document.getElementById("loginForm");

const message = document.getElementById("message");

const rememberMe = document.getElementById("rememberMe");

/*=========================================
LOGIN
=========================================*/

loginForm.addEventListener("submit", async (e) => {

    e.preventDefault();

    message.innerHTML = "";

    message.style.color = "red";

    const mobile =
        document.getElementById("mobile").value.trim();

    const password =
        document.getElementById("password").value.trim();

    if (mobile === "" || password === "") {

        message.innerHTML =
            "❌ মোবাইল নম্বর এবং পাসওয়ার্ড লিখুন।";

        return;

    }

    const mobilePattern = /^01[3-9]\d{8}$/;

    if (!mobilePattern.test(mobile)) {

        message.innerHTML =
            "❌ সঠিক মোবাইল নম্বর লিখুন।";

        return;

    }

    try {

        const q = query(

            collection(db, "companies"),

            where("mobile", "==", mobile)

        );

        const snapshot = await getDocs(q);

        if (snapshot.empty) {

            message.innerHTML =
                "❌ কোনো প্রতিষ্ঠান খুঁজে পাওয়া যায়নি।";

            return;

        }

        const docSnap = snapshot.docs[0];

        const company = docSnap.data();
      /*=========================================
Password Verification
=========================================*/

        if (company.passwordHash !== password) {

            message.innerHTML =
                "❌ পাসওয়ার্ড সঠিক নয়।";

            return;

        }

/*=========================================
Admin Approval Check
=========================================*/

        if (company.status !== "approved") {

            message.style.color = "orange";

            message.innerHTML =
                "⏳ আপনার প্রতিষ্ঠানের অ্যাকাউন্ট এখনো Admin দ্বারা অনুমোদিত হয়নি।";

            return;

        }

/*=========================================
Remember Me
=========================================*/

        const loginData = {

            companyId: docSnap.id,

            companyName: company.companyName,

            ownerName: company.ownerName,

            mobile: company.mobile,

            accountType: company.accountType

        };

        if (rememberMe.checked) {

            localStorage.setItem(
                "employerLogin",
                JSON.stringify(loginData)
            );

        } else {

            sessionStorage.setItem(
                "employerLogin",
                JSON.stringify(loginData)
            );

        }

/*=========================================
Success
=========================================*/

        message.style.color = "green";

        message.innerHTML =
            "✅ লগইন সফল হয়েছে...";

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

        message.innerHTML =
            "❌ লগইন করতে সমস্যা হয়েছে। আবার চেষ্টা করুন।";

    }

});

/*=========================================
Auto Login Check
=========================================*/

window.addEventListener("load", () => {

    const localLogin =
        localStorage.getItem("employerLogin");

    const sessionLogin =
        sessionStorage.getItem("employerLogin");

    if (localLogin || sessionLogin) {

        window.location.href = "dashboard.html";

    }

});

/*=========================================
SK Job BD
Employer Login System
Professional Version
Completed
=========================================*/
