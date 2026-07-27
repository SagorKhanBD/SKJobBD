// ======================================================
// SK Job BD
// Employer Dashboard
// dashboard.js (Part 1)
// ======================================================

import { db } from "../firebase.js";

import {
    doc,
    getDoc
} from "https://www.gstatic.com/firebasejs/10.13.2/firebase-firestore.js";

// ======================================
// Check Login Session
// ======================================

const employer = JSON.parse(
    localStorage.getItem("employerLogin")
) ||
JSON.parse(
    sessionStorage.getItem("employerLogin")
);

if (!employer) {

    window.location.href = "login.html";

}

// ======================================
// HTML Elements
// ======================================

const companyName =
    document.getElementById("companyName");

const contactPerson =
    document.getElementById("contactPerson");

const mobileNumber =
    document.getElementById("mobileNumber");

const emailAddress =
    document.getElementById("emailAddress");

const accountStatus =
    document.getElementById("accountStatus");

// ======================================
// Load Employer Information
// ======================================

async function loadEmployerProfile() {

    try {

        const ref = doc(db, "employers", employer.id);

        const snap = await getDoc(ref);

        if (!snap.exists()) {

            alert("Employer তথ্য পাওয়া যায়নি।");

            return;

        }

        const data = snap.data();

        // Continue Part 2...        // ======================================
        // Company Profile
        // ======================================

        companyName.textContent =
            data.organization || "-";

        contactPerson.textContent =
            data.contactPerson || "-";

        mobileNumber.textContent =
            data.mobile || "-";

        emailAddress.textContent =
            data.email || "-";

        accountStatus.textContent =
            data.status || "Pending";

        // ======================================
        // Dashboard Statistics
        // ======================================

        document.getElementById("totalJobs").textContent =
            data.totalJobs || 0;

        document.getElementById("totalApplications").textContent =
            data.totalApplications || 0;

        document.getElementById("pendingJobs").textContent =
            data.pendingJobs || 0;

        document.getElementById("approvedJobs").textContent =
            data.approvedJobs || 0;

    }

    catch (error) {

        console.error("Dashboard Error:", error);

        alert("ড্যাশবোর্ড লোড করতে সমস্যা হয়েছে।");

    }

}

// ======================================
// Load Dashboard
// ======================================

loadEmployerProfile();

// Continue Part 3...// ======================================
// Logout
// ======================================

document.getElementById("logoutBtn").addEventListener("click", () => {

    if (confirm("আপনি কি Logout করতে চান?")) {

        localStorage.removeItem("employerLogin");

        sessionStorage.removeItem("employerLogin");

        window.location.href = "login.html";

    }

});

// ======================================
// Quick Action Buttons
// ======================================

document.getElementById("btnAddJob").addEventListener("click", () => {

    window.location.href = "add-job.html";

});

document.getElementById("btnManageJobs").addEventListener("click", () => {

    window.location.href = "my-jobs.html";

});

document.getElementById("btnApplications").addEventListener("click", () => {

    window.location.href = "applications.html";

});

document.getElementById("btnPayment").addEventListener("click", () => {

    window.location.href = "payment.html";

});

// ======================================
// End of File
// ======================================
