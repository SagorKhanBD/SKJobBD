//======================================
// SK JOB BD
// EDUCATION PROFILE SYSTEM
//======================================


import {

auth,

db

}

from "./firebase.js";



import {

onAuthStateChanged,

signOut

}

from "https://www.gstatic.com/firebasejs/10.13.2/firebase-auth.js";



import {

doc,

getDoc

}

from "https://www.gstatic.com/firebasejs/10.13.2/firebase-firestore.js";




//======================================
// LOAD EDUCATION PROFILE
//======================================


onAuthStateChanged(

auth,

async(user)=>{


if(!user){


window.location.href =
"login.html";


return;


}



const uid =
user.uid;



try{


const instituteRef =

doc(

db,

"educationInstitutes",

uid

);



const instituteSnap =

await getDoc(
instituteRef
);



if(instituteSnap.exists()){


const data =
instituteSnap.data();



document.getElementById(
"instituteName"
)
.innerText =

data.instituteName || "Education Institute";




document.getElementById(
"instituteEmail"
)
.innerText =

user.email;




document.getElementById(
"instituteMobile"
)
.innerText =

data.mobile || "";




document.getElementById(
"instituteType"
)
.innerText =

data.instituteType || "";




document.getElementById(
"instituteAddress"
)
.innerText =

data.address || "";




document.getElementById(
"resultStatus"
)
.innerText =

data.resultSystem || "Not Active";




document.getElementById(
"accountStatus"
)
.innerText =

data.status || "Pending";



}

else{


alert(
"Education Institute Profile পাওয়া যায়নি"
);


}



}

catch(error){


console.error(
"Profile Error:",
error
);


}



}


);




//======================================
// LOGOUT
//======================================


const logoutBtn =

document.getElementById(
"logoutBtn"
);



if(logoutBtn){


logoutBtn.addEventListener(

"click",

async()=>{


await signOut(auth);


window.location.href =
"login.html";


}

);


}
