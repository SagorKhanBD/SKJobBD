// ======================================================
// Sidebar Menu Navigation
// ======================================================

function scrollToSection(selector) {

    const section = document.querySelector(selector);

    if (section) {

        section.scrollIntoView({

            behavior: "smooth",

            block: "start"

        });

    }

}

// Dashboard

document.getElementById("dashboardBtn")?.addEventListener("click", (e) => {

    e.preventDefault();

    window.scrollTo({

        top: 0,

        behavior: "smooth"

    });

});

// User Management

document.getElementById("usersBtn")?.addEventListener("click", (e) => {

    e.preventDefault();

    scrollToSection("#userList");

});

// Company Management

document.getElementById("companyBtn")?.addEventListener("click", (e) => {

    e.preventDefault();

    scrollToSection("#companyList");

});

// Job Approval

document.getElementById("jobBtn")?.addEventListener("click", (e) => {

    e.preventDefault();

    scrollToSection("#pendingJobList");

});

// Payment

document.getElementById("paymentBtn")?.addEventListener("click", (e) => {

    e.preventDefault();

    scrollToSection("#paymentList");

});

// Notice

document.getElementById("noticeBtn")?.addEventListener("click", (e) => {

    e.preventDefault();

    scrollToSection("#noticeText");

});

// Result

document.getElementById("resultBtn")?.addEventListener("click", (e) => {

    e.preventDefault();

    scrollToSection("#resultList");

});

// Settings

document.getElementById("settingsBtn")?.addEventListener("click", (e) => {

    e.preventDefault();

    scrollToSection(".settingBox");

});
