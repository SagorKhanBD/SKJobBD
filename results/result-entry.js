
// ============================================================
// SK Job BD
// Student Result Entry
// File: results/result-entry.js
// Automatic Proportional Grading System
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

const institutionNameInput = document.getElementById("institutionName");
const classNameInput = document.getElementById("className");
const examNameInput = document.getElementById("examName");
const academicYearInput = document.getElementById("academicYear");

const loadTemplateBtn = document.getElementById("loadTemplateBtn");
const templateStatus = document.getElementById("templateStatus");
const templateInfo = document.getElementById("templateInfo");

const templateClass = document.getElementById("templateClass");
const templateExam = document.getElementById("templateExam");
const templateSubjectCount = document.getElementById("templateSubjectCount");

const studentSection = document.getElementById("studentSection");
const marksSection = document.getElementById("marksSection");

const studentNameInput = document.getElementById("studentName");
const studentRollInput = document.getElementById("studentRoll");
const studentIdInput = document.getElementById("studentId");

const marksTableBody = document.getElementById("marksTableBody");

const resultSummary = document.getElementById("resultSummary");
const totalFullMark = document.getElementById("totalFullMark");
const totalObtained = document.getElementById("totalObtained");
const percentage = document.getElementById("percentage");
const overallResult = document.getElementById("overallResult");

const saveResultBtn = document.getElementById("saveResultBtn");
const resultStatus = document.getElementById("resultStatus");


// ============================================================
// GLOBAL DATA
// ============================================================

let currentTemplate = null;
let currentSubjects = [];


// ============================================================
// INITIAL STATE
// ============================================================

document.addEventListener("DOMContentLoaded", () => {

    hideTemplateStatus();
    hideResultStatus();
    resetStudentSection();

});


// ============================================================
// EVENT LISTENERS
// ============================================================

loadTemplateBtn.addEventListener("click", async () => {

    await loadSubjectTemplate();

});

saveResultBtn.addEventListener("click", async () => {

    await saveStudentResult();

});


// ============================================================
// LOAD SUBJECT TEMPLATE
// ============================================================

async function loadSubjectTemplate() {

    const institutionName = institutionNameInput.value.trim();
    const className = classNameInput.value;
    const examName = examNameInput.value.trim();
    const academicYear = academicYearInput.value.trim();

    if (!institutionName) {

        showTemplateStatus("প্রতিষ্ঠানের নাম লিখুন।", "error");
        institutionNameInput.focus();
        return;

    }

    if (!className) {

        showTemplateStatus("শ্রেণি নির্বাচন করুন।", "error");
        classNameInput.focus();
        return;

    }

    if (!examName) {

        showTemplateStatus("পরীক্ষার নাম লিখুন।", "error");
        examNameInput.focus();
        return;

    }

    if (!academicYear) {

        showTemplateStatus("শিক্ষাবর্ষ লিখুন।", "error");
        academicYearInput.focus();
        return;

    }

    loadTemplateBtn.disabled = true;
    loadTemplateBtn.textContent = "বিষয় খোঁজা হচ্ছে...";

    hideTemplateStatus();

    try {

        const templatesRef = collection(db, "resultTemplates");

        const templateQuery = query(
            templatesRef,
            where("institutionName", "==", institutionName),
            where("className", "==", className),
            where("examName", "==", examName),
            where("academicYear", "==", Number(academicYear))
        );

        const snapshot = await getDocs(templateQuery);

        if (snapshot.empty) {

            currentTemplate = null;
            currentSubjects = [];

            templateInfo.classList.remove("active");

            resetStudentSection();

            showTemplateStatus(
                "এই শ্রেণি, পরীক্ষা ও শিক্ষাবর্ষের জন্য কোনো সংরক্ষিত Subject Template পাওয়া যায়নি।",
                "warning"
            );

            return;

        }

        const templateDoc = snapshot.docs[0];

        currentTemplate = {
            id: templateDoc.id,
            ...templateDoc.data()
        };

        currentSubjects = Array.isArray(currentTemplate.subjects)
            ? currentTemplate.subjects
            : [];

        if (currentSubjects.length === 0) {

            resetStudentSection();

            showTemplateStatus(
                "Template পাওয়া গেছে, কিন্তু কোনো বিষয় পাওয়া যায়নি।",
                "error"
            );

            return;

        }

        const invalidSubject = currentSubjects.some(subject => {

            return getFullMark(subject) <= 0;

        });

        if (invalidSubject) {

            resetStudentSection();

            showTemplateStatus(
                "কোনো বিষয়ের পূর্ণ নম্বর সঠিক নয়। Subject Template পরীক্ষা করুন।",
                "error"
            );

            return;

        }

        templateClass.textContent = getClassDisplayName(className);
        templateExam.textContent = examName;
        templateSubjectCount.textContent = currentSubjects.length;

        templateInfo.classList.add("active");

        createMarksTable(currentSubjects);

        studentSection.classList.add("active");
        marksSection.classList.add("active");

        resultSummary.classList.remove("active");

        showTemplateStatus(
            "Subject Template সফলভাবে পাওয়া গেছে। এখন শিক্ষার্থীর তথ্য এবং নম্বর দিন।",
            "success"
        );

        studentNameInput.focus();

        setTimeout(() => {

            studentSection.scrollIntoView({
                behavior: "smooth",
                block: "start"
            });

        }, 150);

    } catch (error) {

        console.error("Template loading error:", error);

        resetStudentSection();

        showTemplateStatus(
            "Subject Template লোড করতে সমস্যা হয়েছে। Firebase সংযোগ পরীক্ষা করুন।",
            "error"
        );

    } finally {

        loadTemplateBtn.disabled = false;
        loadTemplateBtn.textContent = "সংরক্ষিত বিষয় লোড করুন";

    }

}


// ============================================================
// CREATE MARKS TABLE
// ============================================================

function createMarksTable(subjects) {

    marksTableBody.innerHTML = "";

    subjects.forEach((subject, index) => {

        const row = document.createElement("tr");

        const serialCell = document.createElement("td");
        serialCell.textContent = index + 1;

        const codeCell = document.createElement("td");
        codeCell.textContent = getSubjectCode(subject);

        const nameCell = document.createElement("td");
        nameCell.textContent = getSubjectName(subject);

        const fullMarkCell = document.createElement("td");

        const fullMark = getFullMark(subject);

        const fullMarkText = document.createElement("span");
        fullMarkText.className = "fullMarkText";
        fullMarkText.textContent = formatNumber(fullMark);

        fullMarkCell.appendChild(fullMarkText);

        const obtainedCell = document.createElement("td");

        const input = document.createElement("input");

        input.type = "number";
        input.className = "obtainedMark";

        input.dataset.index = index;
        input.dataset.fullMark = fullMark;

        input.min = "0";
        input.max = String(fullMark);
        input.step = "0.01";
        input.placeholder = "প্রাপ্ত নম্বর";

        input.addEventListener("input", () => {

            validateMarkInput(input);
            calculateSummary();

        });

        obtainedCell.appendChild(input);

        row.appendChild(serialCell);
        row.appendChild(codeCell);
        row.appendChild(nameCell);
        row.appendChild(fullMarkCell);
        row.appendChild(obtainedCell);

        marksTableBody.appendChild(row);

    });

}


// ============================================================
// VALIDATE MARK INPUT
// ============================================================

function validateMarkInput(input) {

    if (input.value.trim() === "") {
        return;
    }

    let value = Number(input.value);

    const fullMark = Number(input.dataset.fullMark);

    if (!Number.isFinite(value)) {

        input.value = "";
        return;

    }

    if (value < 0) {
        value = 0;
    }

    if (value > fullMark) {
        value = fullMark;
    }

    input.value = String(value);

}


// ============================================================
// PASS MARK CALCULATION
// ============================================================

function getPassMark(fullMark) {

    // ৫০ নম্বরের বিষয়ের বিশেষ পাস নম্বর

    if (fullMark === 50) {
        return 16;
    }

    // অন্যান্য বিষয়ের ক্ষেত্রে ৩৩ শতাংশ

    return fullMark * 0.33;

}


// ============================================================
// PASS / FAIL CHECK
// ============================================================

function isSubjectPassed(obtainedMark, fullMark) {

    const passMark = getPassMark(fullMark);

    return obtainedMark >= passMark;

}


// ============================================================
// PROPORTIONAL GRADE POINT
// ============================================================

function calculateGradePoint(obtainedMark, fullMark) {

    if (
        !Number.isFinite(obtainedMark) ||
        !Number.isFinite(fullMark) ||
        fullMark <= 0 ||
        obtainedMark < 0 ||
        obtainedMark > fullMark
    ) {

        return 0;

    }

    return Number(
        ((obtainedMark / fullMark) * 5).toFixed(2)
    );

}


// ============================================================
// LETTER GRADE
// ============================================================

function getLetterGrade(gradePoint, passed = true) {

    // পাসের শর্ত পূরণ না হলে সরাসরি F

    if (!passed) {
        return "F";
    }

    if (gradePoint >= 4.50) return "A+";
    if (gradePoint >= 4.00) return "A";
    if (gradePoint >= 3.50) return "A-";
    if (gradePoint >= 3.00) return "B";
    if (gradePoint >= 2.00) return "C";
    if (gradePoint >= 1.00) return "D";

    return "F";

}


// ============================================================
// OVERALL RESULT CALCULATION
// ============================================================

function calculateOverallGrade(subjects) {

    if (!Array.isArray(subjects) || subjects.length === 0) {

        return {
            gpa: 0,
            grade: "F",
            result: "FAILED"
        };

    }

    const totalGradePoint = subjects.reduce(
        (sum, subject) => sum + Number(subject.gradePoint),
        0
    );

    const gpa = Number(
        (totalGradePoint / subjects.length).toFixed(2)
    );

    const hasFailedSubject = subjects.some(
        subject => !subject.passed
    );

    const grade = getLetterGrade(gpa, !hasFailedSubject);

    return {
        gpa,
        grade,
        result: hasFailedSubject ? "FAILED" : "PASSED"
    };

}


// ============================================================
// CALCULATE RESULT SUMMARY
// ============================================================

function calculateSummary() {

    if (currentSubjects.length === 0) {
        return;
    }

    let totalFull = 0;
    let totalObtainedMarks = 0;

    let allMarksEntered = true;

    const inputs = document.querySelectorAll(".obtainedMark");

    currentSubjects.forEach(subject => {

        totalFull += getFullMark(subject);

    });

    inputs.forEach(input => {

        if (input.value.trim() === "") {

            allMarksEntered = false;
            return;

        }

        totalObtainedMarks += Number(input.value);

    });

    const percentageValue = totalFull > 0
        ? (totalObtainedMarks / totalFull) * 100
        : 0;

    totalFullMark.textContent = formatNumber(totalFull);
    totalObtained.textContent = formatNumber(totalObtainedMarks);
    percentage.textContent = percentageValue.toFixed(2) + "%";

    if (!allMarksEntered) {

        overallResult.textContent = "PENDING";

    } else {

        const calculatedSubjects = currentSubjects.map((subject, index) => {

            const obtained = Number(inputs[index].value);
            const full = getFullMark(subject);

            const gp = calculateGradePoint(obtained, full);
            const passed = isSubjectPassed(obtained, full);

            return {
                gradePoint: gp,
                passed
            };

        });

        const overall = calculateOverallGrade(calculatedSubjects);

        overallResult.textContent =
            `${overall.grade} | GPA ${overall.gpa} | ${overall.result}`;

    }

    resultSummary.classList.add("active");

}


// ============================================================
// SAVE STUDENT RESULT
// ============================================================

async function saveStudentResult() {

    hideResultStatus();

    if (!currentTemplate || currentSubjects.length === 0) {

        showResultStatus(
            "প্রথমে Subject Template লোড করুন।",
            "error"
        );

        return;

    }

    const studentName = studentNameInput.value.trim();
    const studentRoll = studentRollInput.value.trim();
    const studentId = studentIdInput.value.trim();

    if (!studentName) {

        showResultStatus("শিক্ষার্থীর নাম লিখুন।", "error");
        studentNameInput.focus();
        return;

    }

    if (!studentRoll) {

        showResultStatus("শিক্ষার্থীর রোল নম্বর লিখুন।", "error");
        studentRollInput.focus();
        return;

    }

    const markInputs = document.querySelectorAll(".obtainedMark");

    if (markInputs.length !== currentSubjects.length) {

        showResultStatus(
            "বিষয়ের তথ্য সঠিকভাবে পাওয়া যায়নি।",
            "error"
        );

        return;

    }

    const subjects = [];

    let totalFull = 0;
    let totalObtainedMarks = 0;

    for (let i = 0; i < currentSubjects.length; i++) {

        const subject = currentSubjects[i];
        const input = markInputs[i];

        const fullMark = getFullMark(subject);

        const obtained = input.value.trim() === ""
            ? null
            : Number(input.value);

        if (obtained === null) {

            showResultStatus(
                `${getSubjectName(subject)} বিষয়ের প্রাপ্ত নম্বর দিন।`,
                "error"
            );

            input.focus();
            return;

        }

        if (
            !Number.isFinite(obtained) ||
            obtained < 0 ||
            obtained > fullMark
        ) {

            showResultStatus(
                `${getSubjectName(subject)} বিষয়ের নম্বর সঠিক নয়।`,
                "error"
            );

            input.focus();
            return;

        }

        const gradePoint = calculateGradePoint(
            obtained,
            fullMark
        );

        const passed = isSubjectPassed(
            obtained,
            fullMark
        );

        const letterGrade = getLetterGrade(
            gradePoint,
            passed
        );

        const passMark = getPassMark(fullMark);

        totalFull += fullMark;
        totalObtainedMarks += obtained;

        subjects.push({

            subjectCode: getSubjectCode(subject),

            subjectName: getSubjectName(subject),

            fullMark,

            obtainedMark: obtained,

            passMark,

            passed,

            gradePoint,

            letterGrade

        });

    }

    const percentageValue = totalFull > 0
        ? (totalObtainedMarks / totalFull) * 100
        : 0;

    const overall = calculateOverallGrade(subjects);

    saveResultBtn.disabled = true;
    saveResultBtn.textContent = "ফলাফল সংরক্ষণ হচ্ছে...";

    try {

        const resultData = {

            institutionName: institutionNameInput.value.trim(),

            className: classNameInput.value,

            classDisplayName: getClassDisplayName(
                classNameInput.value
            ),

            examName: examNameInput.value.trim(),

            academicYear: Number(academicYearInput.value),

            templateId: currentTemplate.id,

            studentName,

            studentRoll,

            studentId,

            subjects,

            totalFullMark: totalFull,

            totalObtained: totalObtainedMarks,

            percentage: Number(percentageValue.toFixed(2)),

            overallGPA: overall.gpa,

            overallGrade: overall.grade,

            result: overall.result,

            gradingMethod: "PROPORTIONAL_5_POINT_WITH_PASS_MARK",

            createdAt: serverTimestamp()

        };

        await addDoc(
            collection(db, "studentResults"),
            resultData
        );

        showResultStatus(
            "শিক্ষার্থীর ফলাফল সফলভাবে সংরক্ষণ করা হয়েছে।",
            "success"
        );

        studentNameInput.value = "";
        studentRollInput.value = "";
        studentIdInput.value = "";

        markInputsClear();

        resultSummary.classList.remove("active");

        studentNameInput.focus();

    } catch (error) {

        console.error("Result save error:", error);

        showResultStatus(
            "ফলাফল সংরক্ষণ করা যায়নি। Firebase/Firestore সেটিং পরীক্ষা করুন।",
            "error"
        );

    } finally {

        saveResultBtn.disabled = false;
        saveResultBtn.textContent = "ফলাফল সংরক্ষণ করুন";

    }

}


// ============================================================
// CLEAR MARK INPUTS
// ============================================================

function markInputsClear() {

    document.querySelectorAll(".obtainedMark").forEach(input => {

        input.value = "";

    });

}


// ============================================================
// SUBJECT HELPERS
// ============================================================

function getSubjectCode(subject) {

    return (
        subject.subjectCode ??
        subject.code ??
        subject.subject_code ??
        ""
    );

}

function getSubjectName(subject) {

    return (
        subject.subjectName ??
        subject.name ??
        subject.subject_name ??
        "বিষয়"
    );

}

function getFullMark(subject) {

    const value = Number(
        subject.fullMark ??
        subject.fullMarks ??
        subject.full_mark ??
        0
    );

    return Number.isFinite(value) ? value : 0;

}


// ============================================================
// CLASS DISPLAY NAME
// ============================================================

function getClassDisplayName(className) {

    const classNames = {

        nursery: "Nursery",
        play: "Play",
        kg: "KG",

        "class-1": "Class 1",
        "class-2": "Class 2",
        "class-3": "Class 3",
        "class-4": "Class 4",
        "class-5": "Class 5",
        "class-6": "Class 6",
        "class-7": "Class 7",
        "class-8": "Class 8",
        "class-9": "Class 9",
        "class-10": "Class 10"

    };

    return classNames[className] ?? className;

}


// ============================================================
// NUMBER FORMAT
// ============================================================

function formatNumber(value) {

    if (Number.isInteger(value)) {
        return String(value);
    }

    return Number(value.toFixed(2)).toString();

}


// ============================================================
// STATUS MESSAGES
// ============================================================

function showTemplateStatus(message, type) {

    templateStatus.textContent = message;
    templateStatus.className = "templateStatus " + type;

}

function hideTemplateStatus() {

    templateStatus.textContent = "";
    templateStatus.className = "templateStatus";

}

function showResultStatus(message, type) {

    resultStatus.textContent = message;
    resultStatus.className = "templateStatus " + type;

}

function hideResultStatus() {

    resultStatus.textContent = "";
    resultStatus.className = "templateStatus";

}


// ============================================================
// RESET STUDENT SECTION
// ============================================================

function resetStudentSection() {

    studentSection.classList.remove("active");
    marksSection.classList.remove("active");
    resultSummary.classList.remove("active");

    marksTableBody.innerHTML = "";

    currentSubjects = [];

}


// ============================================================
// END
// ============================================================
