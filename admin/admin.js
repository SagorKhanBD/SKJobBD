// ======================================================
// SK Job BD
// Super Admin Panel
// admin.js (Part 1)
// ======================================================

import { db } from "../firebase.js";

import {

    collection,

    getDocs,

    query,

    where,

    updateDoc,

    doc

} from "https://www.gstatic.com/firebasejs/10.13.2/firebase-firestore.js";


// ======================================
// Dashboard Elements
// ======================================

const totalUsers =
document.getElementById("totalUsers");

const totalCompanies =
document.getElementById("totalCompanies");

const pendingJobs =
document.getElementById("pendingJobs");

const approvedJobs =
document.getElementById("approvedJobs");

const pendingJobList =
document.getElementById("pendingJobList");


// ======================================
// Load Dashboard
// ======================================

async function loadDashboard(){

    // Continue Part 2...    // ======================================
    // Total Users
    // ======================================

    const usersSnap =
    await getDocs(collection(db,"users"));

    totalUsers.textContent =
    usersSnap.size;

    // ======================================
    // Total Companies
    // ======================================

    const companySnap =
    await getDocs(collection(db,"employers"));

    totalCompanies.textContent =
    companySnap.size;

    // ======================================
    // Pending Jobs
    // ======================================

    const pendingQuery =
    query(

        collection(db,"jobs"),

        where("status","==","pending")

    );

    const pendingSnap =
    await getDocs(pendingQuery);

    pendingJobs.textContent =
    pendingSnap.size;

    // ======================================
    // Approved Jobs
    // ======================================

    const approvedQuery =
    query(

        collection(db,"jobs"),

        where("status","==","approved")

    );

    const approvedSnap =
    await getDocs(approvedQuery);

    approvedJobs.textContent =
    approvedSnap.size;

    // ======================================
    // Pending Job List
    // ======================================

    pendingJobList.innerHTML="";

    // Continue Part 3...    // ======================================
    // Show Pending Jobs
    // ======================================

    pendingSnap.forEach((jobDoc)=>{

        const job = jobDoc.data();

        pendingJobList.innerHTML += `

        <div class="jobCard">

            <h3>${job.jobTitle}</h3>

            <p><strong>প্রতিষ্ঠান:</strong> ${job.companyName}</p>

            <p><strong>বিভাগ:</strong> ${job.jobCategory}</p>

            <p><strong>কর্মস্থল:</strong> ${job.jobLocation}</p>

            <p><strong>শেষ তারিখ:</strong> ${job.deadline}</p>

            <div class="jobButtons">

                <button
                    onclick="approveJob('${jobDoc.id}')"
                >
                    ✅ Approve
                </button>

                <button
                    onclick="rejectJob('${jobDoc.id}')"
                >
                    ❌ Reject
                </button>

            </div>

        </div>

        `;

    });

}

// ======================================
// Load Dashboard
// ======================================

loadDashboard();

// Continue Part 4...// ======================================================
// Approve Job
// ======================================================

window.approveJob = async function(jobId){

    try{

        await updateDoc(

            doc(db,"jobs",jobId),

            {

                status:"approved"

            }

        );

        alert("✅ Job Approved Successfully.");

        loadDashboard();

    }

    catch(error){

        console.error(error);

        alert("❌ Approve Failed.");

    }

};

// ======================================================
// Reject Job
// ======================================================

window.rejectJob = async function(jobId){

    try{

        await updateDoc(

            doc(db,"jobs",jobId),

            {

                status:"rejected"

            }

        );

        alert("❌ Job Rejected.");

        loadDashboard();

    }

    catch(error){

        console.error(error);

        alert("Reject Failed.");

    }

};

// ======================================================
// Logout
// ======================================================

const logoutBtn =
document.getElementById("logoutBtn");

if(logoutBtn){

    logoutBtn.addEventListener("click",()=>{

        if(confirm("আপনি কি Logout করতে চান?")){

            localStorage.removeItem("adminLogin");

            sessionStorage.removeItem("adminLogin");

            window.location.href="../index.html";

        }

    });

}

// ======================================================
// End of File
// SK Job BD Admin Panel
// ======================================================
