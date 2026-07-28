/*
================================================
SK Job BD
Company Registration System
register.js
Part 1
================================================
*/


import { db } from "../firebase.js";


import {

    collection,

    addDoc,

    serverTimestamp

}

from
"https://www.gstatic.com/firebasejs/10.13.2/firebase-firestore.js";



// ==============================================
// Register Form
// ==============================================

const registerForm =
document.getElementById("registerForm");


const message =
document.getElementById("message");




// ==============================================
// Submit Event
// ==============================================


registerForm.addEventListener(

"submit",

async function(e){


e.preventDefault();



message.style.color = "red";

message.innerHTML = "";



// ==============================================
// Get Values
// ==============================================


const companyName =

document.getElementById("companyName")
.value
.trim();



const institutionCode =

document.getElementById("institutionCode")
.value
.trim();



const ownerName =

document.getElementById("ownerName")
.value
.trim();



const mobile =

document.getElementById("mobile")
.value
.trim();



const email =

document.getElementById("email")
.value
.trim();



const password =

document.getElementById("password")
.value;



const confirmPassword =

document.getElementById("confirmPassword")
.value;



// ==============================================
// Validation
// ==============================================


if(

companyName === "" ||

ownerName === "" ||

mobile === "" ||

password === "" ||

confirmPassword === ""

){


message.innerHTML =

"❌ সকল বাধ্যতামূলক তথ্য পূরণ করুন।";


return;


}



// Mobile Check

const mobilePattern =
/^01[3-9]\d{8}$/;



if(!mobilePattern.test(mobile)){


message.innerHTML =

"❌ সঠিক মোবাইল নম্বর লিখুন।";


return;


}



// Password Check

if(password.length < 8){


message.innerHTML =

"❌ Password কমপক্ষে ৮ অক্ষরের হতে হবে।";


return;


}



// Confirm Password

if(password !== confirmPassword){


message.innerHTML =

"❌ Password মিলছে না।";


return;


}

    // ==============================================
// Save Company Data to Firestore
// ==============================================

try{


const companyData = {


    companyName: companyName,

    institutionCode: institutionCode,

    ownerName: ownerName,

    mobile: mobile,

    email: email || "",

    accountType: "company",

    status: "pending",

    createdAt: serverTimestamp()


};



// Save Data

await addDoc(

    collection(db,"companies"),

    companyData

);



// ==============================================
// Success Message
// ==============================================


message.style.color = "green";


message.innerHTML =

"✅ কোম্পানি একাউন্ট সফলভাবে তৈরি হয়েছে। Admin Approval-এর পরে সুবিধা চালু হবে।";



// Reset Form

registerForm.reset();



// Redirect Login

setTimeout(()=>{


window.location.href =
"login.html";


},3000);



}


// ==============================================
// Error Handling
// ==============================================


catch(error){


console.error(

"Company Registration Error:",

error

);



message.style.color = "red";


message.innerHTML =

"❌ Registration Error: "

+ error.message;



}



});

// ==============================================
// Final Security Check
// ==============================================


// Prevent Empty Form Error

if(!registerForm){

    console.error(
        "Register Form Not Found"
    );

}



// ==============================================
// SK Job BD
// Company Registration Complete
// ==============================================


// End of Script
