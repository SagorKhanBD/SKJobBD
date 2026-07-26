// ======================================================
// SK Job BD
// Employer Registration System
// register.js (Part 1)
// ======================================================

import { db } from "../firebase.js";

import {
    collection,
    query,
    where,
    getDocs,
    addDoc,
    serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.13.2/firebase-firestore.js";

// =====================================

const form = document.getElementById("registerForm");
const message = document.getElementById("message");

// =====================================

form.addEventListener("submit", async (e) => {

    e.preventDefault();

    message.style.color = "red";
    message.innerHTML = "";

    const accountType =
        document.getElementById("accountType").value.trim();

    const organization =
        document.getElementById("organization").value.trim();

    const contactPerson =
        document.getElementById("contactPerson").value.trim();

    const mobile =
        document.getElementById("mobile").value.trim();

    const email =
        document.getElementById("email").value.trim();

    const address =
        document.getElementById("address").value.trim();

    const tradeLicense =
        document.getElementById("tradeLicense").value.trim();

    const eiin =
        document.getElementById("eiin").value.trim();

    const password =
        document.getElementById("password").value;

    const confirmPassword =
        document.getElementById("confirmPassword").value;

    const agree =
        document.getElementById("agree").checked;

    // =====================================
    // Required Validation
    // =====================================

    if (
        accountType === "" ||
        organization === "" ||
        contactPerson === "" ||
        mobile === "" ||
        address === "" ||
        password === "" ||
        confirmPassword === ""
    ) {

        message.innerHTML =
            "❌ সকল বাধ্যতামূলক তথ্য পূরণ করুন।";

        return;

    }

    if (!agree) {

        message.innerHTML =
            "❌ শর্তাবলীতে সম্মতি দিন।";

        return;

    }

    if (!/^01[0-9]{9}$/.test(mobile)) {

        message.innerHTML =
            "❌ সঠিক ১১ সংখ্যার মোবাইল নম্বর লিখুন।";

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

    try {

        // Continue Part 2...        // =====================================
        // Duplicate Mobile Check
        // =====================================

        const mobileQuery = query(
            collection(db, "employers"),
            where("mobile", "==", mobile)
        );

        const mobileSnapshot = await getDocs(mobileQuery);

        if (!mobileSnapshot.empty) {

            message.innerHTML =
                "❌ এই মোবাইল নম্বর দিয়ে ইতোমধ্যে একটি Account রয়েছে।";

            return;

        }

        // =====================================
        // Duplicate Email Check
        // =====================================

        if (email !== "") {

            const emailQuery = query(
                collection(db, "employers"),
                where("email", "==", email)
            );

            const emailSnapshot = await getDocs(emailQuery);

            if (!emailSnapshot.empty) {

                message.innerHTML =
                    "❌ এই Email দিয়ে ইতোমধ্যে একটি Account রয়েছে।";

                return;

            }

        }

        // =====================================
        // Account Type Validation
        // =====================================

        if (accountType === "company" && tradeLicense === "") {

            message.innerHTML =
                "❌ কোম্পানির জন্য Trade License নম্বর দিন।";

            return;

        }

        if (accountType === "school" && eiin === "") {

            message.innerHTML =
                "❌ স্কুলের EIIN নম্বর দিন।";

            return;

        }

        if (accountType === "college" && eiin === "") {

            message.innerHTML =
                "❌ কলেজের EIIN নম্বর দিন।";

            return;

        }

        if (accountType === "madrasa" && eiin === "") {

            message.innerHTML =
                "❌ মাদ্রাসার EIIN নম্বর দিন।";

            return;

        }

        // =====================================
        // Continue Part 3...        // =====================================
        // Save Employer Information
        // =====================================

        await addDoc(
            collection(db, "employers"),
            {

                accountType: accountType,

                organization: organization,

                contactPerson: contactPerson,

                mobile: mobile,

                email: email,

                address: address,

                tradeLicense: tradeLicense,

                eiin: eiin,

                password: password,

                role: "employer",

                status: "pending",

                createdAt: serverTimestamp()

            }
        );

        // =====================================
        // Registration Success
        // =====================================

        message.style.color = "green";

        message.innerHTML =
            "✅ Registration Successful. আপনার আবেদন Admin Approval-এর জন্য পাঠানো হয়েছে।";

        form.reset();

        // =====================================
        // Redirect Login Page
        // =====================================

        setTimeout(() => {

            window.location.href =
                "login.html";

        }, 2000);

        // Continue Part 4...    }

    // =====================================
    // Error Handling
    // =====================================

    catch (error) {

        console.error("Employer Registration Error:", error);

        message.style.color = "red";

        if (error.code === "permission-denied") {

            message.innerHTML =
                "❌ Permission Denied. Firestore Rules পরীক্ষা করুন।";

        } else {

            message.innerHTML =
                "❌ " + error.message;

        }

    }

});

// ======================================================
// End of employer/register.js
// SK Job BD Version 2
// ======================================================
