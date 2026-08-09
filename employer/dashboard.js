// ======================================================
// SK JOB BD
// EMPLOYER / COMPANY DASHBOARD
// dashboard.js
// ======================================================

import { db } from "../firebase.js";

import {
    doc,
    getDoc
} from "https://www.gstatic.com/firebasejs/10.13.2/firebase-firestore.js";


// ======================================================
// DOM ELEMENTS
// ======================================================

const companyNameElement =
    document.getElementById("companyName");

const companyTitleElement =
    document.getElementById("companyTitle");

const contactPersonElement =
    document.getElementById("contactPerson");

const mobileNumberElement =
    document.getElementById("mobileNumber");

const emailAddressElement =
    document.getElementById("emailAddress");

const accountStatusElement =
    document.getElementById("accountStatus");


// ======================================================
// DASHBOARD STATISTICS
// ======================================================

const totalJobsElement =
    document.getElementById("totalJobs");

const activeJobsElement =
    document.getElementById("activeJobs");

const totalApplicantsElement =
    document.getElementById("totalApplicants");

const walletBalanceElement =
    document.getElementById("walletBalance");


// ======================================================
// LOGIN SESSION
// ======================================================

const localLogin =
    localStorage.getItem("employerLogin");

const sessionLogin =
    sessionStorage.getItem("employerLogin");


const employer =
    localLogin
        ? JSON.parse(localLogin)
        : sessionLogin
            ? JSON.parse(sessionLogin)
            : null;


// ======================================================
// LOGIN CHECK
// ======================================================

if (!employer) {

    window.location.href =
        "login.html";

}


// ======================================================
// LOAD COMPANY PROFILE
// ======================================================

async function loadEmployerProfile() {

    try {

        // --------------------------------------------------
        // Company ID
        // --------------------------------------------------

        const companyId =
            employer.companyId ||
            employer.uid ||
            employer.id;


        if (!companyId) {

            console.error(
                "Company ID পাওয়া যায়নি।",
                employer
            );

            alert(
                "কোম্পানি Account ID পাওয়া যায়নি। আবার Login করুন।"
            );

            localStorage.removeItem(
                "employerLogin"
            );

            sessionStorage.removeItem(
                "employerLogin"
            );

            window.location.href =
                "login.html";

            return;

        }


        // --------------------------------------------------
        // Firestore Reference
        // --------------------------------------------------
        // Registration system:
        // companies/{user.uid}
        // --------------------------------------------------

        const companyRef =
            doc(
                db,
                "companies",
                companyId
            );


        const companySnapshot =
            await getDoc(companyRef);


        // --------------------------------------------------
        // Company Not Found
        // --------------------------------------------------

        if (!companySnapshot.exists()) {

            console.error(
                "Company document পাওয়া যায়নি:",
                companyId
            );

            alert(
                "কোম্পানির তথ্য পাওয়া যায়নি। আবার Login করুন।"
            );

            localStorage.removeItem(
                "employerLogin"
            );

            sessionStorage.removeItem(
                "employerLogin"
            );

            window.location.href =
                "login.html";

            return;

        }


        // --------------------------------------------------
        // Company Data
        // --------------------------------------------------

        const data =
            companySnapshot.data();


        console.log(
            "SK Job BD Company Data:",
            data
        );


        // ==================================================
        // COMPANY NAME
        // ==================================================

        const companyName =
            data.companyName || "-";


        if (companyNameElement) {

            companyNameElement.textContent =
                companyName;

        }


        if (companyTitleElement) {

            companyTitleElement.textContent =
                companyName;

        }


        // ==================================================
        // OWNER NAME
        // ==================================================

        if (contactPersonElement) {

            contactPersonElement.textContent =
                data.ownerName || "-";

        }


        // ==================================================
        // MOBILE
        // ==================================================

        if (mobileNumberElement) {

            mobileNumberElement.textContent =
                data.mobile || "-";

        }


        // ==================================================
        // EMAIL
        // ==================================================

        if (emailAddressElement) {

            emailAddressElement.textContent =
                data.email || "দেওয়া হয়নি";

        }


        // ==================================================
        // ACCOUNT STATUS
        // ==================================================

        if (accountStatusElement) {

            const status =
                data.status || "active";


            if (status === "active") {

                accountStatusElement.textContent =
                    "Active";

                accountStatusElement.style.color =
                    "green";

            }

            else if (status === "pending") {

                accountStatusElement.textContent =
                    "Pending";

                accountStatusElement.style.color =
                    "orange";

            }

            else if (status === "blocked") {

                accountStatusElement.textContent =
                    "Blocked";

                accountStatusElement.style.color =
                    "red";

            }

            else {

                accountStatusElement.textContent =
                    status;

            }

        }


        // ==================================================
        // TOTAL JOBS
        // ==================================================

        const totalJobs =
            Number(data.totalPosts || 0);


        if (totalJobsElement) {

            totalJobsElement.textContent =
                totalJobs;

        }


        // ==================================================
        // TOTAL APPLICATIONS
        // ==================================================

        const totalApplications =
            Number(
                data.totalApplications || 0
            );


        if (totalApplicantsElement) {

            totalApplicantsElement.textContent =
                totalApplications;

        }


        // ==================================================
        // ACTIVE JOBS
        // ==================================================
        // আপাতত totalPosts-কে Active Jobs হিসেবে দেখানো হচ্ছে।
        // পরবর্তীতে আলাদা Job collection থেকে প্রকৃত
        // Active Job সংখ্যা হিসাব করা যাবে।
        // ==================================================

        if (activeJobsElement) {

            activeJobsElement.textContent =
                totalJobs;

        }


        // ==================================================
        // WALLET
        // ==================================================

        const wallet =
            data.wallet || {};


        const balance =
            Number(
                wallet.balance || 0
            );


        if (walletBalanceElement) {

            walletBalanceElement.textContent =
                "৳ " +
                balance.toFixed(2);

        }


        // ==================================================
        // RECENT ACTIVITY
        // ==================================================

        const recentActivity =
            document.getElementById(
                "recentActivity"
            );


        if (recentActivity) {

            recentActivity.innerHTML =

                "<p>" +
                "🏢 " +
                companyName +
                " এর Employer Dashboard সক্রিয় আছে।" +
                "</p>";

        }


        // ==================================================
        // PROFILE DATA CONSOLE
        // ==================================================

        console.log(
            "Company Name:",
            data.companyName
        );

        console.log(
            "Owner:",
            data.ownerName
        );

        console.log(
            "Mobile:",
            data.mobile
        );

        console.log(
            "Status:",
            data.status
        );

        console.log(
            "Wallet:",
            balance
        );


    }

    catch (error) {

        console.error(
            "SK Job BD Dashboard Error:",
            error
        );


        alert(
            "Dashboard তথ্য লোড করতে সমস্যা হয়েছে।"
        );

    }

}


// ======================================================
// LOAD DASHBOARD
// ======================================================

loadEmployerProfile();


// ======================================================
// LOGOUT
// ======================================================

const logoutButton =
    document.getElementById(
        "logoutBtn"
    );


if (logoutButton) {

    logoutButton.addEventListener(
        "click",
        () => {

            const confirmLogout =
                confirm(
                    "আপনি কি Logout করতে চান?"
                );


            if (!confirmLogout) {

                return;

            }


            localStorage.removeItem(
                "employerLogin"
            );

            sessionStorage.removeItem(
                "employerLogin"
            );


            window.location.href =
                "login.html";

        }
    );

}


// ======================================================
// QUICK ACTION - POST JOB
// ======================================================

const btnAddJob =
    document.getElementById(
        "btnAddJob"
    );


if (btnAddJob) {

    btnAddJob.addEventListener(
        "click",
        () => {

            window.location.href =
                "post-job.html";

        }
    );

}


// ======================================================
// QUICK ACTION - MANAGE JOBS
// ======================================================

const btnManageJobs =
    document.getElementById(
        "btnManageJobs"
    );


if (btnManageJobs) {

    btnManageJobs.addEventListener(
        "click",
        () => {

            window.location.href =
                "my-jobs.html";

        }
    );

}


// ======================================================
// QUICK ACTION - APPLICATIONS
// ======================================================

const btnApplications =
    document.getElementById(
        "btnApplications"
    );


if (btnApplications) {

    btnApplications.addEventListener(
        "click",
        () => {

            window.location.href =
                "applications.html";

        }
    );

}


// ======================================================
// QUICK ACTION - PAYMENT
// ======================================================

const btnPayment =
    document.getElementById(
        "btnPayment"
    );


if (btnPayment) {

    btnPayment.addEventListener(
        "click",
        () => {

            window.location.href =
                "wallet.html";

        }
    );

}


// ======================================================
// ONLINE / OFFLINE
// ======================================================

window.addEventListener(
    "offline",
    () => {

        console.warn(
            "Internet connection বিচ্ছিন্ন।"
        );

    }
);


window.addEventListener(
    "online",
    () => {

        console.log(
            "Internet connection পুনরায় চালু হয়েছে।"
        );

        loadEmployerProfile();

    }
);


// ======================================================
// SK JOB BD
// COMPANY DASHBOARD
// FINAL VERSION
// ======================================================
