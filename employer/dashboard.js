
// ======================================================
// SK Job BD
// Employer Login
// login.js (Part 1)
// ======================================================

import { db } from "../firebase.js";

import {

    collection,

    query,

    where,

    getDocs

} from "https://www.gstatic.com/firebasejs/10.13.2/firebase-firestore.js";

// ======================================

const form = document.getElementById("loginForm");

const message = document.getElementById("message");

// ======================================

form.addEventListener("submit", async (e) => {

    e.preventDefault();

    message.innerHTML = "";

    const mobile =
        document.getElementById("mobile").value.trim();

    const password =
        document.getElementById("password").value;

    const remember =
        document.getElementById("rememberMe").checked;

    // ===========================
    // Validation
    // ===========================

    if (mobile === "" || password === "") {

        message.innerHTML =
            "❌ মোবাইল নম্বর এবং Password লিখুন।";

        return;

    }

    if (!/^01[0-9]{9}$/.test(mobile)) {

        message.innerHTML =
            "❌ সঠিক ১১ সংখ্যার মোবাইল নম্বর লিখুন।";

        return;

    }

    try {

        // Continue Part 2...        // ======================================
        // Search Employer
        // ======================================

        const q = query(
            collection(db, "employers"),
            where("mobile", "==", mobile)
        );

        const snapshot = await getDocs(q);

        if (snapshot.empty) {

            message.innerHTML =
                "❌ এই মোবাইল নম্বরের কোনো Employer Account পাওয়া যায়নি।";

            return;

        }

        let employerData = null;

        snapshot.forEach((doc) => {

            employerData = {

                id: doc.id,

                ...doc.data()

            };

        });

        // ======================================
        // Password Verification
        // ======================================

        if (employerData.password !== password) {

            message.innerHTML =
                "❌ Password সঠিক নয়।";

            return;

        }

        // ======================================
        // Admin Approval Check
        // ======================================

        if (employerData.status !== "approved") {

            message.innerHTML =
                "⏳ আপনার Account এখনও Admin দ্বারা অনুমোদিত হয়নি।";

            return;

        }

        // Continue Part 3...        // ======================================
        // Remember Me
        // ======================================

        if (remember) {

            localStorage.setItem(
                "employerLogin",
                JSON.stringify(employerData)
            );

        } else {

            sessionStorage.setItem(
                "employerLogin",
                JSON.stringify(employerData)
            );

        }

        // ======================================
        // Login Success
        // ======================================

        message.style.color = "green";

        message.innerHTML =
            "✅ Login Successful...";

        setTimeout(() => {

            window.location.href =
                "dashboard.html";

        }, 1000);

    }

    catch (error) {

        console.error(error);

        message.style.color = "red";

        message.innerHTML =
            "❌ " + error.message;

    }

});
