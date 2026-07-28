// ======================================================
// SK Job BD
// Employer Add Job
// add-job.js (Part 1)
// ======================================================

import { db } from "../firebase.js";

import {
    collection,
    addDoc,
    serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.13.2/firebase-firestore.js";

// ======================================
// Check Employer Login
// ======================================

const employer = JSON.parse(
    localStorage.getItem("employerLogin")
) || JSON.parse(
    sessionStorage.getItem("employerLogin")
);

if (!employer) {

    window.location.href = "login.html";

}

// ======================================

const form = document.getElementById("jobForm");

const message = document.getElementById("message");

// ======================================

form.addEventListener("submit", async (e) => {

    e.preventDefault();

    message.style.color = "red";

    message.innerHTML = "";

    const jobTitle =
        document.getElementById("jobTitle").value.trim();

    const companyName =
        document.getElementById("companyName").value.trim();

    const jobCategory =
        document.getElementById("jobCategory").value;

    const jobLocation =
        document.getElementById("jobLocation").value.trim();

    const deadline =
        document.getElementById("deadline").value;

    const education =
        document.getElementById("education").value.trim();

    const salary =
        document.getElementById("salary").value.trim();

    const vacancy =
        document.getElementById("vacancy").value;

    const jobDescription =
        document.getElementById("jobDescription").value.trim();

    const applyLink =
        document.getElementById("applyLink").value.trim();

    // ======================================
    // Validation
    // ======================================

    if (
        jobTitle === "" ||
        companyName === "" ||
        jobCategory === "" ||
        deadline === "" ||
        jobDescription === ""
    ) {

        message.innerHTML =
            "❌ সকল বাধ্যতামূলক তথ্য পূরণ করুন।";

        return;

    }

    try {

        // Continue Part 2...        // ======================================
        // Save Job Information
        // ======================================

        await addDoc(
            collection(db, "jobs"),
            {

                employerId: employer.id,

                companyName: companyName,

                jobTitle: jobTitle,

                jobCategory: jobCategory,

                jobLocation: jobLocation,

                education: education,

                salary: salary,

                vacancy: vacancy,

                deadline: deadline,

                jobDescription: jobDescription,

                applyLink: applyLink,

                status: "pending",

                createdAt: serverTimestamp(),

                approvedAt: null,

                approvedBy: "",

                totalApplications: 0

            }
        );

        // Continue Part 3...        // ======================================
        // Success Message
        // ======================================

        message.style.color = "green";

        message.innerHTML =
            "✅ চাকরির বিজ্ঞপ্তি সফলভাবে জমা হয়েছে। Admin Approval-এর পরে এটি প্রকাশ হবে।";

        // ======================================
        // Reset Form
        // ======================================

        form.reset();

        // ======================================
        // Redirect Dashboard
        // ======================================

        setTimeout(() => {

            window.location.href =
                "dashboard.html";

        }, 2000);

    }

    // ======================================
    // Error Handling
    // ======================================

    catch (error) {

        console.error("Job Post Error:", error);

        message.style.color = "red";

        // Continue Part 4...        if (error.code === "permission-denied") {

            message.innerHTML =
                "❌ Permission Denied. Firestore Rules পরীক্ষা করুন।";

        } else {

            message.innerHTML =
                "❌ " + error.message;

        }

    }

});

// ======================================================
// End of employer/add-job.js
// SK Job BD
// ======================================================
