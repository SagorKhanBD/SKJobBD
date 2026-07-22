/*
=========================================
SK Job BD
Global Configuration
Version: 2.0
=========================================
*/

const CONFIG = {

    // Website Information
    WEBSITE_NAME: "SK Job BD",
    WEBSITE_TITLE: "SK Job BD - Career & Education Platform",
    WEBSITE_URL: "https://sagorkhanbd.github.io/SKJobBD",

    // Languages
    DEFAULT_LANGUAGE: "bn",

    LANGUAGES: [
        {
            code: "bn",
            name: "বাংলা"
        },
        {
            code: "en",
            name: "English"
        },
        {
            code: "hi",
            name: "हिन्दी"
        }
    ],

    // Country
    COUNTRY: "Bangladesh",
    CURRENCY: "BDT",
    CURRENCY_SYMBOL: "৳",

    // Business Rules
    TRIAL_PERIOD_DAYS: 365,
    FIRST_YEAR_COMMISSION: 5,
    VAT_PERCENT: 2,
    RENEWAL_COMMISSION: 7,
    SUBSCRIPTION_FEE: 1025,
    MINIMUM_WITHDRAW: 10,

    // Contact
    MANAGING_DIRECTOR: "Rokunuzzaman",
    MOBILE: "+8801794917925",
    EMAIL: "sagorkhan251996@gmail.com"

};

window.CONFIG = CONFIG;
