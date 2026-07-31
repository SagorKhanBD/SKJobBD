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
