//======================================
// SK JOB BD
// APPLICATION SYSTEM
// apply.js
//======================================


//======================================
// FIREBASE IMPORT
//======================================

import {
    db
} from "./firebase.js";


import {
    collection,
    addDoc,
    serverTimestamp
} 
from "https://www.gstatic.com/firebasejs/10.13.2/firebase-firestore.js";


//======================================
// GLOBAL VARIABLE
//======================================

const form = document.getElementById("applicationForm");

const today = new Date();


//======================================
// APPLICATION DATE
//======================================

const applicationDate =
document.getElementById("applicationDate");


if(applicationDate){

    applicationDate.value =
    today.toLocaleDateString("en-GB");

}


//======================================
// APPLICATION ID GENERATOR
//======================================

function generateApplicationID(){

    const year =
    today.getFullYear();


    const random =
    Math.floor(
        100000 +
        Math.random()*900000
    );


    return `APP-${year}-${random}`;

}



const applicationId =
document.getElementById("applicationId");



if(applicationId){

    applicationId.value =
    generateApplicationID();

}


//======================================
// TRACKING ID
//======================================

function generateTrackingID(){

    return "TRK" + Date.now();

}



const trackingId =
document.getElementById("applicationTrackingId");



if(trackingId){

    trackingId.value =
    generateTrackingID();

}


//======================================
// PHOTO PREVIEW
//======================================


const photoUpload =
document.getElementById("photoUpload");


const applicantPreview =
document.getElementById("applicantPreview");



if(photoUpload){


    photoUpload.addEventListener(
        "change",
        function(event){


            const file =
            event.target.files[0];


            if(file && applicantPreview){


                applicantPreview.src =
                URL.createObjectURL(file);


            }


        }
    );


}


//======================================
// SAME ADDRESS CHECK
//======================================


const sameAddress =
document.getElementById("sameAddress");



if(sameAddress){


    sameAddress.addEventListener(
        "change",
        function(){


            if(this.checked){


                document.getElementById("permanentCare").value =
                document.getElementById("presentCare").value;



                document.getElementById("permanentVillage").value =
                document.getElementById("presentVillage").value;



                document.getElementById("permanentPostOffice").value =
                document.getElementById("presentPostOffice").value;



                document.getElementById("permanentPostCode").value =
                document.getElementById("presentPostCode").value;



                document.getElementById("permanentUpazila").value =
                document.getElementById("presentUpazila").value;



                document.getElementById("permanentDistrict").value =
                document.getElementById("presentDistrict").value;


            }


        }
    );


}

//======================================
// FORM VALIDATION
//======================================


function validMobile(number){

    const regex =
    /^01[3-9]\d{8}$/;

    return regex.test(number);

}



function validNID(nid){


    if(nid===""){

        return true;

    }


    const regex =
    /^[0-9]{10,17}$/;


    return regex.test(nid);


}



//======================================
// AGE CALCULATION
//======================================


function calculateAge(dob){


    const birth =
    new Date(dob);


    const current =
    new Date();


    let age =
    current.getFullYear()
    -
    birth.getFullYear();



    const month =
    current.getMonth()
    -
    birth.getMonth();



    if(
        month < 0 ||
        (
            month===0 &&
            current.getDate()
            <
            birth.getDate()
        )
    ){

        age--;

    }


    return age;


}




//======================================
// DOB EVENT
//======================================


const dob =
document.getElementById("dob");


if(dob){


    dob.addEventListener(
        "change",
        ()=>{


            const age =
            calculateAge(dob.value);


            console.log(
                "Applicant Age:",
                age
            );


        }
    );


}



//======================================
// REQUIRED CHECK
//======================================


function validateForm(){


    const name =
    document.getElementById("applicantName")
    ?.value
    .trim();



    const father =
    document.getElementById("fatherName")
    ?.value
    .trim();



    const mother =
    document.getElementById("motherName")
    ?.value
    .trim();



    const mobile =
    document.getElementById("mobile")
    ?.value
    .trim();



    const gender =
    document.getElementById("gender")
    ?.value;



    if(!name){


        alert(
            "Applicant Name লিখুন"
        );


        return false;


    }



    if(!father){


        alert(
            "Father Name লিখুন"
        );


        return false;


    }



    if(!mother){


        alert(
            "Mother Name লিখুন"
        );


        return false;


    }



    if(!gender){


        alert(
            "Gender নির্বাচন করুন"
        );


        return false;


    }



    if(!validMobile(mobile)){


        alert(
            "সঠিক মোবাইল নম্বর লিখুন"
        );


        return false;


    }




    const nid =
    document.getElementById("nid")
    ?.value
    .trim();



    if(!validNID(nid)){


        alert(
            "সঠিক NID নম্বর লিখুন"
        );


        return false;


    }



    return true;


}





//======================================
// COLLECT APPLICATION DATA
//======================================


function collectApplicationData(){



    return {


        applicationId:
        document.getElementById("applicationId")
        ?.value || "",



        applicationDate:
        document.getElementById("applicationDate")
        ?.value || "",



        applicantName:
        document.getElementById("applicantName")
        ?.value || "",



        fatherName:
        document.getElementById("fatherName")
        ?.value || "",



        motherName:
        document.getElementById("motherName")
        ?.value || "",



        gender:
        document.getElementById("gender")
        ?.value || "",



        mobile:
        document.getElementById("mobile")
        ?.value || "",



        nid:
        document.getElementById("nid")
        ?.value || "",



        email:
        document.getElementById("email")
        ?.value || "",



        dob:
        document.getElementById("dob")
        ?.value || "",



        createdAt:
        serverTimestamp()


    };


}

//======================================
// PAYMENT CHECK
//======================================


function paymentRequired(){


    const payment =
    document.getElementById("paymentRequired");


    if(!payment){

        return false;

    }


    return payment.value === "true";


}




//======================================
// SAVE APPLICATION TO FIRESTORE
//======================================


async function saveApplication(){



    const data =
    collectApplicationData();



    try{


        const docRef =
        await addDoc(

            collection(
                db,
                "applications"
            ),

            data

        );



        return docRef.id;



    }
    catch(error){


        console.error(
            "Save Error:",
            error
        );


        throw error;


    }


}





//======================================
// SUCCESS MESSAGE
//======================================


function showSuccess(id){


    const box =
    document.getElementById("successMessage");



    if(box){


        box.innerHTML = `

        <div class="success-box">

        <h3>
        আবেদন সফল হয়েছে
        </h3>


        <p>
        Application ID:
        <strong>${id}</strong>
        </p>


        <p>
        আপনার আবেদন সংরক্ষণ করা হয়েছে।
        </p>


        </div>

        `;


        box.style.display =
        "block";


    }
    else{


        alert(
            "আবেদন সফল হয়েছে। ID: "
            + id
        );


    }


}





//======================================
// LOADING
//======================================


function showLoading(){


    const loading =
    document.getElementById(
        "loadingScreen"
    );


    if(loading){

        loading.style.display =
        "block";

    }


}




function hideLoading(){


    const loading =
    document.getElementById(
        "loadingScreen"
    );


    if(loading){

        loading.style.display =
        "none";

    }


}





//======================================
// FORM SUBMIT
//======================================


if(form){



    form.addEventListener(

        "submit",

        async function(e){


            e.preventDefault();



            if(
                !validateForm()
            ){

                return;

            }



            try{


                showLoading();



                const applicationID =
                await saveApplication();



                hideLoading();



                showSuccess(
                    applicationID
                );



                form.reset();



            }
            catch(error){



                hideLoading();



                alert(
                    "আবেদন সংরক্ষণে সমস্যা হয়েছে"
                );



                console.error(error);



            }



        }


    );



}

//======================================
// ADDRESS DATA
//======================================


function collectAddressData(){


    return {


        presentAddress:{


            care:
            document.getElementById("presentCare")
            ?.value || "",


            village:
            document.getElementById("presentVillage")
            ?.value || "",


            postOffice:
            document.getElementById("presentPostOffice")
            ?.value || "",


            postCode:
            document.getElementById("presentPostCode")
            ?.value || "",


            upazila:
            document.getElementById("presentUpazila")
            ?.value || "",


            district:
            document.getElementById("presentDistrict")
            ?.value || ""

        },



        permanentAddress:{


            care:
            document.getElementById("permanentCare")
            ?.value || "",


            village:
            document.getElementById("permanentVillage")
            ?.value || "",


            postOffice:
            document.getElementById("permanentPostOffice")
            ?.value || "",


            postCode:
            document.getElementById("permanentPostCode")
            ?.value || "",


            upazila:
            document.getElementById("permanentUpazila")
            ?.value || "",


            district:
            document.getElementById("permanentDistrict")
            ?.value || ""


        }


    };


}




//======================================
// EDUCATION DATA
//======================================


function collectEducationData(){



    return {


        SSC:{


            board:
            document.getElementById("sscBoard")
            ?.value || "",


            roll:
            document.getElementById("sscRoll")
            ?.value || "",


            registration:
            document.getElementById("sscReg")
            ?.value || "",


            result:
            document.getElementById("sscResult")
            ?.value || "",


            year:
            document.getElementById("sscYear")
            ?.value || ""

        },



        HSC:{


            board:
            document.getElementById("hscBoard")
            ?.value || "",


            roll:
            document.getElementById("hscRoll")
            ?.value || "",


            registration:
            document.getElementById("hscReg")
            ?.value || "",


            result:
            document.getElementById("hscResult")
            ?.value || "",


            year:
            document.getElementById("hscYear")
            ?.value || ""


        },



        Honours:{


            university:
            document.getElementById("honoursUniversity")
            ?.value || "",


            roll:
            document.getElementById("honoursRoll")
            ?.value || "",


            registration:
            document.getElementById("honoursReg")
            ?.value || "",


            result:
            document.getElementById("honoursResult")
            ?.value || "",


            year:
            document.getElementById("honoursYear")
            ?.value || ""


        }


    };


}




//======================================
// JOB INFORMATION
//======================================


function collectJobData(){



    return {


        jobId:
        document.getElementById("jobId")
        ?.value || "",



        jobTitle:
        document.getElementById("jobTitle")
        ?.value || "",



        companyName:
        document.getElementById("companyName")
        ?.value || "",



        jobType:
        document.getElementById("jobType")
        ?.value || ""


    };


}




//======================================
// EXTEND APPLICATION DATA
//======================================


const oldCollectData =
collectApplicationData;



collectApplicationData = function(){



    return {


        ...oldCollectData(),


        address:
        collectAddressData(),



        education:
        collectEducationData(),



        job:
        collectJobData()


    };


};

//======================================
// PDF TEMPLATE CONNECT
//======================================


async function generatePDF(){


    try{


        const data =
        collectApplicationData();



        if(
            window.generateApplicationPDF
        ){


            window.generateApplicationPDF(
                data
            );


        }
        else{


            console.warn(
                "PDF Template not loaded"
            );


        }


    }
    catch(error){


        console.error(
            "PDF Error:",
            error
        );


    }


}




//======================================
// PDF BUTTON
//======================================


const pdfButton =
document.getElementById(
    "downloadPDF"
);



if(pdfButton){


    pdfButton.addEventListener(
        "click",
        generatePDF
    );


}





//======================================
// WEBSITE INFORMATION
//======================================


const websiteURL =
"https://sagorkhanbd.github.io/SKJobBD";



const websiteLink =
document.querySelectorAll(
    ".website-link"
);



websiteLink.forEach(
    item=>{


        item.href =
        websiteURL;


        item.innerText =
        websiteURL;


    }
);





//======================================
// AUTO CURRENT YEAR
//======================================


const yearElements =
document.querySelectorAll(
    ".current-year"
);



yearElements.forEach(
    item=>{


        item.innerText =
        new Date()
        .getFullYear();


    }
);





//======================================
// GLOBAL EXPORT
//======================================


window.SKJobApplication = {


    generateApplicationID,

    generateTrackingID,

    collectApplicationData,

    generatePDF


};



//======================================
// SYSTEM READY
//======================================


console.log(
    "SK Job BD Application System Ready"
);
