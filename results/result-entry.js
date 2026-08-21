// ============================================================
// SK Job BD
// Student Result Entry
// results/result-entry.js
// ============================================================

import { db } from "../firebase.js";

import {
    collection,
    query,
    where,
    getDocs,
    addDoc,
    serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.13.2/firebase-firestore.js";


// ============================================================
// ELEMENTS
// ============================================================

const institutionNameInput =
    document.getElementById("institutionName");

const classNameInput =
    document.getElementById("className");

const examNameInput =
    document.getElementById("examName");

const academicYearInput =
    document.getElementById("academicYear");

const loadTemplateBtn =
    document.getElementById("loadTemplateBtn");

const templateStatus =
    document.getElementById("templateStatus");

const templateInfo =
    document.getElementById("templateInfo");

const templateClass =
    document.getElementById("templateClass");

const templateExam =
    document.getElementById("templateExam");

const templateSubjectCount =
    document.getElementById("templateSubjectCount");

const studentSection =
    document.getElementById("studentSection");

const marksSection =
    document.getElementById("marksSection");

const studentNameInput =
    document.getElementById("studentName");

const studentRollInput =
    document.getElementById("studentRoll");

const studentIdInput =
    document.getElementById("studentId");

const marksTableBody =
    document.getElementById("marksTableBody");

const resultSummary =
    document.getElementById("resultSummary");

const totalFullMark =
    document.getElementById("totalFullMark");

const totalObtained =
    document.getElementById("totalObtained");

const percentage =
    document.getElementById("percentage");

const overallResult =
    document.getElementById("overallResult");

const saveResultBtn =
    document.getElementById("saveResultBtn");

const resultStatus =
    document.getElementById("resultStatus");


// ============================================================
// GLOBAL DATA
// ============================================================

let currentTemplate = null;

let currentSubjects = [];


// ============================================================
// INITIAL STATE
// ============================================================

document.addEventListener(
    "DOMContentLoaded",
    () => {

        hideTemplateStatus();

        hideResultStatus();

        resetStudentSection();

    }
);


// ============================================================
// LOAD SAVED SUBJECT TEMPLATE
// ============================================================

loadTemplateBtn.addEventListener(
    "click",
    async () => {

        await loadSubjectTemplate();

    }
);


// ============================================================
// LOAD TEMPLATE FUNCTION
// ============================================================

async function loadSubjectTemplate() {

    const institutionName =
        institutionNameInput.value.trim();

    const className =
        classNameInput.value;

    const examName =
        examNameInput.value.trim();

    const academicYear =
        academicYearInput.value.trim();


    // --------------------------------------------------------
    // VALIDATION
    // --------------------------------------------------------

    if (!institutionName) {

        showTemplateStatus(
            "প্রতিষ্ঠানের নাম লিখুন।",
            "error"
        );

        institutionNameInput.focus();

        return;

    }


    if (!className) {

        showTemplateStatus(
            "শ্রেণি নির্বাচন করুন।",
            "error"
        );

        classNameInput.focus();

        return;

    }


    if (!examName) {

        showTemplateStatus(
            "পরীক্ষার নাম লিখুন।",
            "error"
        );

        examNameInput.focus();

        return;

    }


    if (!academicYear) {

        showTemplateStatus(
            "শিক্ষাবর্ষ লিখুন।",
            "error"
        );

        academicYearInput.focus();

        return;

    }


    // --------------------------------------------------------
    // BUTTON STATE
    // --------------------------------------------------------

    loadTemplateBtn.disabled = true;

    loadTemplateBtn.textContent =
        "বিষয় খোঁজা হচ্ছে...";


    hideTemplateStatus();


    try {

        // ----------------------------------------------------
        // FIRESTORE QUERY
        // ----------------------------------------------------

        const templatesRef =
            collection(
                db,
                "resultTemplates"
            );


        const templateQuery =
            query(
                templatesRef,

                where(
                    "institutionName",
                    "==",
                    institutionName
                ),

                where(
                    "className",
                    "==",
                    className
                ),

                where(
                    "examName",
                    "==",
                    examName
                ),

                where(
                    "academicYear",
                    "==",
                    Number(academicYear)
                )
            );


        const snapshot =
            await getDocs(templateQuery);


        // ----------------------------------------------------
        // NO TEMPLATE
        // ----------------------------------------------------

        if (snapshot.empty) {

            currentTemplate = null;

            currentSubjects = [];

            templateInfo.classList.remove(
                "active"
            );

            resetStudentSection();


            showTemplateStatus(
                "এই শ্রেণি, পরীক্ষা ও শিক্ষাবর্ষের জন্য কোনো সংরক্ষিত Subject Template পাওয়া যায়নি। আগে Subject Template সংরক্ষণ করুন।",
                "warning"
            );

            return;

        }


        // ----------------------------------------------------
        // FIRST TEMPLATE
        // ----------------------------------------------------

        const templateDoc =
            snapshot.docs[0];


        currentTemplate = {

            id: templateDoc.id,

            ...templateDoc.data()

        };


        // ----------------------------------------------------
        // SUBJECTS
        // ----------------------------------------------------

        currentSubjects =
            Array.isArray(
                currentTemplate.subjects
            )
                ? currentTemplate.subjects
                : [];


        // ----------------------------------------------------
        // SUBJECT VALIDATION
        // ----------------------------------------------------

        if (
            currentSubjects.length === 0
        ) {

            resetStudentSection();

            showTemplateStatus(
                "Template পাওয়া গেছে, কিন্তু কোনো বিষয় পাওয়া যায়নি।",
                "error"
            );

            return;

        }


        // ----------------------------------------------------
        // TEMPLATE INFO
        // ----------------------------------------------------

        templateClass.textContent =
            getClassDisplayName(
                className
            );


        templateExam.textContent =
            examName;


        templateSubjectCount.textContent =
            currentSubjects.length;


        templateInfo.classList.add(
            "active"
        );


        // ----------------------------------------------------
        // SUCCESS MESSAGE
        // ----------------------------------------------------

        showTemplateStatus(
            "Subject Template সফলভাবে পাওয়া গেছে। এখন শিক্ষার্থীর তথ্য এবং নম্বর দিন।",
            "success"
        );


        // ----------------------------------------------------
        // CREATE MARKS TABLE
        // ----------------------------------------------------

        createMarksTable(
            currentSubjects
        );


        // ----------------------------------------------------
        // SHOW STUDENT SECTION
        // ----------------------------------------------------

        studentSection.classList.add(
            "active"
        );


        marksSection.classList.add(
            "active"
        );


        resultSummary.classList.remove(
            "active"
        );


        studentNameInput.focus();


        // ----------------------------------------------------
        // SCROLL
        // ----------------------------------------------------

        setTimeout(
            () => {

                studentSection.scrollIntoView(
                    {
                        behavior: "smooth",
                        block: "start"
                    }
                );

            },
            150
        );


    }
    catch (error) {

        console.error(
            "Template loading error:",
            error
        );


        resetStudentSection();


        showTemplateStatus(
            "Subject Template লোড করতে সমস্যা হয়েছে। Firebase সংযোগ এবং Firestore collection পরীক্ষা করুন।",
            "error"
        );

    }
    finally {

        loadTemplateBtn.disabled = false;

        loadTemplateBtn.textContent =
            "সংরক্ষিত বিষয় লোড করুন";

    }

}


// ============================================================
// CREATE MARKS TABLE
// ============================================================

function createMarksTable(
    subjects
) {

    marksTableBody.innerHTML = "";


    subjects.forEach(
        (
            subject,
            index
        ) => {


            const row =
                document.createElement(
                    "tr"
                );


            // ------------------------------------------------
            // SEQUENCE
            // ------------------------------------------------

            const serialCell =
                document.createElement(
                    "td"
                );

            serialCell.textContent =
                index + 1;


            // ------------------------------------------------
            // SUBJECT CODE
            // ------------------------------------------------

            const codeCell =
                document.createElement(
                    "td"
                );

            codeCell.textContent =
                getSubjectCode(
                    subject
                );


            // ------------------------------------------------
            // SUBJECT NAME
            // ------------------------------------------------

            const nameCell =
                document.createElement(
                    "td"
                );

            nameCell.textContent =
                getSubjectName(
                    subject
                );


            // ------------------------------------------------
            // FULL MARK
            // ------------------------------------------------

            const fullMarkCell =
                document.createElement(
                    "td"
                );


            const fullMark =
                getFullMark(
                    subject
                );


            fullMarkCell.innerHTML =
                `<span class="fullMarkText">${fullMark}</span>`;


            // ------------------------------------------------
            // OBTAINED MARK
            // ------------------------------------------------

            const obtainedCell =
                document.createElement(
                    "td"
                );


            const input =
                document.createElement(
                    "input"
                );


            input.type =
                "number";


            input.className =
                "obtainedMark";


            input.dataset.index =
                index;


            input.dataset.fullMark =
                fullMark;


            input.min =
                "0";


            input.max =
                fullMark;


            input.step =
                "0.01";


            input.placeholder =
                "প্রাপ্ত নম্বর";


            input.addEventListener(
                "input",
                () => {

                    validateMarkInput(
                        input
                    );

                    calculateSummary();

                }
            );


            obtainedCell.appendChild(
                input
            );


            // ------------------------------------------------
            // ROW
            // ------------------------------------------------

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
                fullMarkCell
            );

            row.appendChild(
                obtainedCell
            );


            marksTableBody.appendChild(
                row
            );

        }
    );

}


// ============================================================
// VALIDATE MARK INPUT
// ============================================================

function validateMarkInput(
    input
) {

    const fullMark =
        Number(
            input.dataset.fullMark
        );


    let value =
        Number(
            input.value
        );


    if (
        Number.isNaN(value)
    ) {

        return;

    }


    if (value < 0) {

        value = 0;

    }


    if (
        value > fullMark
    ) {

        value = fullMark;

    }


    input.value =
        value;

}


// ============================================================
// CALCULATE RESULT SUMMARY
// ============================================================

function calculateSummary() {

    if (
        currentSubjects.length === 0
    ) {

        return;

    }


    let totalFull =
        0;

    let totalObtainedMarks =
        0;


    const inputs =
        document.querySelectorAll(
            ".obtainedMark"
        );


    currentSubjects.forEach(
        subject => {

            totalFull +=
                getFullMark(
                    subject
                );

        }
    );


    inputs.forEach(
        input => {

            const value =
                Number(
                    input.value
                );


            if (
                !Number.isNaN(value)
            ) {

                totalObtainedMarks +=
                    value;

            }

        }
    );


    const percentageValue =
        totalFull > 0
            ? (
                totalObtainedMarks /
                totalFull
            ) * 100
            : 0;


    totalFullMark.textContent =
        formatNumber(
            totalFull
        );


    totalObtained.textContent =
        formatNumber(
            totalObtainedMarks
        );


    percentage.textContent =
        percentageValue.toFixed(2)
        + "%";


    overallResult.textContent =
        getOverallResult(
            percentageValue
        );


    resultSummary.classList.add(
        "active"
    );

}


// ============================================================
// OVERALL RESULT
// ============================================================

function getOverallResult(
    percentageValue
) {

    if (
        percentageValue >= 80
    ) {

        return "A+";

    }


    if (
        percentageValue >= 70
    ) {

        return "A";

    }


    if (
        percentageValue >= 60
    ) {

        return "A-";

    }


    if (
        percentageValue >= 50
    ) {

        return "B";

    }


    if (
        percentageValue >= 40
    ) {

        return "C";

    }


    if (
        percentageValue >= 33
    ) {

        return "D";

    }


    return "F";

}


// ============================================================
// SAVE RESULT
// ============================================================

saveResultBtn.addEventListener(
    "click",
    async () => {

        await saveStudentResult();

    }
);


// ============================================================
// SAVE STUDENT RESULT FUNCTION
// ============================================================

async function saveStudentResult() {

    hideResultStatus();


    // --------------------------------------------------------
    // TEMPLATE CHECK
    // --------------------------------------------------------

    if (
        !currentTemplate ||
        currentSubjects.length === 0
    ) {

        showResultStatus(
            "প্রথমে Subject Template লোড করুন।",
            "error"
        );

        return;

    }


    // --------------------------------------------------------
    // STUDENT INFORMATION
    // --------------------------------------------------------

    const studentName =
        studentNameInput.value.trim();

    const studentRoll =
        studentRollInput.value.trim();

    const studentId =
        studentIdInput.value.trim();


    if (!studentName) {

        showResultStatus(
            "শিক্ষার্থীর নাম লিখুন।",
            "error"
        );

        studentNameInput.focus();

        return;

    }


    if (!studentRoll) {

        showResultStatus(
            "শিক্ষার্থীর রোল নম্বর লিখুন।",
            "error"
        );

        studentRollInput.focus();

        return;

    }


    // --------------------------------------------------------
    // MARKS
    // --------------------------------------------------------

    const markInputs =
        document.querySelectorAll(
            ".obtainedMark"
        );


    if (
        markInputs.length !==
        currentSubjects.length
    ) {

        showResultStatus(
            "বিষয়ের তথ্য সঠিকভাবে পাওয়া যায়নি।",
            "error"
        );

        return;

    }


    const subjects = [];

    let totalFull =
        0;

    let totalObtainedMarks =
        0;


    for (
        let i = 0;
        i < currentSubjects.length;
        i++
    ) {

        const subject =
            currentSubjects[i];


        const input =
            markInputs[i];


        const fullMark =
            getFullMark(
                subject
            );


        const obtained =
            input.value === ""
                ? null
                : Number(
                    input.value
                );


        if (
            obtained === null
        ) {

            showResultStatus(
                `${getSubjectName(subject)} বিষয়ের প্রাপ্ত নম্বর দিন।`,
                "error"
            );

            input.focus();

            return;

        }


        if (
            Number.isNaN(obtained)
        ) {

            showResultStatus(
                `${getSubjectName(subject)} বিষয়ের নম্বর সঠিক নয়।`,
                "error"
            );

            input.focus();

            return;

        }


        if (
            obtained < 0 ||
            obtained > fullMark
        ) {

            showResultStatus(
                `${getSubjectName(subject)} বিষয়ের নম্বর 0 থেকে ${fullMark}-এর মধ্যে হতে হবে।`,
                "error"
            );

            input.focus();

            return;

        }


        totalFull +=
            fullMark;


        totalObtainedMarks +=
            obtained;


        subjects.push({

            subjectCode:
                getSubjectCode(
                    subject
                ),

            subjectName:
                getSubjectName(
                    subject
                ),

            fullMark:
                fullMark,

            obtainedMark:
                obtained

        });

    }


    // --------------------------------------------------------
    // FINAL CALCULATION
    // --------------------------------------------------------

    const percentageValue =
        totalFull > 0
            ? (
                totalObtainedMarks /
                totalFull
            ) * 100
            : 0;


    const finalResult =
        getOverallResult(
            percentageValue
        );


    // --------------------------------------------------------
    // SAVE BUTTON STATE
    // --------------------------------------------------------

    saveResultBtn.disabled =
        true;

    saveResultBtn.textContent =
        "ফলাফল সংরক্ষণ হচ্ছে...";


    try {

        // ----------------------------------------------------
        // RESULT DATA
        // ----------------------------------------------------

        const resultData = {

            institutionName:
                institutionNameInput.value.trim(),

            className:
                classNameInput.value,

            classDisplayName:
                getClassDisplayName(
                    classNameInput.value
                ),

            examName:
                examNameInput.value.trim(),

            academicYear:
                Number(
                    academicYearInput.value
                ),

            templateId:
                currentTemplate.id,

            studentName:
                studentName,

            studentRoll:
                studentRoll,

            studentId:
                studentId,

            subjects:
                subjects,

            totalFullMark:
                totalFull,

            totalObtained:
                totalObtainedMarks,

            percentage:
                Number(
                    percentageValue.toFixed(2)
                ),

            result:
                finalResult,

            createdAt:
                serverTimestamp()

        };


        // ----------------------------------------------------
        // FIRESTORE SAVE
        // ----------------------------------------------------

        await addDoc(
            collection(
                db,
                "studentResults"
            ),
            resultData
        );


        // ----------------------------------------------------
        // SUCCESS
        // ----------------------------------------------------

        showResultStatus(
            "শিক্ষার্থীর ফলাফল সফলভাবে সংরক্ষণ করা হয়েছে।",
            "success"
        );


        // ----------------------------------------------------
        // CLEAR STUDENT FORM
        // ----------------------------------------------------

        studentNameInput.value =
            "";

        studentRollInput.value =
            "";

        studentIdInput.value =
            "";


        markInputsClear();


        resultSummary.classList.remove(
            "active"
        );


        studentNameInput.focus();


    }
    catch (error) {

        console.error(
            "Result save error:",
            error
        );


        showResultStatus(
            "ফলাফল সংরক্ষণ করা যায়নি। Firebase/Firestore সেটিং পরীক্ষা করুন।",
            "error"
        );

    }
    finally {

        saveResultBtn.disabled =
            false;

        saveResultBtn.textContent =
            "ফলাফল সংরক্ষণ করুন";

    }

}


// ============================================================
// CLEAR MARK INPUTS
// ============================================================

function markInputsClear() {

    const inputs =
        document.querySelectorAll(
            ".obtainedMark"
        );


    inputs.forEach(
        input => {

            input.value =
                "";

        }
    );

}


// ============================================================
// GET SUBJECT CODE
// ============================================================

function getSubjectCode(
    subject
) {

    return (
        subject.subjectCode ??
        subject.code ??
        subject.subject_code ??
        ""
    );

}


// ============================================================
// GET SUBJECT NAME
// ============================================================

function getSubjectName(
    subject
) {

    return (
        subject.subjectName ??
        subject.name ??
        subject.subject_name ??
        "বিষয়"
    );

}


// ============================================================
// GET FULL MARK
// ============================================================

function getFullMark(
    subject
) {

    const value =
        Number(
            subject.fullMark ??
            subject.fullMarks ??
            subject.full_mark ??
            0
        );


    if (
        Number.isNaN(value)
    ) {

        return 0;

    }


    return value;

}


// ============================================================
// CLASS DISPLAY NAME
// ============================================================

function getClassDisplayName(
    className
) {

    const classNames = {

        "nursery":
            "Nursery",

        "play":
            "Play",

        "kg":
            "KG",

        "class-1":
            "১ম শ্রেণি",

        "class-2":
            "২য় শ্রেণি",

        "class-3":
            "৩য় শ্রেণি",

        "class-4":
            "৪র্থ শ্রেণি",

        "class-5":
            "৫ম শ্রেণি",

        "class-6":
            "৬ষ্ঠ শ্রেণি",

        "class-7":
            "৭ম শ্রেণি",

        "class-8":
            "৮ম শ্রেণি",

        "class-9":
            "৯ম শ্রেণি",

        "class-10":
            "১০ম শ্রেণি"

    };


    return (
        classNames[className] ??
        className
    );

}


// ============================================================
// NUMBER FORMAT
// ============================================================

function formatNumber(
    value
) {

    if (
        Number.isInteger(value)
    ) {

        return String(value);

    }


    return Number(
        value.toFixed(2)
    ).toString();

}


// ============================================================
// TEMPLATE STATUS
// ============================================================

function showTemplateStatus(
    message,
    type
) {

    templateStatus.textContent =
        message;

    templateStatus.className =
        "templateStatus "
        + type;

}


function hideTemplateStatus() {

    templateStatus.textContent =
        "";

    templateStatus.className =
        "templateStatus";

}


// ============================================================
// RESULT STATUS
// ============================================================

function showResultStatus(
    message,
    type
) {

    resultStatus.textContent =
        message;

    resultStatus.className =
        "templateStatus "
        + type;

}


function hideResultStatus() {

    resultStatus.textContent =
        "";

    resultStatus.className =
        "templateStatus";

}


// ============================================================
// RESET STUDENT SECTION
// ============================================================

function resetStudentSection() {

    studentSection.classList.remove(
        "active"
    );


    marksSection.classList.remove(
        "active"
    );


    resultSummary.classList.remove(
        "active"
    );


    marksTableBody.innerHTML =
        "";

    currentSubjects =
        [];

}


// ============================================================
// END
// ============================================================
