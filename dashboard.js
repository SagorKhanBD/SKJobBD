// =========================================================
// SK JOB BD
// EMPLOYER DASHBOARD
// dashboard.js
//
// Firebase collection:
// companies/{uid}
//
// Registration system অনুযায়ী:
// companyName
// institutionCode
// ownerName
// mobile
// email
// status
// approved
// subscription
// wallet
// =========================================================


// =========================================================
// FIREBASE
// =========================================================

import { db, auth } from "../firebase.js";

import {
    doc,
    getDoc
} from "https://www.gstatic.com/firebasejs/10.13.2/firebase-firestore.js";

import {
    onAuthStateChanged,
    signOut
} from "https://www.gstatic.com/firebasejs/10.13.2/firebase-auth.js";


// =========================================================
// HTML ELEMENTS
// =========================================================

const headerCompanyName =
    document.getElementById("headerCompanyName");

const companyTitle =
    document.getElementById("companyTitle");

const companyName =
    document.getElementById("companyName");

const ownerName =
    document.getElementById("ownerName");

const mobileNumber =
    document.getElementById("mobileNumber");

const emailAddress =
    document.getElementById("emailAddress");

const accountStatus =
    document.getElementById("accountStatus");

const subscriptionPlan =
    document.getElementById("subscriptionPlan");

const logoutBtn =
    document.getElementById("logoutBtn");


// =========================================================
// HELPER
// =========================================================

function setText(element, value) {

    if (!element) {
        return;
    }

    element.textContent =
        value !== undefined &&
        value !== null &&
        String(value).trim() !== ""
            ? String(value)
            : "-";
}


// =========================================================
// SHOW LOADING
// =========================================================

function showLoading() {

    setText(
        headerCompanyName,
        "Loading..."
    );

    setText(
        companyTitle,
        "Loading..."
    );

    setText(
        companyName,
        "Loading..."
    );

    setText(
        ownerName,
        "Loading..."
    );

    setText(
        mobileNumber,
        "Loading..."
    );

    setText(
        emailAddress,
        "Loading..."
    );

    setText(
        accountStatus,
        "Loading..."
    );

    setText(
        subscriptionPlan,
        "Loading..."
    );
}


// =========================================================
// SHOW ERROR
// =========================================================

function showError(messageText) {

    console.error(
        "SK Job BD Dashboard:",
        messageText
    );

    setText(
        headerCompanyName,
        "-"
    );

    setText(
        companyTitle,
        "Employer"
    );

    setText(
        companyName,
        "-"
    );

    setText(
        ownerName,
        "-"
    );

    setText(
        mobileNumber,
        "-"
    );

    setText(
        emailAddress,
        "-"
    );

    setText(
        accountStatus,
        "-"
    );

    setText(
        subscriptionPlan,
        "Free"
    );

    alert(messageText);
}


// =========================================================
// LOAD COMPANY PROFILE
// =========================================================

async function loadCompanyProfile(user) {

    try {

        console.log(
            "Loading company profile for UID:",
            user.uid
        );


        // =================================================
        // companies/{Firebase UID}
        // =================================================

        const companyRef =
            doc(
                db,
                "companies",
                user.uid
            );


        const companySnap =
            await getDoc(
                companyRef
            );


        // =================================================
        // CHECK DOCUMENT
        // =================================================

        if (!companySnap.exists()) {

            console.error(
                "Company document not found:",
                user.uid
            );

            showError(
                "আপনার Company Profile পাওয়া যায়নি।"
            );

            return;
        }


        // =================================================
        // GET DATA
        // =================================================

        const data =
            companySnap.data();


        console.log(
            "Company Data:",
            data
        );


        // =================================================
        // COMPANY NAME
        // =================================================

        const company =
            data.companyName || "-";


        setText(
            headerCompanyName,
            company
        );


        setText(
            companyTitle,
            company
        );


        setText(
            companyName,
            company
        );


        // =================================================
        // OWNER
        // =================================================

        setText(
            ownerName,
            data.ownerName
        );


        // =================================================
        // MOBILE
        // =================================================

        setText(
            mobileNumber,
            data.mobile
        );


        // =================================================
        // EMAIL
        // =================================================

        setText(
            emailAddress,
            data.email
        );


        // =================================================
        // ACCOUNT STATUS
        // =================================================

        let statusText =
            data.status || "active";


        if (
            statusText === "active"
        ) {

            statusText =
                "Active";

        }

        else if (
            statusText === "pending"
        ) {

            statusText =
                "Pending";

        }

        else if (
            statusText === "blocked"
        ) {

            statusText =
                "Blocked";

        }


        setText(
            accountStatus,
            statusText
        );


        // =================================================
        // SUBSCRIPTION
        // =================================================

        const subscription =
            data.subscription || {};


        setText(
            subscriptionPlan,
            subscription.plan || "Free"
        );


        // =================================================
        // SAVE LOGIN INFORMATION
        // =================================================

        const loginData = {

            uid:
                user.uid,

            companyName:
                company,

            ownerName:
                data.ownerName || "",

            mobile:
                data.mobile || "",

            email:
                data.email || "",

            status:
                data.status || "active",

            accountType:
                data.accountType || "company"

        };


        localStorage.setItem(
            "employerLogin",
            JSON.stringify(loginData)
        );


        console.log(
            "Company profile loaded successfully."
        );

    }

    catch (error) {

        console.error(
            "Company Profile Error:",
            error
        );


        showError(
            "Company Profile লোড করতে সমস্যা হয়েছে।"
        );

    }

}


// =========================================================
// AUTHENTICATION CHECK
// =========================================================

showLoading();


onAuthStateChanged(
    auth,
    async (user) => {

        console.log(
            "Firebase Auth User:",
            user
        );


        // =================================================
        // USER NOT LOGGED IN
        // =================================================

        if (!user) {

            console.log(
                "User is not logged in."
            );


            /*
             * যদি Firebase Auth session না থাকে,
             * তাহলে login page-এ পাঠানো হবে।
             */

            window.location.href =
                "login.html";

            return;
        }


        // =================================================
        // USER LOGGED IN
        // =================================================

        await loadCompanyProfile(
            user
        );

    }
);


// =========================================================
// LOGOUT
// =========================================================

if (logoutBtn) {

    logoutBtn.addEventListener(
        "click",
        async () => {

            const confirmed =
                confirm(
                    "আপনি কি Logout করতে চান?"
                );


            if (!confirmed) {
                return;
            }


            try {

                await signOut(
                    auth
                );


                localStorage.removeItem(
                    "employerLogin"
                );


                sessionStorage.removeItem(
                    "employerLogin"
                );


                window.location.href =
                    "login.html";

            }

            catch (error) {

                console.error(
                    "Logout Error:",
                    error
                );


                alert(
                    "Logout করতে সমস্যা হয়েছে।"
                );

            }

        }
    );

}


// =========================================================
// PREVENT BROKEN LINKS
// =========================================================
//
// ভবিষ্যতে যেসব পেজ এখনো তৈরি হয়নি,
// সেগুলোতে ক্লিক করলে পরিষ্কারভাবে জানাবে।
// =========================================================

const serviceLinks =
    document.querySelectorAll(
        ".serviceLinks a"
    );


serviceLinks.forEach(
    (link) => {

        link.addEventListener(
            "click",
            (event) => {

                const href =
                    link.getAttribute(
                        "href"
                    );


                if (
                    !href ||
                    href === "#"
                ) {

                    event.preventDefault();

                    alert(
                        "এই সেবাটি শীঘ্রই চালু করা হবে।"
                    );

                }

            }
        );

    }
);


// =========================================================
// END OF DASHBOARD.JS
// =========================================================
