//======================================
// SK JOB BD
// COMPANY PROFILE
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
// LOAD COMPANY PROFILE
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


const companyRef =
doc(

db,

"companies",

uid

);



const companySnap =
await getDoc(companyRef);



if(companySnap.exists()){


const data =
companySnap.data();



document.getElementById(
"companyName"
).innerText =
data.companyName || "Company";



document.getElementById(
"companyEmail"
).innerText =
user.email;



document.getElementById(
"companyMobile"
).innerText =
data.mobile || "";



document.getElementById(
"companyType"
).innerText =
data.companyType || "";



document.getElementById(
"companyAddress"
).innerText =
data.address || "";



document.getElementById(
"companyStatus"
).innerText =
data.status || "Pending";



}

else{


alert(
"Company Profile পাওয়া যায়নি"
);


}



}

catch(error){


console.error(error);


}



}

);




//======================================
// LOGOUT
//======================================


document
.getElementById(
"logoutBtn"
)

.addEventListener(

"click",

async()=>{


await signOut(auth);


window.location.href =
"login.html";


}

);
