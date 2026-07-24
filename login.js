import { db } from "./firebase.js";

import {
    collection,
    query,
    where,
    getDocs
} from "https://www.gstatic.com/firebasejs/10.13.2/firebase-firestore.js";

const form = document.getElementById("loginForm");
const message = document.getElementById("message");

form.addEventListener("submit", async (e) => {

    e.preventDefault();

    message.innerHTML = "";

    const mobile = document.getElementById("mobile").value.trim();
    const password = document.getElementById("password").value;

    if (mobile === "" || password === "") {
        message.innerHTML = "❌ মোবাইল নম্বর এবং Password লিখুন।";
        return;
    }

    try {

        const q = query(
            collection(db, "users"),
            where("mobile", "==", mobile)
        );

        const snapshot = await getDocs(q);

        if (snapshot.empty) {
            message.innerHTML = "❌ এই মোবাইল নম্বরের কোনো অ্যাকাউন্ট নেই।";
            return;
        }

        const user = snapshot.docs[0].data();

        if (user.password !== password) {
            message.innerHTML = "❌ ভুল Password।";
            return;
        }

        if (user.status !== "approved") {
            message.innerHTML = "⏳ আপনার অ্যাকাউন্ট এখনো Admin দ্বারা অনুমোদিত হয়নি।";
            return;
        }

        localStorage.setItem("loginUser", JSON.stringify(user));

        message.innerHTML = "✅ Login Successful...";

        setTimeout(() => {
            window.location.href = "dashboard.html";
        }, 1000);

    } catch (error) {

        console.error(error);

        message.innerHTML = "❌ " + error.message;
    }

});
