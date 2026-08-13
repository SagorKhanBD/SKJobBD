/* =========================================================
   SK JOB BD
   RESULT SUBJECT TEMPLATE SYSTEM

   কাজ:
   1. Institution + Class + Exam + Academic Year অনুযায়ী
      Subject Template তৈরি
   2. Subject Code
   3. Subject Name
   4. Full Mark
   5. অতিরিক্ত Subject যোগ
   6. Firebase Firestore-এ Template Save
   7. আগে Save করা Template খুঁজে বের করা
   8. একই Template পুনরায় ব্যবহার
   9. Template Update

   Classes:
   Nursery
   Play
   KG
   Class 1 - Class 10

   Public Examination নেই।
   ========================================================= */


/* =========================================================
   FIREBASE
   ========================================================= */

import { db, auth } from "../firebase.js";

import {
    collection,
    query,
    where,
    getDocs,
    getDoc,
    setDoc,
    doc,
    serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.13.2/firebase-firestore.js";


/* =========================================================
   ELEMENTS
   ========================================================= */

const institutionName =
    document.getElementById("institutionName");

const className =
    document.getElementById("className");

const examName =
    document.getElementById("examName");

const academicYear =
    document.getElementById("academicYear");

const addSubjectBtn =
    document.getElementById("addSubjectBtn");

const saveTemplateBtn =
    document.getElementById("saveTemplateBtn");

const subjectTableBody =
    document.getElementById("subjectTableBody");

const message =
    document.getElementById("message");

const existingTemplateCard =
    document.getElementById("existingTemplateCard");

const loadExistingBtn =
    document.getElementById("loadExistingBtn");


/* =========================================================
   STATE
   ========================================================= */

let subjects = [];

let existingTemplate = null;

let editingTemplateId = null;


/* =========================================================
   AUTH CHECK
   ========================================================= */

function getCurrentUser() {

    return auth.currentUser || null;

}


/* =========================================================
   MESSAGE
   ========================================================= */

function showMessage(
    text,
    type = "info"
) {

    if (!message) {
        return;
    }

    message.className =
        "message result-message " + type;

    message.innerHTML =
        text;

}


function clearMessage() {

    if (!message) {
        return;
    }

    message.innerHTML = "";

    message.className =
        "message";

}


/* =========================================================
   CLASS NAME
   ========================================================= */

function getClassDisplayName(value) {

    const classes = {

        "nursery": "Nursery",

        "play": "Play",

        "kg": "KG",

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

    return classes[value] || value;

}


/* =========================================================
   CREATE EMPTY SUBJECT
   ========================================================= */

function createEmptySubject() {

    return {

        subjectCode: "",

        subjectName: "",

        fullMark: 100

    };

}


/* =========================================================
   ADD SUBJECT
   ========================================================= */

function addSubject(
    subject = null
) {

    const newSubject =
        subject
            ? {
                subjectCode:
                    subject.subjectCode || "",

                subjectName:
                    subject.subjectName || "",

                fullMark:
                    Number(subject.fullMark) || 100
            }
            : createEmptySubject();


    subjects.push(
        newSubject
    );


    renderSubjects();

}


/* =========================================================
   REMOVE SUBJECT
   ========================================================= */

function removeSubject(index) {

    if (
        index < 0 ||
        index >= subjects.length
    ) {
        return;
    }


    subjects.splice(
        index,
        1
    );


    renderSubjects();

}


/* =========================================================
   UPDATE SUBJECT
   ========================================================= */

function updateSubject(
    index,
    field,
    value
) {

    if (!subjects[index]) {
        return;
    }


    if (
        field ===
        "fullMark"
    ) {

        subjects[index][field] =
            Number(value) || 0;

    } else {

        subjects[index][field] =
            value.trim();

    }

}


/* =========================================================
   RENDER SUBJECTS
   ========================================================= */

function renderSubjects() {

    if (!subjectTableBody) {
        return;
    }


    subjectTableBody.innerHTML =
        "";


    subjects.forEach(
        (subject, index) => {

            const row =
                document.createElement("tr");


            row.innerHTML = `

                <td>
                    ${index + 1}
                </td>


                <td>

                    <input
                        type="text"
                        class="subject-code-input"
                        data-index="${index}"
                        data-field="subjectCode"
                        value="${escapeHtml(subject.subjectCode)}"
                        placeholder="যেমন: 101"
                    >

                </td>


                <td>

                    <input
                        type="text"
                        class="subject-name-input"
                        data-index="${index}"
                        data-field="subjectName"
                        value="${escapeHtml(subject.subjectName)}"
                        placeholder="বিষয়ের নাম"
                    >

                </td>


                <td>

                    <input
                        type="number"
                        class="full-mark-input"
                        data-index="${index}"
                        data-field="fullMark"
                        value="${subject.fullMark}"
                        min="1"
                        max="1000"
                    >

                </td>


                <td>

                    <button
                        type="button"
                        class="removeSubjectBtn result-button danger"
                        data-index="${index}"
                    >
                        Remove
                    </button>

                </td>

            `;


            subjectTableBody.appendChild(
                row
            );

        }
    );

}


/* =========================================================
   ESCAPE HTML
   ========================================================= */

function escapeHtml(value) {

    return String(value)
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");

}


/* =========================================================
   SUBJECT INPUT EVENT
   ========================================================= */

if (subjectTableBody) {

    subjectTableBody.addEventListener(
        "input",
        (event) => {

            const input =
                event.target;


            const index =
                Number(
                    input.dataset.index
                );


            const field =
                input.dataset.field;


            if (
                Number.isNaN(index) ||
                !field
            ) {
                return;
            }


            updateSubject(
                index,
                field,
                input.value
            );

        }
    );


    subjectTableBody.addEventListener(
        "click",
        (event) => {

            const button =
                event.target.closest(
                    ".removeSubjectBtn"
                );


            if (!button) {
                return;
            }


            const index =
                Number(
                    button.dataset.index
                );


            removeSubject(
                index
            );

        }
    );

}


/* =========================================================
   NORMALIZE TEXT
   ========================================================= */

function normalizeText(value) {

    return String(value || "")
        .trim()
        .toLowerCase();

}


/* =========================================================
   CREATE TEMPLATE ID
   ========================================================= */

function createTemplateId(
    uid,
    institution,
    classValue,
    exam,
    year
) {

    const safeInstitution =
        normalizeText(
            institution
        )
        .replace(
            /[^a-z0-9\u0980-\u09ff]+/gi,
            "-"
        )
        .replace(
            /^-+|-+$/g,
            ""
        );


    const safeClass =
        normalizeText(
            classValue
        );


    const safeExam =
        normalizeText(
            exam
        )
        .replace(
            /[^a-z0-9\u0980-\u09ff]+/gi,
            "-"
        )
        .replace(
            /^-+|-+$/g,
            ""
        );


    const safeYear =
        String(year);


    return [
        uid,
        safeInstitution,
        safeClass,
        safeExam,
        safeYear
    ]
    .join("_");

}


/* =========================================================
   VALIDATE BASIC INFORMATION
   ========================================================= */

function validateBasicInformation() {

    if (
        !institutionName ||
        !className ||
        !examName ||
        !academicYear
    ) {

        showMessage(
            "❌ প্রয়োজনীয় Form Element পাওয়া যায়নি।",
            "error"
        );

        return false;

    }


    const institution =
        institutionName.value.trim();


    const selectedClass =
        className.value.trim();


    const exam =
        examName.value.trim();


    const year =
        academicYear.value.trim();


    if (!institution) {

        showMessage(
            "❌ প্রতিষ্ঠানের নাম লিখুন।",
            "error"
        );

        institutionName.focus();

        return false;

    }


    if (!selectedClass) {

        showMessage(
            "❌ শ্রেণি নির্বাচন করুন।",
            "error"
        );

        className.focus();

        return false;

    }


    if (!exam) {

        showMessage(
            "❌ পরীক্ষার নাম লিখুন।",
            "error"
        );

        examName.focus();

        return false;

    }


    if (!year) {

        showMessage(
            "❌ শিক্ষাবর্ষ লিখুন।",
            "error"
        );

        academicYear.focus();

        return false;

    }


    const numericYear =
        Number(year);


    if (
        numericYear < 2000 ||
        numericYear > 2100
    ) {

        showMessage(
            "❌ সঠিক শিক্ষাবর্ষ লিখুন।",
            "error"
        );

        academicYear.focus();

        return false;

    }


    return true;

}


/* =========================================================
   VALIDATE SUBJECTS
   ========================================================= */

function validateSubjects() {

    if (
        subjects.length === 0
    ) {

        showMessage(
            "❌ কমপক্ষে ১টি বিষয় যোগ করুন।",
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


        if (
            !subject.subjectCode
        ) {

            showMessage(
                `❌ বিষয় ${i + 1}-এর Subject Code লিখুন।`,
                "error"
            );

            return false;

        }


        if (
            !subject.subjectName
        ) {

            showMessage(
                `❌ বিষয় ${i + 1}-এর Subject Name লিখুন।`,
                "error"
            );

            return false;

        }


        if (
            !subject.fullMark ||
            Number(subject.fullMark) <= 0
        ) {

            showMessage(
                `❌ বিষয় ${i + 1}-এর Full Mark সঠিক নয়।`,
                "error"
            );

            return false;

        }

    }


    /* =========================================
       DUPLICATE SUBJECT CODE CHECK
    ========================================== */

    const codes =
        subjects.map(
            subject =>
                normalizeText(
                    subject.subjectCode
                )
        );


    const duplicateCodes =
        codes.filter(
            (
                code,
                index
            ) =>
                codes.indexOf(code)
                !== index
        );


    if (
        duplicateCodes.length > 0
    ) {

        showMessage(
            "❌ একই Subject Code একাধিকবার ব্যবহার করা যাবে না।",
            "error"
        );

        return false;

    }


    return true;

}


/* =========================================================
   FIND EXISTING TEMPLATE
   ========================================================= */

async function findExistingTemplate() {

    const user =
        getCurrentUser();


    if (!user) {

        showMessage(
            "❌ Login করা নেই। আগে Company Login করুন।",
            "error"
        );

        return null;

    }


    if (
        !validateBasicInformation()
    ) {
        return null;
    }


    const institution =
        institutionName.value.trim();


    const selectedClass =
        className.value.trim();


    const exam =
        examName.value.trim();


    const year =
        Number(
            academicYear.value
        );


    try {

        const templatesRef =
            collection(
                db,
                "resultTemplates"
            );


        const q =
            query(
                templatesRef,

                where(
                    "ownerUid",
                    "==",
                    user.uid
                ),

                where(
                    "institutionNameNormalized",
                    "==",
                    normalizeText(
                        institution
                    )
                ),

                where(
                    "className",
                    "==",
                    selectedClass
                ),

                where(
                    "examNameNormalized",
                    "==",
                    normalizeText(
                        exam
                    )
                ),

                where(
                    "academicYear",
                    "==",
                    year
                )
            );


        const snapshot =
            await getDocs(q);


        if (
            snapshot.empty
        ) {

            existingTemplate =
                null;


            editingTemplateId =
                null;


            if (
                existingTemplateCard
            ) {

                existingTemplateCard.hidden =
                    true;

            }


            return null;

        }


        const firstDoc =
            snapshot.docs[0];


        existingTemplate = {

            id:
                firstDoc.id,

            ...firstDoc.data()

        };


        editingTemplateId =
            firstDoc.id;


        if (
            existingTemplateCard
        ) {

            existingTemplateCard.hidden =
                false;

        }


        return existingTemplate;

    }
    catch (error) {

        console.error(
            "Find Template Error:",
            error
        );


        showMessage(
            "❌ আগের Template খুঁজতে সমস্যা হয়েছে।",
            "error"
        );


        return null;

    }

}


/* =========================================================
   LOAD EXISTING TEMPLATE
   ========================================================= */

function loadExistingTemplate() {

    if (
        !existingTemplate
    ) {

        showMessage(
            "❌ কোনো সংরক্ষিত Template পাওয়া যায়নি।",
            "error"
        );

        return;

    }


    subjects =
        Array.isArray(
            existingTemplate.subjects
        )
            ? existingTemplate.subjects.map(
                subject => ({

                    subjectCode:
                        subject.subjectCode || "",

                    subjectName:
                        subject.subjectName || "",

                    fullMark:
                        Number(
                            subject.fullMark
                        ) || 100

                })
            )
            : [];


    renderSubjects();


    if (
        existingTemplateCard
    ) {

        existingTemplateCard.hidden =
            true;

    }


    showMessage(
        "✅ আগের সংরক্ষিত বিষয়গুলো লোড করা হয়েছে। এখন প্রয়োজন হলে পরিবর্তন করুন।",
        "success"
    );

}


/* =========================================================
   SAVE TEMPLATE
   ========================================================= */

async function saveTemplate() {

    clearMessage();


    const user =
        getCurrentUser();


    if (!user) {

        showMessage(
            "❌ Login করা নেই। আগে Company Login করুন।",
            "error"
        );

        return;

    }


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


    const institution =
        institutionName.value.trim();


    const selectedClass =
        className.value.trim();


    const exam =
        examName.value.trim();


    const year =
        Number(
            academicYear.value
        );


    const templateId =
        createTemplateId(
            user.uid,
            institution,
            selectedClass,
            exam,
            year
        );


    const templateData = {

        templateId:
            templateId,

        ownerUid:
            user.uid,

        institutionName:
            institution,

        institutionNameNormalized:
            normalizeText(
                institution
            ),

        className:
            selectedClass,

        classDisplayName:
            getClassDisplayName(
                selectedClass
            ),

        examName:
            exam,

        examNameNormalized:
            normalizeText(
                exam
            ),

        academicYear:
            year,

        subjects:
            subjects.map(
                (subject, index) => ({

                    order:
                        index + 1,

                    subjectCode:
                        subject.subjectCode,

                    subjectCodeNormalized:
                        normalizeText(
                            subject.subjectCode
                        ),

                    subjectName:
                        subject.subjectName,

                    fullMark:
                        Number(
                            subject.fullMark
                        )

                })
            ),

        subjectCount:
            subjects.length,

        status:
            "active",

        updatedAt:
            serverTimestamp()

    };


    try {

        await setDoc(

            doc(
                db,
                "resultTemplates",
                templateId
            ),

            {

                ...templateData,

                createdAt:
                    existingTemplate?.createdAt ||
                    serverTimestamp()

            },

            {
                merge: true
            }

        );


        editingTemplateId =
            templateId;


        existingTemplate =
            templateData;


        showMessage(

            "✅ Subject Template সফলভাবে সংরক্ষণ হয়েছে।<br><br>" +

            "প্রতিষ্ঠান: " +
            escapeHtml(
                institution
            ) +

            "<br>" +

            "শ্রেণি: " +
            escapeHtml(
                getClassDisplayName(
                    selectedClass
                )
            ) +

            "<br>" +

            "পরীক্ষা: " +
            escapeHtml(
                exam
            ) +

            "<br>" +

            "শিক্ষাবর্ষ: " +
            year +

            "<br>" +

            "মোট বিষয়: " +
            subjects.length,

            "success"

        );


        if (
            existingTemplateCard
        ) {

            existingTemplateCard.hidden =
                true;

        }

    }
    catch (error) {

        console.error(
            "Save Template Error:",
            error
        );


        if (
            error.code ===
            "permission-denied"
        ) {

            showMessage(
                "❌ Firebase Permission Denied। Firestore Rules পরীক্ষা করুন।",
                "error"
            );

            return;

        }


        showMessage(
            "❌ Subject Template Save করা যায়নি। আবার চেষ্টা করুন।",
            "error"
        );

    }

}


/* =========================================================
   CHECK TEMPLATE WHEN BASIC DATA CHANGES
   ========================================================= */

let searchTimer = null;


function scheduleTemplateSearch() {

    clearTimeout(
        searchTimer
    );


    searchTimer =
        setTimeout(
            async () => {

                if (
                    institutionName?.value.trim() &&
                    className?.value.trim() &&
                    examName?.value.trim() &&
                    academicYear?.value.trim()
                ) {

                    await findExistingTemplate();

                }

            },
            500
        );

}


/* =========================================================
   EVENT: INSTITUTION
   ========================================================= */

if (
    institutionName
) {

    institutionName.addEventListener(
        "input",
        scheduleTemplateSearch
    );

}


/* =========================================================
   EVENT: CLASS
   ========================================================= */

if (
    className
) {

    className.addEventListener(
        "change",
        scheduleTemplateSearch
    );

}


/* =========================================================
   EVENT: EXAM
   ========================================================= */

if (
    examName
) {

    examName.addEventListener(
        "input",
        scheduleTemplateSearch
    );

}


/* =========================================================
   EVENT: YEAR
   ========================================================= */

if (
    academicYear
) {

    academicYear.addEventListener(
        "input",
        scheduleTemplateSearch
    );

}


/* =========================================================
   ADD SUBJECT BUTTON
   ========================================================= */

if (
    addSubjectBtn
) {

    addSubjectBtn.addEventListener(
        "click",
        () => {

            addSubject();

        }
    );

}


/* =========================================================
   SAVE BUTTON
   ========================================================= */

if (
    saveTemplateBtn
) {

    saveTemplateBtn.addEventListener(
        "click",
        saveTemplate
    );

}


/* =========================================================
   LOAD EXISTING BUTTON
   ========================================================= */

if (
    loadExistingBtn
) {

    loadExistingBtn.addEventListener(
        "click",
        loadExistingTemplate
    );

}


/* =========================================================
   INITIAL SUBJECT
   ========================================================= */

if (
    subjects.length === 0
) {

    addSubject();

    addSubject();

    addSubject();

}


/* =========================================================
   FIREBASE AUTH STATE
   ========================================================= */

auth.onAuthStateChanged(
    async (user) => {

        if (!user) {

            showMessage(
                "❌ Company Login পাওয়া যায়নি। Template Save করার জন্য Login করুন।",
                "error"
            );

            return;

        }


        console.log(
            "SK Job BD Result Template User:",
            user.uid
        );

    }
);


/* =========================================================
   ONLINE / OFFLINE
   ========================================================= */

window.addEventListener(
    "offline",
    () => {

        showMessage(
            "❌ Internet Connection বিচ্ছিন্ন হয়েছে।",
            "error"
        );

    }
);


window.addEventListener(
    "online",
    () => {

        showMessage(
            " Internet Connection পুনরায় চালু হয়েছে।",
            "success"
        );

    }
);


/* =========================================================
   START
   ========================================================= */

console.log(
    "SK Job BD Result Template System Loaded."
);
