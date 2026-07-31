//======================================
// SK JOB BD
// APPLICATION SYSTEM
// Part 1
//======================================

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.13.2/firebase-app.js";

import {

getFirestore,

collection,

addDoc,

serverTimestamp

}

from "https://www.gstatic.com/firebasejs/10.13.2/firebase-firestore.js";

import { firebaseConfig }

from "./config.js";

//======================================
// FIREBASE
//======================================

const app = initializeApp(firebaseConfig);

const db = getFirestore(app);

//======================================
// FORM
//======================================

const form = document.getElementById("applicationForm");

const today = new Date();

const applicationDate = document.getElementById("applicationDate");

if(applicationDate){

applicationDate.value =

today.toLocaleDateString("en-GB");

}

//======================================
// APPLICATION ID
//======================================

function generateApplicationID(){

const year = today.getFullYear();

const random =

Math.floor(

100000 + Math.random()*900000

);

return `APP-${year}-${random}`;

}

const applicationId =

document.getElementById("applicationId");

if(applicationId){

applicationId.value =

generateApplicationID();

}

//======================================
// TRACKING ID
//======================================

function generateTrackingID(){

return

"TRK"+

Date.now();

}

const tracking =

document.getElementById("applicationTrackingId");

if(tracking){

tracking.value =

generateTrackingID();

}

//======================================
// PHOTO PREVIEW
//======================================

const photoUpload =

document.getElementById("photoUpload");

const preview =

document.getElementById("applicantPreview");

if(photoUpload){

photoUpload.addEventListener(

"change",

function(e){

const file =

e.target.files[0];

if(file){

preview.src =

URL.createObjectURL(file);

}

});

}

//======================================
// PRESENT ADDRESS
// SAME AS PERMANENT
//======================================

const sameAddress =

document.getElementById("sameAddress");

if(sameAddress){

sameAddress.addEventListener(

"change",

function(){

if(this.checked){

document.getElementById("permanentCare").value

=

document.getElementById("presentCare").value;

document.getElementById("permanentVillage").value

=

document.getElementById("presentVillage").value;

document.getElementById("permanentPostOffice").value

=

document.getElementById("presentPostOffice").value;

document.getElementById("permanentPostCode").value

=

document.getElementById("presentPostCode").value;

document.getElementById("permanentUpazila").value

=

document.getElementById("presentUpazila").value;

document.getElementById("permanentDistrict").value

=

document.getElementById("presentDistrict").value;

}

});

}

//======================================
// FORM VALIDATION
// Part 2
//======================================

// মোবাইল নম্বর যাচাই
function validMobile(number){

const regex = /^01[3-9]\d{8}$/;

return regex.test(number);

}

// NID যাচাই
function validNID(nid){

if(nid==="") return true;

const regex = /^[0-9]{10,17}$/;

return regex.test(nid);

}

// বয়স গণনা
function calculateAge(dob){

const birth = new Date(dob);

const today = new Date();

let age = today.getFullYear() - birth.getFullYear();

const m = today.getMonth() - birth.getMonth();

if(m<0 || (m===0 && today.getDate()<birth.getDate())){

age--;

}

return age;

}

//======================================
// DOB Change
//======================================

const dob = document.getElementById("dob");

if(dob){

dob.addEventListener("change",()=>{

const age = calculateAge(dob.value);

console.log("Applicant Age :",age);

});

}

//======================================
// REQUIRED FIELD CHECK
//======================================

function validateForm(){

const applicantName =
document.getElementById("applicantName").value.trim();

const fatherName =
document.getElementById("fatherName").value.trim();

const motherName =
document.getElementById("motherName").value.trim();

const mobile =
document.getElementById("mobile").value.trim();

const gender =
document.getElementById("gender").value;

if(applicantName===""){

alert("Applicant Name লিখুন");

return false;

}

if(fatherName===""){

alert("Father's Name লিখুন");

return false;

}

if(motherName===""){

alert("Mother's Name লিখুন");

return false;

}

if(gender===""){

alert("Gender নির্বাচন করুন");

return false;

}

if(!validMobile(mobile)){

alert("সঠিক মোবাইল নম্বর লিখুন");

return false;

}

const nid =
document.getElementById("nid").value.trim();

if(!validNID(nid)){

alert("সঠিক NID নম্বর লিখুন");

return false;

}

return true;

}

//======================================
// PAYMENT LOGIC
//======================================

function paymentRequired(){

const payment =
document.getElementById("paymentRequired");

if(!payment) return false;

return payment.value==="true";

}

//======================================
// SUBMIT APPLICATION
//======================================

if(form){

form.addEventListener("submit", async (e)=>{

e.preventDefault();

if(!validateForm()){

return;

}

if(paymentRequired()){

if(document.getElementById("paymentStatus").value!=="PAID"){

alert("আবেদন করার আগে Payment সম্পন্ন করুন।");

return;

}

}

const loading=document.getElementById("loadingScreen");

if(loading){

loading.style.display="flex";

}

try{

const applicationData={

applicationId:
document.getElementById("applicationId").value,

trackingId:
document.getElementById("applicationTrackingId").value,

jobId:
document.getElementById("jobId").value,

companyName:
document.getElementById("jobCompany").value,

jobTitle:
document.getElementById("jobTitle").value,

applicantName:
document.getElementById("applicantName").value,

fatherName:
document.getElementById("fatherName").value,

motherName:
document.getElementById("motherName").value,

dob:
document.getElementById("dob").value,

gender:
document.getElementById("gender").value,

religion:
document.getElementById("religion").value,

nationality:
document.getElementById("nationality").value,

mobile:
document.getElementById("mobile").value,

email:
document.getElementById("email").value,

nid:
document.getElementById("nid").value,

birthRegistration:
document.getElementById("birthRegistration").value,

paymentStatus:
document.getElementById("paymentStatus").value,

paymentMethod:
document.getElementById("paymentMethod").value,

transactionId:
document.getElementById("transactionId").value,

status:"Pending",

createdAt:serverTimestamp()

};

await addDoc(

collection(db,"applications"),

applicationData

);

if(loading){

loading.style.display="none";

}

document.getElementById("successApplicationId").innerText=

applicationData.applicationId;

document.getElementById("successTrackingId").innerText=

applicationData.trackingId;

document.getElementById("successMessage").style.display="block";

window.scrollTo({

top:0,

behavior:"smooth"

});

}catch(error){

console.error(error);

if(loading){

loading.style.display="none";

}

document.getElementById("errorText").innerText=

error.message;

document.getElementById("errorMessage").style.display="block";

}

});

}

//======================================
// APPLICATION PREVIEW
// Part 4
//======================================

const previewButton =
document.getElementById("previewButton");

if(previewButton){

previewButton.addEventListener("click",()=>{

const preview =
document.getElementById("previewContent");

preview.innerHTML=`

<h3>Application Preview</h3>

<p><b>Applicant :</b>
${document.getElementById("applicantName").value}</p>

<p><b>Father :</b>
${document.getElementById("fatherName").value}</p>

<p><b>Mother :</b>
${document.getElementById("motherName").value}</p>

<p><b>Mobile :</b>
${document.getElementById("mobile").value}</p>

<p><b>Email :</b>
${document.getElementById("email").value}</p>

<p><b>Job Title :</b>
${document.getElementById("jobTitle").value}</p>

<p><b>Company :</b>
${document.getElementById("jobCompany").value}</p>

<p><b>Application ID :</b>
${document.getElementById("applicationId").value}</p>

`;

document.getElementById("applicationPreviewArea")

.scrollIntoView({

behavior:"smooth"

});

});

}

//======================================
// PRINT
//======================================

const printButton =
document.getElementById("printButton");

if(printButton){

printButton.addEventListener("click",()=>{

window.print();

});

}

//======================================
// DOWNLOAD PDF
//======================================

const downloadButton =
document.getElementById("downloadPdfButton");

if(downloadButton){

downloadButton.addEventListener("click",()=>{

if(typeof generateApplicationPDF==="function"){

generateApplicationPDF();

}else{

alert("PDF Template এখনও সংযুক্ত করা হয়নি।");

}

});

}

//======================================
// PAYMENT BUTTON
//======================================

const paymentButton =
document.getElementById("paymentButton");

if(paymentButton){

paymentButton.addEventListener("click",()=>{

if(document.getElementById("applicationFee").value==="0.00"){

alert("এই চাকরির জন্য কোনো আবেদন ফি নেই।");

document.getElementById("paymentStatus").value="FREE";

return;

}

alert("Payment Gateway পরে সংযুক্ত করা হবে।");

});

}

//======================================
// APPLY.JS
// FINAL PART
//======================================

// QR Verification Placeholder
function loadVerificationInfo(){

const verifyApplicationId =
document.getElementById("verifyApplicationId");

const verifyJobId =
document.getElementById("verifyJobId");

const verifyStatus =
document.getElementById("verifyStatus");

if(verifyApplicationId){

verifyApplicationId.innerText =
document.getElementById("applicationId").value;

}

if(verifyJobId){

verifyJobId.innerText =
document.getElementById("jobId").value;

}

if(verifyStatus){

verifyStatus.innerText =
document.getElementById("paymentStatus").value;

}

}

//======================================
// RESET FORM
//======================================

function resetApplicationForm(){

if(form){

form.reset();

}

if(preview){

preview.src="";

}

}

//======================================
// SUCCESS REDIRECT (Future Use)
//======================================

function redirectAfterSubmit(){

console.log("Application Submitted Successfully");

}

//======================================
// PAYMENT GATEWAY PLACEHOLDER
//======================================

function startPaymentGateway(){

console.log("Future Payment Gateway");

}

//======================================
// INITIAL LOAD
//======================================

window.addEventListener("load",()=>{

loadVerificationInfo();

console.log("SK Job BD Application System Ready");

});
