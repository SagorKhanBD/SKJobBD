//======================================
// SK JOB BD
// PDF TEMPLATE
// Part 1
//======================================

import { jsPDF } from "https://cdn.jsdelivr.net/npm/jspdf@2.5.1/+esm";

//======================================
// WEBSITE URL
//======================================

const WEBSITE_URL = window.location.origin;

//======================================
// PDF FUNCTION
//======================================

window.generateApplicationPDF = function () {

const doc = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4"
});

//======================================
// PAGE SETTINGS
//======================================

const pageWidth = 210;
const pageHeight = 297;
let y = 15;

//======================================
// HEADER
//======================================

doc.setFont("helvetica", "bold");
doc.setFontSize(18);

doc.text(
document.getElementById("jobCompany")?.value || "Company Name",
105,
y,
{ align: "center" }
);

y += 8;

doc.setFontSize(11);
doc.setFont("helvetica", "normal");

doc.text(
document.getElementById("jobTitle")?.value || "Job Title",
105,
y,
{ align: "center" }
);

y += 10;

doc.line(15, y, 195, y);

y += 10;

//======================================
// PDF HEADER INFORMATION
// Part 2
//======================================

// Application ID

doc.setFont("helvetica","bold");
doc.setFontSize(10);

doc.text(
"Application ID : " +
document.getElementById("applicationId").value,
15,
y
);

doc.text(
"Tracking ID : " +
document.getElementById("applicationTrackingId").value,
110,
y
);

y += 8;

//--------------------------------------
// Applicant Photo
//--------------------------------------

const photo =
document.getElementById("applicantPreview");

if(photo && photo.src){

try{

doc.addImage(
photo.src,
"JPEG",
160,
20,
30,
35
);

}catch(err){

console.log("Photo skipped");

}

}

//--------------------------------------
// PERSONAL INFORMATION
//--------------------------------------

doc.setDrawColor(180);

doc.setFillColor(240,248,255);

doc.rect(15,y,180,10,"FD");

doc.setFontSize(12);

doc.setFont("helvetica","bold");

doc.text(
"PERSONAL INFORMATION",
18,
y+7
);

y += 16;

doc.setFont("helvetica","normal");

doc.setFontSize(10);

const leftX = 18;
const rightX = 110;

doc.text(
"Applicant Name :",
leftX,
y
);

doc.text(
document.getElementById("applicantName").value,
55,
y
);

doc.text(
"Father's Name :",
rightX,
y
);

doc.text(
document.getElementById("fatherName").value,
145,
y
);

y += 8;

doc.text(
"Mother's Name :",
leftX,
y
);

doc.text(
document.getElementById("motherName").value,
55,
y
);

doc.text(
"Date of Birth :",
rightX,
y
);

doc.text(
document.getElementById("dob").value,
145,
y
);

y += 8;

doc.text(
"Gender :",
leftX,
y
);

doc.text(
document.getElementById("gender").value,
55,
y
);

doc.text(
"Religion :",
rightX,
y
);

doc.text(
document.getElementById("religion").value,
145,
y
);

y += 8;

doc.text(
"Nationality :",
leftX,
y
);

doc.text(
document.getElementById("nationality").value,
55,
y
);

doc.text(
"Mobile :",
rightX,
y
);

doc.text(
document.getElementById("mobile").value,
145,
y
);

y += 8;

doc.text(
"E-mail :",
leftX,
y
);

doc.text(
document.getElementById("email").value,
55,
y
);

doc.text(
"NID :",
rightX,
y
);

doc.text(
document.getElementById("nid").value,
145,
y
);

y += 12;

//======================================
// ADDRESS INFORMATION
// Part 3
//======================================

// বর্তমান ঠিকানা
doc.setFillColor(240,248,255);
doc.rect(15,y,180,10,"FD");

doc.setFont("helvetica","bold");
doc.setFontSize(12);

doc.text(
"PRESENT ADDRESS",
18,
y+7
);

y+=16;

doc.setFont("helvetica","normal");
doc.setFontSize(10);

doc.text(
"Care Of :",
18,
y
);

doc.text(
document.getElementById("presentCare").value,
55,
y
);

doc.text(
"Village / Road :",
110,
y
);

doc.text(
document.getElementById("presentVillage").value,
155,
y
);

y+=8;

doc.text(
"Post Office :",
18,
y
);

doc.text(
document.getElementById("presentPostOffice").value,
55,
y
);

doc.text(
"Post Code :",
110,
y
);

doc.text(
document.getElementById("presentPostCode").value,
155,
y
);

y+=8;

doc.text(
"Upazila :",
18,
y
);

doc.text(
document.getElementById("presentUpazila").value,
55,
y
);

doc.text(
"District :",
110,
y
);

doc.text(
document.getElementById("presentDistrict").value,
155,
y
);

y+=15;

//======================================
// PERMANENT ADDRESS
//======================================

doc.setFillColor(240,248,255);

doc.rect(15,y,180,10,"FD");

doc.setFont("helvetica","bold");

doc.setFontSize(12);

doc.text(
"PERMANENT ADDRESS",
18,
y+7
);

y+=16;

doc.setFont("helvetica","normal");

doc.setFontSize(10);

doc.text(
"Care Of :",
18,
y
);

doc.text(
document.getElementById("permanentCare").value,
55,
y
);

doc.text(
"Village / Road :",
110,
y
);

doc.text(
document.getElementById("permanentVillage").value,
155,
y
);

y+=8;

doc.text(
"Post Office :",
18,
y
);

doc.text(
document.getElementById("permanentPostOffice").value,
55,
y
);

doc.text(
"Post Code :",
110,
y
);

doc.text(
document.getElementById("permanentPostCode").value,
155,
y
);

y+=8;

doc.text(
"Upazila :",
18,
y
);

doc.text(
document.getElementById("permanentUpazila").value,
55,
y
);

doc.text(
"District :",
110,
y
);

doc.text(
document.getElementById("permanentDistrict").value,
155,
y
);

y+=15;

//======================================
// EDUCATION HEADER
//======================================

doc.setFillColor(240,248,255);

doc.rect(15,y,180,10,"FD");

doc.setFont("helvetica","bold");

doc.setFontSize(12);

doc.text(
"EDUCATIONAL QUALIFICATION",
18,
y+7
);

y+=16;

//======================================
// EDUCATION TABLE
// Part 4
//======================================

doc.setFont("helvetica","bold");
doc.setFontSize(9);

doc.rect(15,y,180,8);

doc.text("Exam",18,y+5);
doc.text("Board / University",45,y+5);
doc.text("Result",100,y+5);
doc.text("Group",130,y+5);
doc.text("Year",170,y+5);

y+=8;

doc.setFont("helvetica","normal");

const educationRows = [

[
document.getElementById("sscBoard")?.value || "",
document.getElementById("sscInstitute")?.value || "",
document.getElementById("sscResult")?.value || "",
document.getElementById("sscGroup")?.value || "",
document.getElementById("sscYear")?.value || ""
],

[
document.getElementById("hscBoard")?.value || "",
document.getElementById("hscInstitute")?.value || "",
document.getElementById("hscResult")?.value || "",
document.getElementById("hscGroup")?.value || "",
document.getElementById("hscYear")?.value || ""
],

[
document.getElementById("honoursBoard")?.value || "",
document.getElementById("honoursInstitute")?.value || "",
document.getElementById("honoursResult")?.value || "",
document.getElementById("honoursSubject")?.value || "",
document.getElementById("honoursYear")?.value || ""
],

[
document.getElementById("mastersBoard")?.value || "",
document.getElementById("mastersInstitute")?.value || "",
document.getElementById("mastersResult")?.value || "",
document.getElementById("mastersSubject")?.value || "",
document.getElementById("mastersYear")?.value || ""
]

];

const examNames = [

"SSC",

"HSC",

"Honours",

"Masters"

];

educationRows.forEach((row,index)=>{

doc.rect(15,y,180,8);

doc.text(examNames[index],18,y+5);

doc.text(row[0],45,y+5);

doc.text(row[2],100,y+5);

doc.text(row[3],130,y+5);

doc.text(row[4],170,y+5);

y+=8;

});

//======================================
// EXPERIENCE
//======================================

y+=5;

doc.setFillColor(240,248,255);

doc.rect(15,y,180,10,"FD");

doc.setFont("helvetica","bold");

doc.setFontSize(12);

doc.text(

"EXPERIENCE / TRAINING",

18,

y+7

);

y+=16;

doc.setFont("helvetica","normal");

doc.setFontSize(10);

doc.text(

document.getElementById("experience")?.value || "N/A",

18,

y

);

y+=15;

//======================================
// DECLARATION
// Part 5
//======================================

doc.setFillColor(240,248,255);

doc.rect(15,y,180,10,"FD");

doc.setFont("helvetica","bold");

doc.setFontSize(12);

doc.text("DECLARATION",18,y+7);

y += 16;

doc.setFont("helvetica","normal");

doc.setFontSize(10);

doc.text(
"I hereby declare that all the information provided in this application is true and complete to the best of my knowledge.",
18,
y,
{ maxWidth:175 }
);

y += 20;

//======================================
// SIGNATURE
//======================================

doc.line(20,y,80,y);

doc.line(130,y,190,y);

doc.setFont("helvetica","bold");

doc.text("Applicant Signature",30,y+5);

doc.text("Authority Signature",140,y+5);

y += 18;

//======================================
// PAYMENT INFORMATION
//======================================

doc.setFont("helvetica","normal");

doc.text(
"Payment Status : " +
(document.getElementById("paymentStatus")?.value || "FREE"),
18,
y
);

doc.text(
"Transaction ID : " +
(document.getElementById("transactionId")?.value || "N/A"),
105,
y
);

y += 12;

//======================================
// QR PLACEHOLDER
//======================================

doc.rect(160,y,30,30);

doc.setFontSize(8);

doc.text(
"QR Verification",
165,
y+35
);

//======================================
// FOOTER
//======================================

doc.setDrawColor(180);

doc.line(15,280,195,280);

doc.setFontSize(9);

doc.setFont("helvetica","normal");

doc.text(
"Powered By S.K Job BD",
105,
285,
{ align:"center" }
);

doc.text(
WEBSITE_URL,
105,
290,
{ align:"center" }
);

//======================================
// SAVE PDF
// Part 6 (Final)
//======================================

//--------------------------------------
// File Name
//--------------------------------------

const applicant =
document.getElementById("applicantName")?.value || "Applicant";

const application =
document.getElementById("applicationId")?.value || "Application";

const fileName =
`${application}_${applicant}.pdf`;

//--------------------------------------
// SAVE
//--------------------------------------

doc.save(fileName);

};

//======================================
// AUTO INITIALIZE
//======================================

window.addEventListener("load",()=>{

console.log("================================");

console.log("SK JOB BD PDF TEMPLATE READY");

console.log("Website :",WEBSITE_URL);

console.log("================================");

});
