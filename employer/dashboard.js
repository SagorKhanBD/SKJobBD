// ======================================================
// SK Job BD
// Employer Dashboard
// dashboard.js
// ======================================================

import { db } from "../firebase.js";

import {
    doc,
    getDoc
} from "https://www.gstatic.com/firebasejs/10.13.2/firebase-firestore.js";


// ======================================================
// CHECK LOGIN SESSION
// ======================================================

const employer =
    JSON.parse(
        localStorage.getItem("employerLogin")
    ) ||
    JSON.parse(
        sessionStorage.getItem("employerLogin")
    );


// ======================================================
// LOGIN SESSION NOT FOUND
// ======================================================

if (!employer) {

    window.location.href =
        "login.html";

}


// ======================================================
// HTML ELEMENTS
// ======================================================

const companyNameElement =
    document.getElementById("companyName");

const contactPersonElement =
    document.getElementById("contactPerson");

const mobileNumberElement =
    document.getElementById("mobileNumber");

const emailAddressElement =
    document.getElementById("emailAddress");

const accountStatusElement =
    document.getElementById("accountStatus");

const totalJobsElement =
    document.getElementById("totalJobs");

const totalApplicationsElement =
    document.getElementById("totalApplications");

const pendingJobsElement =
    document.getElementById("pendingJobs");

const approvedJobsElement =
    document.getElementById("approvedJobs");


// ======================================================
// LOAD COMPANY PROFILE
// ======================================================

async function loadEmployerProfile() {

    try {

        // --------------------------------------------------
        // Company UID
        // --------------------------------------------------

        const companyId =
            employer.uid ||
            employer.companyId;


        if (!companyId) {

            console.error(
                "Company UID পাওয়া যায়নি।"
            );

            window.location.href =
                "login.html";

            return;

        }


        // --------------------------------------------------
        // FIRESTORE COMPANY DOCUMENT
        // --------------------------------------------------

        const companyRef =
            doc(
                db,
                "companies",
                companyId
            );


        const companySnapshot =
            await getDoc(
                companyRef
            );


        // --------------------------------------------------
        // COMPANY NOT FOUND
        // --------------------------------------------------

        if (
            !companySnapshot.exists()
        ) {

            console.error(
                "Company profile পাওয়া যায়নি।"
            );

            alert(
                "কোম্পানি Profile পাওয়া যায়নি।"
            );

            return;

        }


        // --------------------------------------------------
        // COMPANY DATA
        // --------------------------------------------------

        const data =
            companySnapshot.data();


        console.log(
            "Company Profile:",
            data
        );


        // ==================================================
        // COMPANY NAME
        // ==================================================

        if (companyNameElement) {

            companyNameElement.textContent =
                data.companyName ||
                employer.companyName ||
                "-";

        }


        // ==================================================
        // OWNER / CONTACT PERSON
        // ==================================================

        if (contactPersonElement) {

            contactPersonElement.textContent =
                data.ownerName ||
                employer.ownerName ||
                "-";

        }


        // ==================================================
        // MOBILE NUMBER
        // ==================================================

        if (mobileNumberElement) {

            mobileNumberElement.textContent =
                data.mobile ||
                employer.mobile ||
                "-";

        }


        // ==================================================
        // EMAIL
        // ==================================================

        if (emailAddressElement) {

            emailAddressElement.textContent =
                data.email ||
                employer.email ||
                "Gmail দেওয়া হয়নি";

        }


        // ==================================================
        // ACCOUNT STATUS
        // ==================================================

        if (accountStatusElement) {

            const status =
                data.status ||
                "active";


            if (
                status === "active"
            ) {

                accountStatusElement.textContent =
                    "Active";

            }

            else if (
                status === "pending"
            ) {

                accountStatusElement.textContent =
                    "Pending";

            }

            else {

                accountStatusElement.textContent =
                    status;

            }

        }


        // ==================================================
        // TOTAL JOBS
        // ==================================================

        if (totalJobsElement) {

            totalJobsElement.textContent =
                data.totalPosts ||
                data.totalJobs ||
                0;

        }


        // ==================================================
        // TOTAL APPLICATIONS
        // ==================================================

        if (
            totalApplicationsElement
        ) {

            totalApplicationsElement.textContent =
                data.totalApplications ||
                0;

        }


        // ==================================================
        // PENDING JOBS
        // ==================================================

        if (pendingJobsElement) {

            pendingJobsElement.textContent =
                data.pendingJobs ||
                0;

        }


        // ==================================================
        // APPROVED JOBS
        // ==================================================

        if (approvedJobsElement) {

            approvedJobsElement.textContent =
                data.approvedJobs ||
                0;

        }


        // ==================================================
        // COMPANY LOGO
        // ==================================================

        const companyLogo =
            document.getElementById(
                "companyLogo"
            );


        if (
            companyLogo &&
            data.logoUrl
        ) {

            companyLogo.src =
                data.logoUrl;

            companyLogo.style.display =
                "block";

        }


        // ==================================================
        // UPDATE LOGIN STORAGE
        // ==================================================

        const updatedLoginData = {

            uid:
                data.uid ||
                companyId,

            companyId:
                companyId,

            companyName:
                data.companyName ||
                "",

            ownerName:
                data.ownerName ||
                "",

            mobile:
                data.mobile ||
                "",

            email:
                data.email ||
                "",

            accountType:
                data.accountType ||
                "company",

            status:
                data.status ||
                "active",

            logoUrl:
                data.logoUrl ||
                ""

        };


        // --------------------------------------------------
        // KEEP REMEMBER ME SESSION
        // --------------------------------------------------

        if (
            localStorage.getItem(
                "employerLogin"
            )
        ) {

            localStorage.setItem(
                "employerLogin",
                JSON.stringify(
                    updatedLoginData
                )
            );

        }

        else {

            sessionStorage.setItem(
                "employerLogin",
                JSON.stringify(
                    updatedLoginData
                )
            );

        }


        console.log(
            "SK Job BD Company Dashboard Loaded Successfully."
        );

    }

    catch (error) {

        console.error(
            "Dashboard Error:",
            error
        );


        alert(
            "ড্যাশবোর্ড লোড করতে সমস্যা হয়েছে।"
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

const logoutBtn =
    document.getElementById(
        "logoutBtn"
    );


if (logoutBtn) {

    logoutBtn.addEventListener(
        "click",
        () => {

            const confirmLogout =
                confirm(
                    "আপনি কি Logout করতে চান?"
                );


            if (
                !confirmLogout
            ) {

                return;

            }


            // ----------------------------------------------
            // CLEAR LOGIN
            // ----------------------------------------------

            localStorage.removeItem(
                "employerLogin"
            );


            sessionStorage.removeItem(
                "employerLogin"
            );


            // ----------------------------------------------
            // FIREBASE SIGN OUT
            // ----------------------------------------------

            import(
                "https://www.gstatic.com/firebasejs/10.13.2/firebase-auth.js"
            )
                .then(
                    async ({
                        signOut
                    }) => {

                        try {

                            const {
                                auth
                            } = await import(
                                "../firebase.js"
                            );


                            await signOut(
                                auth
                            );

                        }

                        catch (
                            error
                        ) {

                            console.error(
                                "Firebase Logout Error:",
                                error
                            );

                        }


                        window.location.href =
                            "login.html";

                    }
                );

        }
    );

}


// ======================================================
// QUICK ACTION - ADD JOB
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
                "add-job.html";

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
                "payment.html";

        }
    );

}


// ======================================================
// PROFILE HOME
// ======================================================

const btnProfile =
    document.getElementById(
        "btnProfile"
    );


if (btnProfile) {

    btnProfile.addEventListener(
        "click",
        () => {

            window.location.href =
                "company-profile.html";

        }
    );

}


// ======================================================
// SK JOB BD
// COMPANY DASHBOARD
// ======================================================
