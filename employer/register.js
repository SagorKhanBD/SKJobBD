// ======================================================
// SK Job BD
// Employer Registration
// register.js (Part 1)
// ======================================================

import { db, auth } from "../firebase.js";

import {
    collection,
    query,
    where,
    getDocs,
    addDoc,
    serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.13.2/firebase-firestore.js";

import {
    createUserWithEmailAndPassword
} from "https://www.gstatic.com/firebasejs/10.13.2/firebase-auth.js";

// =======================================

const form = document.getElementById("registerForm");

const message = document.getElementById("message");

// =======================================

form.addEventListener("submit", async (e) => {

    e.preventDefault();

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

    // ===========================
    // Required Validation
    // ===========================

    if (
        accountType === "" ||
        organization === "" ||
        contactPerson === "" ||
        mobile === "" ||
        email === "" ||
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
            "❌ সঠিক মোবাইল নম্বর লিখুন।";

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

        // Continue Part 2...
        // ===================================
        // Duplicate Mobile Check
        // ===================================

        const mobileQuery = query(
            collection(db, "users"),
            where("mobile", "==", mobile)
        );

        const mobileSnapshot = await getDocs(mobileQuery);

        if (!mobileSnapshot.empty) {

            message.innerHTML =
                "❌ এই মোবাইল নম্বর দিয়ে ইতোমধ্যে একটি Account রয়েছে।";

            return;

        }

        // ===================================
        // Duplicate Email Check
        // ===================================

        const emailQuery = query(
            collection(db, "users"),
            where("email", "==", email)
        );

        const emailSnapshot = await getDocs(emailQuery);

        if (!emailSnapshot.empty) {

            message.innerHTML =
                "❌ এই Email দিয়ে ইতোমধ্যে একটি Account রয়েছে।";

            return;

        }

        // ===================================
        // Firebase Authentication
        // ===================================

        const userCredential =
            await createUserWithEmailAndPassword(
                auth,
                email,
                password
            );

        const uid = userCredential.user.uid;

        // ===================================
        // Save Employer Information
        // ===================================

        await addDoc(
            collection(db, "users"),
            {

                uid: uid,

                accountType: accountType,

                organization: organization,

                contactPerson: contactPerson,

                mobile: mobile,

                email: email,

                address: address,

                tradeLicense: tradeLicense,

                eiin: eiin,

                role: "employer",

                status: "pending",

                createdAt: serverTimestamp()

            }

        );

        // Continue Part 3...
