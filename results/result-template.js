// ============================================================
// SK Job BD
// Result Subject Template System
// File: results/result-template.js
// ============================================================

import {
    getDatabase,
    ref,
    get,
    set
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-database.js";

import { firebaseConfig } from "../config.js";
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";


// ============================================================
// Firebase
// ============================================================

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);


// ============================================================
// DOM Elements
// ============================================================

const institutionNameInput =
    document.getElementById("institutionName");

const classNameSelect =
    document.getElementById("className");

const examNameInput =
    document.getElementById("examName");

const academicYearInput =
    document.getElementById("academicYear");

const subjectTableBody =
    document.getElementById("subjectTableBody");

const addSubjectBtn =
    document.getElementById("addSubjectBtn");

const saveTemplateBtn =
    document.getElementById("saveTemplateBtn");

const messageBox =
    document.getElementById("message");

const existingTemplateCard =
    document.getElementById("existingTemplateCard");

const loadExistingBtn =
    document.getElementById("loadExistingBtn");


// ============================================================
// Variables
// ============================================================

let subjects = [];

let existingTemplate = null;


// ============================================================
// Allowed Classes
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
// Show Message
// ============================================================

function showMessage(text, type = "success") {

    if (!messageBox) return;

    messageBox.textContent = text;

    messageBox.className = "message";

    messageBox.classList.add(type);

}


// ============================================================
// Clear Message
// ============================================================

function clearMessage() {

    if (!messageBox) return;

    messageBox.textContent = "";

    messageBox.className = "message";

}


// ============================================================
// Create Subject
// ============================================================

function createSubject(
    code = "",
    name = "",
    fullMark = ""
) {

    return {

        id:
            Date.now().toString() +
            Math.random().toString(36).substring(2, 8),

        code: code,

        name: name,

        fullMark: fullMark

    };

}


// ============================================================
// Add Subject Row
// ============================================================

function addSubject(
    code = "",
    name = "",
    fullMark = ""
) {

    subjects.push(
        createSubject(
            code,
            name,
            fullMark
        )
    );

    renderSubjects();

}


// ============================================================
// Render Subjects
// ============================================================

function renderSubjects() {

    if (!subjectTableBody) return;

    subjectTableBody.innerHTML = "";

    subjects.forEach(
        (subject, index) => {

            const row =
                document.createElement("tr");


            // ----------------------------------------
            // Serial
            // ----------------------------------------

            const serialCell =
                document.createElement("td");

            serialCell.textContent =
                index + 1;


            // ----------------------------------------
            // Code
            // ----------------------------------------

            const codeCell =
                document.createElement("td");

            const codeInput =
                document.createElement("input");

            codeInput.type = "text";

            codeInput.placeholder =
                "যেমন: BAN";

            codeInput.value =
                subject.code;

            codeInput.className =
                "subjectInput";

            codeInput.addEventListener(
                "input",
                function () {

                    subject.code =
                        this.value.trim();

                }
            );

            codeCell.appendChild(
                codeInput
            );


            // ----------------------------------------
            // Subject Name
            // ----------------------------------------

            const nameCell =
                document.createElement("td");

            const nameInput =
                document.createElement("input");

            nameInput.type = "text";

            nameInput.placeholder =
                "যেমন: বাংলা";

            nameInput.value =
                subject.name;

            nameInput.className =
                "subjectInput";

            nameInput.addEventListener(
                "input",
                function () {

                    subject.name =
                        this.value.trim();

                }
            );

            nameCell.appendChild(
                nameInput
            );


            // ----------------------------------------
            // Full Mark
            // ----------------------------------------

            const markCell =
                document.createElement("td");

            const markInput =
                document.createElement("input");

            markInput.type =
                "number";

            markInput.min =
                "1";

            markInput.max =
                "1000";

            markInput.placeholder =
                "100";

            markInput.value =
                subject.fullMark;

            markInput.className =
                "subjectInput";

            markInput.addEventListener(
                "input",
                function () {

                    subject.fullMark =
                        this.value;

                }
            );

            markCell.appendChild(
                markInput
            );


            // ----------------------------------------
            // Action
            // ----------------------------------------

            const actionCell =
                document.createElement("td");

            const deleteButton =
                document.createElement("button");

            deleteButton.type =
                "button";

            deleteButton.textContent =
                "মুছে ফেলুন";

            deleteButton.className =
                "deleteButton";

            deleteButton.addEventListener(
                "click",
                function () {

                    subjects =
                        subjects.filter(
                            item =>
                                item.id !==
                                subject.id
                        );

                    renderSubjects();

                }
            );

            actionCell.appendChild(
                deleteButton
            );


            // ----------------------------------------
            // Row
            // ----------------------------------------

            row.appendChild(
                serialCell
            );

            row.appendChild(
                codeCell
            );

            row.appendChild(
                nameCell
            );

            row.appendChild(
                markCell
            );

            row.appendChild(
                actionCell
            );


            subjectTableBody.appendChild(
                row
            );

        }
    );

}


// ============================================================
// Get Template Key
// ============================================================

function getTemplateKey() {

    const institution =
        institutionNameInput?.value
            .trim()
            .toLowerCase()
            .replace(/\s+/g, "_");

    const className =
        classNameSelect?.value;

    const exam =
        examNameInput?.value
            .trim()
            .toLowerCase()
            .replace(/\s+/g, "_");

    const year =
        academicYearInput?.value;


    if (
        !institution ||
        !className ||
        !exam ||
        !year
    ) {

        return null;

    }


    return (
        institution +
        "_" +
        className +
        "_" +
        exam +
        "_" +
        year
    );

}


// ============================================================
// Check Existing Template
// ============================================================

async function checkExistingTemplate() {

    clearMessage();

    existingTemplate = null;

    if (existingTemplateCard) {

        existingTemplateCard.hidden =
            true;

    }


    const key =
        getTemplateKey();


    if (!key) {

        return;

    }


    try {

        const templateRef =
            ref(
                db,
                "resultTemplates/" +
                key
            );


        const snapshot =
            await get(
                templateRef
            );


        if (
            snapshot.exists()
        ) {

            existingTemplate =
                snapshot.val();


            if (existingTemplateCard) {

                existingTemplateCard.hidden =
                    false;

            }

        }

    }
    catch (error) {

        console.error(
            "Template check error:",
            error
        );

    }

}


// ============================================================
// Load Existing Template
// ============================================================

function loadExistingTemplate() {

    if (
        !existingTemplate ||
        !Array.isArray(
            existingTemplate.subjects
        )
    ) {

        showMessage(
            "কোনো সংরক্ষিত বিষয় পাওয়া যায়নি।",
            "error"
        );

        return;

    }


    subjects =
        existingTemplate.subjects.map(
            subject => {

                return {

                    id:
                        Date.now().toString() +
                        Math.random()
                            .toString(36)
                            .substring(2, 8),

                    code:
                        subject.code || "",

                    name:
                        subject.name || "",

                    fullMark:
                        subject.fullMark || ""

                };

            }
        );


    renderSubjects();


    showMessage(
        "সংরক্ষিত বিষয়গুলো সফলভাবে লোড হয়েছে।",
        "success"
    );

}


// ============================================================
// Validate Basic Information
// ============================================================

function validateBasicInformation() {

    const institution =
        institutionNameInput?.value
            .trim();

    const className =
        classNameSelect?.value;

    const exam =
        examNameInput?.value
            .trim();

    const year =
        academicYearInput?.value;


    if (!institution) {

        showMessage(
            "প্রতিষ্ঠানের নাম লিখুন।",
            "error"
        );

        institutionNameInput?.focus();

        return false;

    }


    if (!className) {

        showMessage(
            "শ্রেণি নির্বাচন করুন।",
            "error"
        );

        classNameSelect?.focus();

        return false;

    }


    if (
        !allowedClasses[
            className
        ]
    ) {

        showMessage(
            "এই শ্রেণি অনুমোদিত নয়।",
            "error"
        );

        return false;

    }


    if (!exam) {

        showMessage(
            "পরীক্ষার নাম লিখুন।",
            "error"
        );

        examNameInput?.focus();

        return false;

    }


    if (!year) {

        showMessage(
            "শিক্ষাবর্ষ লিখুন।",
            "error"
        );

        academicYearInput?.focus();

        return false;

    }


    return true;

}


// ============================================================
// Validate Subjects
// ============================================================

function validateSubjects() {

    if (
        subjects.length === 0
    ) {

        showMessage(
            "কমপক্ষে একটি বিষয় যোগ করুন।",
            "error"
        );

        return false;

    }


    for (
        let i = 0;
        i < subjects.length;
        i++
    ) {

        const subject =
            subjects[i];


        if (!subject.code) {

            showMessage(
                `বিষয় ${i + 1}-এর Subject Code লিখুন।`,
                "error"
            );

            return false;

        }


        if (!subject.name) {

            showMessage(
                `বিষয় ${i + 1}-এর Subject Name লিখুন।`,
                "error"
            );

            return false;

        }


        const mark =
            Number(
                subject.fullMark
            );


        if (
            !mark ||
            mark <= 0
        ) {

            showMessage(
                `বিষয় ${i + 1}-এর Full Mark সঠিকভাবে দিন।`,
                "error"
            );

            return false;

        }

    }


    return true;

}


// ============================================================
// Check Duplicate Subject Code
// ============================================================

function hasDuplicateSubjectCode() {

    const codes =
        subjects.map(
            subject =>
                subject.code
                    .trim()
                    .toLowerCase()
        );


    return (
        new Set(codes).size !==
        codes.length
    );

}


// ============================================================
// Save Template
// ============================================================

async function saveTemplate() {

    clearMessage();


    if (
        !validateBasicInformation()
    ) {

        return;

    }


    if (
        !validateSubjects()
    ) {

        return;

    }


    if (
        hasDuplicateSubjectCode()
    ) {

        showMessage(
            "একই Subject Code একাধিকবার ব্যবহার করা যাবে না।",
            "error"
        );

        return;

    }


    const key =
        getTemplateKey();


    if (!key) {

        showMessage(
            "Template Key তৈরি করা যায়নি।",
            "error"
        );

        return;

    }


    const templateData = {

        institutionName:
            institutionNameInput.value
                .trim(),

        className:
            classNameSelect.value,

        classLabel:
            allowedClasses[
                classNameSelect.value
            ],

        examName:
            examNameInput.value
                .trim(),

        academicYear:
            Number(
                academicYearInput.value
            ),

        subjects:
            subjects.map(
                (subject, index) => {

                    return {

                        serial:
                            index + 1,

                        code:
                            subject.code
                                .trim(),

                        name:
                            subject.name
                                .trim(),

                        fullMark:
                            Number(
                                subject.fullMark
                            )

                    };

                }
            ),

        updatedAt:
            new Date()
                .toISOString()

    };


    try {

        saveTemplateBtn.disabled =
            true;

        saveTemplateBtn.textContent =
            "সংরক্ষণ হচ্ছে...";


        const templateRef =
            ref(
                db,
                "resultTemplates/" +
                key
            );


        await set(
            templateRef,
            templateData
        );


        existingTemplate =
            templateData;


        if (existingTemplateCard) {

            existingTemplateCard.hidden =
                false;

        }


        showMessage(
            "Subject Template সফলভাবে সংরক্ষণ হয়েছে।",
            "success"
        );

    }
    catch (error) {

        console.error(
            "Save template error:",
            error
        );


        showMessage(
            "Subject Template সংরক্ষণ করা যায়নি। Firebase configuration পরীক্ষা করুন।",
            "error"
        );

    }
    finally {

        saveTemplateBtn.disabled =
            false;

        saveTemplateBtn.textContent =
            "Save Subject Template";

    }

}


// ============================================================
// Input Change Events
// ============================================================

institutionNameInput?.addEventListener(
    "input",
    checkExistingTemplate
);


classNameSelect?.addEventListener(
    "change",
    checkExistingTemplate
);


examNameInput?.addEventListener(
    "input",
    checkExistingTemplate
);


academicYearInput?.addEventListener(
    "input",
    checkExistingTemplate
);


// ============================================================
// Add Subject Button
// ============================================================

addSubjectBtn?.addEventListener(
    "click",
    function () {

        addSubject();

    }
);


// ============================================================
// Save Button
// ============================================================

saveTemplateBtn?.addEventListener(
    "click",
    saveTemplate
);


// ============================================================
// Load Existing Button
// ============================================================

loadExistingBtn?.addEventListener(
    "click",
    loadExistingTemplate
);


// ============================================================
// Initial Subject
// ============================================================

addSubject();


// ============================================================
// Initial Render
// ============================================================

renderSubjects();


// ============================================================
// Console
// ============================================================

console.log(
    "SK Job BD Result Subject Template System Loaded"
);
