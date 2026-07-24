import { db } from "./firebase.js";

import {
    collection,
    query,
    where,
    getDocs
} from "https://www.gstatic.com/firebasejs/10.13.2/firebase-firestore.js";

// LocalStorage থেকে মোবাইল নম্বর নিন
const mobile = localStorage.getItem("userMobile");

if (!mobile) {
    window.location.href = "login.html";
}

async function loadUser() {

    try {

        const q = query(
            collection(db, "users"),
            where("mobile", "==", mobile)
        );

        const snapshot = await getDocs(q);

        if (snapshot.empty) {

            alert("User Not Found");

            window.location.href = "login.html";

            return;
        }

        const user = snapshot.docs[0].data();

        document.getElementById("userName").innerText = user.name || "";

        document.getElementById("userMobile").innerText = user.mobile || "";

        document.getElementById("userType").innerText = user.accountType || "";

        document.getElementById("userInstitution").innerText = user.institution || "";

        document.getElementById("userEmail").innerText = user.email || "Not Provided";

        document.getElementById("userStatus").innerText = user.status || "";

    } catch (error) {

        console.error(error);

        alert(error.message);

    }

}

window.logout = function () {

    localStorage.removeItem("userMobile");

    window.location.href = "login.html";

}

loadUser();
