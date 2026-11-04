```javascript
/* =========================================
   SK JOB BD
   BENGALI & ENGLISH LANGUAGE SYSTEM
   File: language.js
========================================= */

(function () {
    "use strict";

    const STORAGE_KEY = "skjobbd_language";

    function getLanguage() {
        return localStorage.getItem(STORAGE_KEY) || "bn";
    }

    function setLanguage(language) {
        if (language !== "bn" && language !== "en") {
            language = "bn";
        }

        localStorage.setItem(STORAGE_KEY, language);
        applyLanguage(language);
    }

    function applyLanguage(language) {

        document.documentElement.lang = language;

        // Translate page text
        document.querySelectorAll("[data-bn][data-en]").forEach(element => {
            element.textContent =
                language === "en"
                    ? element.getAttribute("data-en")
                    : element.getAttribute("data-bn");
        });

        // Translate placeholders
        document.querySelectorAll("[data-placeholder-bn][data-placeholder-en]").forEach(element => {
            element.placeholder =
                language === "en"
                    ? element.getAttribute("data-placeholder-en")
                    : element.getAttribute("data-placeholder-bn");
        });

        // Translate page title
        const pageTitle = document.querySelector("title");

        if (pageTitle) {
            pageTitle.textContent =
                language === "en"
                    ? "SK Job BD | Career & Education Platform"
                    : "SK Job BD | চাকরি ও শিক্ষা প্ল্যাটফর্ম";
        }

        // Update language button
        document.querySelectorAll("[data-lang]").forEach(button => {
            const active = button.getAttribute("data-lang") === language;

            button.classList.toggle("active-language", active);
            button.setAttribute("aria-pressed", active ? "true" : "false");
        });

        // Notify other scripts
        document.dispatchEvent(
            new CustomEvent("skjobbd-language-change", {
                detail: { language: language }
            })
        );
    }

    // Language button events
    document.addEventListener("click", function (event) {

        const button = event.target.closest("[data-lang]");

        if (!button) return;

        setLanguage(button.getAttribute("data-lang"));
    });

    // Apply saved language on page load
    document.addEventListener("DOMContentLoaded", function () {
        applyLanguage(getLanguage());
    });

    // Public language functions
    window.SKJobBDLanguage = {
        setLanguage: setLanguage,
        getLanguage: getLanguage
    };

})();
```
