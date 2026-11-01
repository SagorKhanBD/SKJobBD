
// ============================================================
// SK Job BD
// Result Subject Template System
// File: results/result-template.js
// Firebase: Cloud Firestore
// ============================================================

import { db } from "../firebase.js";

import {
    doc,
    getDoc,
    setDoc
} from "https://www.gstatic.com/firebasejs/10.13.2/firebase-firestore.js";


// ============================================================
// DOM ELEMENTS
// ============================================================

const institutionNameInput = document.getElementById("institutionName");
const classNameSelect = document.getElementById("className");
const examNameInput = document.getElementById("examName");
const academicYearInput = document.getElementById("academicYear");

const subjectTableBody = document.getElementById("subjectTableBody");
const addSubjectBtn = document.getElementById("addSubjectBtn");
const saveTemplateBtn = document.getElementById("saveTemplateBtn");

const messageBox = document.getElementById("message");
const existingTemplateCard = document.getElementById("existingTemplateCard");
const loadExistingBtn = document.getElementById("loadExistingBtn");


// ============================================================
// GLOBAL VARIABLES
// ============================================================

let subjects = [];
let existingTemplate = null;
let templateCheckNumber = 0;


// ============================================================
// ALLOWED CLASSES
// ============================================================

const allowedClasses = {
    nursery: "Nursery",
    play: "Play",
    kg: "KG",
    "class-1": "১ম শ্রেণি",
    "class-2": "২য় শ্রেণি",
    "class-3": "৩য় শ্রেণি",
    "class-4": "৪র্থ শ্রেণি",
    "class-5": "৫ম শ্রেণি",
    "class-6": "৬ষ্ঠ শ্রেণি",
    "class-7": "৭ম শ্রেণি",
    "class-8": "৮ম শ্রেণি",
    "class-9": "৯ম শ্রেণি",
    "class-10": "১০ম শ্রেণি"
};


// ============================================================
// MESSAGE FUNCTIONS
// ============================================================

function showMessage(text, type = "success") {
    if (!messageBox) return;

    messageBox.textContent = text;
    messageBox.className = "message " + type;
}

function clearMessage() {
    if (!messageBox) return;

    messageBox.textContent = "";
    messageBox.className = "message";
}


// ============================================================
// CREATE SUBJECT
// ============================================================

function createSubject(code = "", name = "", fullMark = "") {
    return {
        id:
            Date.now().toString() +
            Math.random().toString(36).substring(2, 9),

        code,
        name,
        fullMark
    };
}


// ============================================================
// ADD SUBJECT
// ============================================================

function addSubject(code = "", name = "", fullMark = "") {
    subjects.push(
        createSubject(code, name, fullMark)
    );

    renderSubjects();
}


// ============================================================
// RENDER SUBJECTS
// ============================================================

function renderSubjects() {
    if (!subjectTableBody) return;

    subjectTableBody.innerHTML = "";

    subjects.forEach((subject, index) => {
        const row = document.createElement("tr");

        // Serial
        const serialCell = document.createElement("td");
        serialCell.textContent = index + 1;

        // Subject Code
        const codeCell = document.createElement("td");
        const codeInput = document.createElement("input");

        codeInput.type = "text";
        codeInput.placeholder = "যেমন: BAN";
        codeInput.value = subject.code;
        codeInput.className = "subjectInput";

        codeInput.addEventListener("input", () => {
            subject.code = codeInput.value.trim();
        });

        codeCell.appendChild(codeInput);

        // Subject Name
        const nameCell = document.createElement("td");
        const nameInput = document.createElement("input");

        nameInput.type = "text";
        nameInput.placeholder = "যেমন: বাংলা";
        nameInput.value = subject.name;
        nameInput.className = "subjectInput";

        nameInput.addEventListener("input", () => {
            subject.name = nameInput.value.trim();
        });

        nameCell.appendChild(nameInput);

        // Full Mark
        const markCell = document.createElement("td");
        const markInput = document.createElement("input");

        markInput.type = "number";
        markInput.min = "1";
        markInput.max = "1000";
        markInput.step = "0.01";
        markInput.placeholder = "100";
        markInput.value = subject.fullMark;
        markInput.className = "subjectInput";

        markInput.addEventListener("input", () => {
            subject.fullMark = markInput.value;
        });

        markCell.appendChild(markInput);

        // Delete Button
        const actionCell = document.createElement("td");
        const deleteButton = document.createElement("button");

        deleteButton.type = "button";
        deleteButton.textContent = "মুছে ফেলুন";
        deleteButton.className = "deleteButton";

        deleteButton.addEventListener("click", () => {
            subjects = subjects.filter(
                item => item.id !== subject.id
            );

            renderSubjects();
        });

        actionCell.appendChild(deleteButton);

        row.appendChild(serialCell);
        row.appendChild(codeCell);
        row.appendChild(nameCell);
        row.appendChild(markCell);
        row.appendChild(actionCell);

        subjectTableBody.appendChild(row);
    });
}


// ============================================================
// NORMALIZE TEXT
// ============================================================

function normalizeText(value) {
    return String(value ?? "")
        .trim()
        .toLowerCase()
        .replace(/\s+/g, "_");
}


// ============================================================
// GET TEMPLATE KEY
// ============================================================

function getTemplateKey() {
    const institution = normalizeText(
        institutionNameInput?.value
    );

    const className = classNameSelect?.value?.trim();

    const exam = normalizeText(
        examNameInput?.value
    );

    const year = academicYearInput?.value?.trim();

    if (!institution || !className || !exam || !year) {
        return null;
    }

    // Firebase Firestore document ID
    return [
        encodeURIComponent(institution),
        encodeURIComponent(className),
        encodeURIComponent(exam),
        encodeURIComponent(year)
    ].join("_");
}


// ============================================================
// GET TEMPLATE REFERENCE
// ============================================================

function getTemplateReference() {
    const key = getTemplateKey();

    if (!key) return null;

    return doc(db, "resultTemplates", key);
}


// ============================================================
// CHECK EXISTING TEMPLATE
// ============================================================

async function checkExistingTemplate() {
    clearMessage();

    existingTemplate = null;

    const requestNumber = ++templateCheckNumber;

    if (existingTemplateCard) {
        existingTemplateCard.hidden = true;
    }

    const templateRef = getTemplateReference();

    if (!templateRef) return;

    try {
        const snapshot = await getDoc(templateRef);

        // Ignore outdated requests
        if (requestNumber !== templateCheckNumber) return;

        if (snapshot.exists()) {
            existingTemplate = {
                id: snapshot.id,
                ...snapshot.data()
            };

            if (existingTemplateCard) {
                existingTemplateCard.hidden = false;
            }

            showMessage(
                "এই তথ্যের জন্য আগে একটি Subject Template সংরক্ষণ করা আছে। চাইলে সেটি লোড করতে পারেন।",
                "success"
            );
        }
    } catch (error) {
        console.error("Template check error:", error);

        if (requestNumber === templateCheckNumber) {
            showMessage(
                "আগের Template পরীক্ষা করা যায়নি। Firebase সংযোগ পরীক্ষা করুন।",
                "error"
            );
        }
    }
}


// ============================================================
// LOAD EXISTING TEMPLATE
// ============================================================

function loadExistingTemplate() {
    if (
        !existingTemplate ||
        !Array.isArray(existingTemplate.subjects)
    ) {
        showMessage(
            "কোনো সংরক্ষিত বিষয় পাওয়া যায়নি।",
            "error"
        );

        return;
    }

    subjects = existingTemplate.subjects.map(subject => {
        return createSubject(
            subject.code ?? subject.subjectCode ?? "",
            subject.name ?? subject.subjectName ?? "",
            subject.fullMark ?? subject.fullMarks ?? ""
        );
    });

    renderSubjects();

    showMessage(
        "সংরক্ষিত বিষয়গুলো সফলভাবে লোড হয়েছে। প্রয়োজন হলে পরিবর্তন করে আবার সংরক্ষণ করুন।",
        "success"
    );
}


// ============================================================
// VALIDATE BASIC INFORMATION
// ============================================================

function validateBasicInformation() {
    const institution = institutionNameInput?.value.trim();
    const className = classNameSelect?.value;
    const exam = examNameInput?.value.trim();
    const year = academicYearInput?.value.trim();

    if (!institution) {
        showMessage("প্রতিষ্ঠানের নাম লিখুন।", "error");
        institutionNameInput?.focus();
        return false;
    }

    if (!className) {
        showMessage("শ্রেণি নির্বাচন করুন।", "error");
        classNameSelect?.focus();
        return false;
    }

    if (!allowedClasses[className]) {
        showMessage("এই শ্রেণি অনুমোদিত নয়।", "error");
        classNameSelect?.focus();
        return false;
    }

    if (!exam) {
        showMessage("পরীক্ষার নাম লিখুন।", "error");
        examNameInput?.focus();
        return false;
    }

    const yearNumber = Number(year);

    if (
        !year ||
        !Number.isInteger(yearNumber) ||
        yearNumber < 2000 ||
        yearNumber > 2100
    ) {
        showMessage("সঠিক শিক্ষাবর্ষ লিখুন।", "error");
        academicYearInput?.focus();
        return false;
    }

    return true;
}


// ============================================================
// VALIDATE SUBJECTS
// ============================================================

function validateSubjects() {
    if (subjects.length === 0) {
        showMessage("কমপক্ষে একটি বিষয় যোগ করুন।", "error");
        return false;
    }

    for (let i = 0; i < subjects.length; i++) {
        const subject = subjects[i];

        if (!subject.code.trim()) {
            showMessage(
                `বিষয় ${i + 1}-এর Subject Code লিখুন।`,
                "error"
            );

            return false;
        }

        if (!subject.name.trim()) {
            showMessage(
                `বিষয় ${i + 1}-এর Subject Name লিখুন।`,
                "error"
            );

            return false;
        }

        const mark = Number(subject.fullMark);

        if (
            !Number.isFinite(mark) ||
            mark <= 0 ||
            mark > 1000
        ) {
            showMessage(
                `বিষয় ${i + 1}-এর Full Mark ১ থেকে ১০০০-এর মধ্যে দিন।`,
                "error"
            );

            return false;
        }
    }

    return true;
}


// ============================================================
// CHECK DUPLICATE SUBJECT CODE
// ============================================================

function hasDuplicateSubjectCode() {
    const codes = subjects.map(subject =>
        subject.code.trim().toLowerCase()
    );

    return new Set(codes).size !== codes.length;
}


// ============================================================
// SAVE TEMPLATE TO FIRESTORE
// ============================================================

async function saveTemplate() {
    clearMessage();

    if (!validateBasicInformation()) return;

    if (!validateSubjects()) return;

    if (hasDuplicateSubjectCode()) {
        showMessage(
            "একই Subject Code একাধিকবার ব্যবহার করা যাবে না।",
            "error"
        );

        return;
    }

    const templateRef = getTemplateReference();

    if (!templateRef) {
        showMessage("Template Key তৈরি করা যায়নি।", "error");
        return;
    }

    const templateData = {
        institutionName: institutionNameInput.value.trim(),

        className: classNameSelect.value,

        classLabel: allowedClasses[classNameSelect.value],

        examName: examNameInput.value.trim(),

        academicYear: Number(academicYearInput.value),

        subjects: subjects.map((subject, index) => ({
            serial: index + 1,
            code: subject.code.trim(),
            name: subject.name.trim(),
            fullMark: Number(subject.fullMark)
        })),

        updatedAt: new Date().toISOString()
    };

    const originalButtonText = saveTemplateBtn
        ? saveTemplateBtn.textContent
        : "";

    try {
        if (saveTemplateBtn) {
            saveTemplateBtn.disabled = true;
            saveTemplateBtn.textContent = "সংরক্ষণ হচ্ছে...";
        }

        // Same institution + class + exam + year
        // will update the same Firestore document.
        await setDoc(templateRef, templateData);

        existingTemplate = {
            id: templateRef.id,
            ...templateData
        };

        if (existingTemplateCard) {
            existingTemplateCard.hidden = false;
        }

        showMessage(
            "Subject Template সফলভাবে Firestore-এ সংরক্ষণ হয়েছে। এখন Result Entry পেজে বিষয়গুলো লোড করতে পারবেন।",
            "success"
        );
    } catch (error) {
        console.error("Save template error:", error);

        showMessage(
            "Subject Template সংরক্ষণ করা যায়নি। Firebase Firestore সংযোগ ও Rules পরীক্ষা করুন।",
            "error"
        );
    } finally {
        if (saveTemplateBtn) {
            saveTemplateBtn.disabled = false;
            saveTemplateBtn.textContent =
                originalButtonText || "Save Subject Template";
        }
    }
}


// ============================================================
// INPUT CHANGE EVENTS
// ============================================================

institutionNameInput?.addEventListener(
    "change",
    checkExistingTemplate
);

classNameSelect?.addEventListener(
    "change",
    checkExistingTemplate
);

examNameInput?.addEventListener(
    "change",
    checkExistingTemplate
);

academicYearInput?.addEventListener(
    "change",
    checkExistingTemplate
);


// ============================================================
// ADD SUBJECT BUTTON
// ============================================================

addSubjectBtn?.addEventListener("click", () => {
    addSubject();
});


// ============================================================
// SAVE TEMPLATE BUTTON
// ============================================================

saveTemplateBtn?.addEventListener("click", saveTemplate);


// ============================================================
// LOAD EXISTING TEMPLATE BUTTON
// ============================================================

loadExistingBtn?.addEventListener(
    "click",
    loadExistingTemplate
);


// ============================================================
// INITIAL SUBJECT ROW
// ============================================================

if (subjectTableBody) {
    addSubject();
}


// ============================================================
// INITIAL CONSOLE
// ============================================================

console.log(
    "SK Job BD Result Subject Template System Loaded - Firestore"
);
