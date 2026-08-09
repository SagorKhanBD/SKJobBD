// ======================================================
// SK JOB BD
// COMPANY / EMPLOYER LOGIN SYSTEM
// ======================================================

import { db, auth } from "../firebase.js";

import {
    doc,
    getDoc
} from "https://www.gstatic.com/firebasejs/10.13.2/firebase-firestore.js";

import {
    signInWithEmailAndPassword,
    signOut
} from "https://www.gstatic.com/firebasejs/10.13.2/firebase-auth.js";


// ======================================================
// HTML ELEMENTS
// ======================================================

const loginForm =
    document.getElementById("loginForm");

const message =
    document.getElementById("message");

const rememberMe =
    document.getElementById("rememberMe");

const passwordInput =
    document.getElementById("password");

const togglePassword =
    document.getElementById("togglePassword");


// ======================================================
// INTERNAL AUTH EMAIL
// ======================================================

function createAuthEmail(mobile) {

    return mobile + "@skjobbd-auth.local";

}


// ======================================================
// MESSAGE
// ======================================================

function showMessage(
    text,
    color = "red"
) {

    if (!message) return;

    message.style.color = color;
    message.innerHTML = text;

}


// ======================================================
// MOBILE VALIDATION
// ======================================================

function isValidMobile(mobile) {

    return /^01[3-9]\d{8}$/.test(mobile);

}


// ======================================================
// PASSWORD SHOW / HIDE
// ======================================================

if (
    passwordInput &&
    togglePassword
) {

    togglePassword.textContent = "👁";

    togglePassword.style.cursor =
        "pointer";


    togglePassword.addEventListener(
        "click",
        () => {

            if (
                passwordInput.type ===
                "password"
            ) {

                passwordInput.type =
                    "text";

                togglePassword.textContent =
                    "👁";

                togglePassword.title =
                    "Hide Password";

                togglePassword.setAttribute(
                    "aria-label",
                    "Hide Password"
                );

            }

            else {

                passwordInput.type =
                    "password";

                togglePassword.textContent =
                    "👁";

                togglePassword.title =
                    "Show Password";

                togglePassword.setAttribute(
                    "aria-label",
                    "Show Password"
                );

            }

        }
    );

}


// ======================================================
// LOGIN
// ======================================================

if (loginForm) {

    loginForm.addEventListener(
        "submit",
        async (e) => {

            e.preventDefault();


            showMessage(
                "",
                "red"
            );


            // ----------------------------------------------
            // MOBILE
            // ----------------------------------------------

            const mobile =
                document
                    .getElementById("mobile")
                    ?.value
                    .trim() || "";


            // ----------------------------------------------
            // PASSWORD
            // ----------------------------------------------

            const password =
                document
                    .getElementById("password")
                    ?.value || "";


            // ----------------------------------------------
            // REQUIRED
            // ----------------------------------------------

            if (
                mobile === "" ||
                password === ""
            ) {

                showMessage(
                    "❌ মোবাইল নম্বর এবং Password লিখুন।"
                );

                return;

            }


            // ----------------------------------------------
            // MOBILE CHECK
            // ----------------------------------------------

            if (
                !isValidMobile(mobile)
            ) {

                showMessage(
                    "❌ সঠিক ১১ সংখ্যার বাংলাদেশি মোবাইল নম্বর লিখুন।"
                );

                return;

            }


            // ----------------------------------------------
            // INTERNAL EMAIL
            // ----------------------------------------------

            const authEmail =
                createAuthEmail(mobile);


            try {

                showMessage(
                    "⏳ Login হচ্ছে...",
                    "blue"
                );


                // ==========================================
                // FIREBASE AUTH LOGIN
                // ==========================================

                const userCredential =
                    await signInWithEmailAndPassword(
                        auth,
                        authEmail,
                        password
                    );


                const user =
                    userCredential.user;


                // ==========================================
                // COMPANY PROFILE
                // ==========================================

                const companyRef =
                    doc(
                        db,
                        "companies",
                        user.uid
                    );


                const companySnapshot =
                    await getDoc(
                        companyRef
                    );


                if (
                    !companySnapshot.exists()
                ) {

                    await signOut(auth);

                    showMessage(
                        "❌ কোম্পানি Profile পাওয়া যায়নি।"
                    );

                    return;

                }


                const company =
                    companySnapshot.data();


                // ==========================================
                // BLOCKED
                // ==========================================

                if (
                    company.blocked === true
                ) {

                    await signOut(auth);

                    showMessage(
                        "❌ আপনার কোম্পানি অ্যাকাউন্টটি Block করা হয়েছে।"
                    );

                    return;

                }


                // ==========================================
                // ACTIVE STATUS
                // ==========================================

                if (
                    company.status !==
                    "active"
                ) {

                    await signOut(auth);

                    showMessage(
                        "⏳ আপনার কোম্পানি অ্যাকাউন্টটি বর্তমানে Active নয়।"
                    );

                    return;

                }


                // ==========================================
                // LOGIN DATA
                // ==========================================

                const loginData = {

                    uid:
                        user.uid,

                    companyId:
                        user.uid,

                    companyName:
                        company.companyName ||
                        "",

                    ownerName:
                        company.ownerName ||
                        "",

                    mobile:
                        company.mobile ||
                        mobile,

                    email:
                        company.email ||
                        "",

                    accountType:
                        company.accountType ||
                        "company",

                    status:
                        company.status ||
                        "active",

                    approved:
                        company.approved !== false,

                    blocked:
                        company.blocked === true,

                    logoUrl:
                        company.logoUrl ||
                        ""

                };


                // ==========================================
                // REMEMBER ME
                // ==========================================

                if (
                    rememberMe &&
                    rememberMe.checked
                ) {

                    localStorage.setItem(
                        "employerLogin",
                        JSON.stringify(loginData)
                    );

                    sessionStorage.removeItem(
                        "employerLogin"
                    );

                }

                else {

                    sessionStorage.setItem(
                        "employerLogin",
                        JSON.stringify(loginData)
                    );

                    localStorage.removeItem(
                        "employerLogin"
                    );

                }


                // ==========================================
                // SUCCESS
                // ==========================================

                showMessage(
                    "✅ Login সফল হয়েছে। Dashboard-এ নেওয়া হচ্ছে...",
                    "green"
                );


                setTimeout(
                    () => {

                        window.location.href =
                            "dashboard.html";

                    },
                    1000
                );


            }


            // ==============================================
            // ERROR
            // ==============================================

            catch (error) {

                console.error(
                    "SK Job BD Login Error:",
                    error
                );


                if (
                    error.code ===
                    "auth/invalid-credential"
                ) {

                    showMessage(
                        "❌ মোবাইল নম্বর অথবা Password সঠিক নয়।"
                    );

                    return;

                }


                if (
                    error.code ===
                    "auth/wrong-password"
                ) {

                    showMessage(
                        "❌ Password সঠিক নয়।"
                    );

                    return;

                }


                if (
                    error.code ===
                    "auth/user-not-found"
                ) {

                    showMessage(
                        "❌ এই মোবাইল নম্বর দিয়ে কোনো Account পাওয়া যায়নি।"
                    );

                    return;

                }


                if (
                    error.code ===
                    "auth/too-many-requests"
                ) {

                    showMessage(
                        "❌ অনেকবার ভুল Login চেষ্টা হয়েছে। কিছুক্ষণ পরে আবার চেষ্টা করুন।"
                    );

                    return;

                }


                if (
                    error.code ===
                    "auth/network-request-failed"
                ) {

                    showMessage(
                        "❌ Internet Connection পাওয়া যাচ্ছে না।"
                    );

                    return;

                }


                if (
                    error.code ===
                    "auth/operation-not-allowed"
                ) {

                    showMessage(
                        "❌ Firebase Email/Password Authentication চালু করা নেই।"
                    );

                    return;

                }


                showMessage(
                    "❌ Login করতে সমস্যা হয়েছে। আবার চেষ্টা করুন।"
                );

            }

        }
    );

}


// ======================================================
// AUTO LOGIN
// ======================================================

window.addEventListener(
    "load",
    () => {

        const localLogin =
            localStorage.getItem(
                "employerLogin"
            );

        const sessionLogin =
            sessionStorage.getItem(
                "employerLogin"
            );


        if (
            localLogin ||
            sessionLogin
        ) {

            window.location.href =
                "dashboard.html";

        }

    }
);


// ======================================================
// ONLINE / OFFLINE
// ======================================================

window.addEventListener(
    "offline",
    () => {

        showMessage(
            "❌ Internet Connection বিচ্ছিন্ন হয়েছে।"
        );

    }
);


window.addEventListener(
    "online",
    () => {

        showMessage(
            "✅ Internet Connection পুনরায় চালু হয়েছে।",
            "green"
        );

    }
);


// ======================================================
// SK JOB BD
// COMPANY LOGIN SYSTEM
// ======================================================
