/*
================================================
SK Job BD
Main JavaScript
Version 2.0
================================================
*/


"use strict";


// ===============================================
// Website Loaded
// ===============================================

document.addEventListener(
"DOMContentLoaded",
function(){


console.log(
"✅ SK Job BD Website Loaded"
);



// Footer Year Update

let year =
document.getElementById("year");


if(year){

    year.innerHTML =
    new Date().getFullYear();

}



});




// ===============================================
// Language System Ready
// ===============================================


function changeLanguage(language){


console.log(
"Selected Language:",
language
);


// Future Translation System
// এখানে পরে বাংলা/English/हिन्दी পরিবর্তন যুক্ত হবে


}



window.changeLanguage =
changeLanguage;





// ===============================================
// Search Function
// ===============================================


function searchJob(){


let search =
document.querySelector(".hero input").value;



if(search===""){


alert(
"Please enter job name / চাকরির নাম লিখুন"
);


return;


}



console.log(
"Searching:",
search
);


// Future Firebase Job Search Here


}



window.searchJob =
searchJob;





// ===============================================
// Message Function
// ===============================================


function showMessage(message){


alert(message);


}


window.showMessage =
showMessage;
