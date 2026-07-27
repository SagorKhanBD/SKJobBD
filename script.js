/*
================================================
SK Job BD
Main JavaScript
Version 3.0
================================================
*/

"use strict";

// ==============================================
// Firebase
// ==============================================

import { db } from "./firebase.js";

import {
    collection,
    getDocs,
    query,
    where,
    orderBy
} from "https://www.gstatic.com/firebasejs/10.13.2/firebase-firestore.js";

// ==============================================
// Website Loaded
// ==============================================

document.addEventListener("DOMContentLoaded", () => {

    console.log("✅ SK Job BD Loaded");

    const year = document.getElementById("year");

    if (year) {

        year.textContent = new Date().getFullYear();

    }

    loadApprovedJobs();

});

// ==============================================
// Approved Job Load
// ==============================================

async function loadApprovedJobs() {

    const jobContainer =
        document.getElementById("jobList");

    if (!jobContainer) return;

    jobContainer.innerHTML =
        "<p>Loading Jobs...</p>";

    try {

        const q = query(
            collection(db, "jobs"),
            where("status", "==", "approved"),
            orderBy("createdAt", "desc")
        );

        const snapshot = await getDocs(q);

        jobContainer.innerHTML = "";

        if (snapshot.empty) {

            jobContainer.innerHTML =
                "<p>কোনো চাকরির বিজ্ঞপ্তি পাওয়া যায়নি।</p>";

            return;

        }

        // Continue Part 2...        snapshot.forEach((doc) => {

            const job = doc.data();

            jobContainer.innerHTML += `

            <div class="job-card">

                <h3>${job.jobTitle}</h3>

                <p><strong>🏢 প্রতিষ্ঠান:</strong> ${job.companyName}</p>

                <p><strong>📂 বিভাগ:</strong> ${job.jobCategory}</p>

                <p><strong>📍 কর্মস্থল:</strong> ${job.jobLocation}</p>

                <p><strong>🎓 শিক্ষাগত যোগ্যতা:</strong> ${job.education || "-"}</p>

                <p><strong>💰 বেতন:</strong> ${job.salary || "আলোচনা সাপেক্ষে"}</p>

                <p><strong>📅 আবেদনের শেষ তারিখ:</strong> ${job.deadline}</p>

                <a
                    href="${job.applyLink || "#"}"
                    target="_blank"
                    class="apply-btn"
                >
                    আবেদন করুন
                </a>

            </div>

            `;

        });

    }

    catch (error) {

        console.error("Load Job Error:", error);

        jobContainer.innerHTML =
            "<p>❌ চাকরির তথ্য লোড করা যায়নি।</p>";

    }

}

// Continue Part 3...// ==============================================
// Search Function
// ==============================================

function searchJob() {

    const keyword =
        document.querySelector(".hero input")?.value
            .trim()
            .toLowerCase();

    if (!keyword) {

        alert("চাকরির নাম লিখুন।");

        return;

    }

    const jobs =
        document.querySelectorAll(".job-card");

    let found = false;

    jobs.forEach((job) => {

        const text =
            job.innerText.toLowerCase();

        if (text.includes(keyword)) {

            job.style.display = "block";

            found = true;

        } else {

            job.style.display = "none";

        }

    });

    if (!found) {

        alert("কোনো মিল পাওয়া যায়নি।");

    }

}

window.searchJob = searchJob;

// ==============================================
// Language Function
// ==============================================

function changeLanguage(language) {

    console.log("Selected Language:", language);

    // Future Translation System

}

window.changeLanguage = changeLanguage;

// ==============================================
// Message Function
// ==============================================

function showMessage(message) {

    alert(message);

}

window.showMessage = showMessage;

// ==============================================
// End of File
// SK Job BD Version 3.0
// ==============================================
