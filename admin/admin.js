import { auth, db } from "../firebase.js";


import {

onAuthStateChanged,
signOut

}

from

"https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";



import {

collection,
addDoc,
getDocs,
query,
where,
serverTimestamp

}

from

"https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";




// Section Control

window.showSection = function(id){


let sections =
document.querySelectorAll(".section");


sections.forEach(section=>{

section.classList.add("hidden");

});



document.getElementById(id)
.classList.remove("hidden");


};






// Admin Check


onAuthStateChanged(auth, async(user)=>{


if(!user){


alert("Please Login First");


window.location.href="../login.html";


return;

}



console.log("Admin Login:",user.email);



loadDashboard();

loadUsers();

loadCompanies();

loadJobs();



});







// Logout


window.logout=function(){


signOut(auth)
.then(()=>{


window.location.href="../login.html";


});


}







// Add Job


window.addJob = async function(){



let title =
document.getElementById("jobTitle").value;



let company =
document.getElementById("jobCompany").value;



let description =
document.getElementById("jobDescription").value;



let deadline =
document.getElementById("jobDeadline").value;





if(!title || !company){


alert("Job Title এবং Company দিন");


return;

}






try{


await addDoc(

collection(db,"jobs"),

{


title:title,

company:company,

description:description,

deadline:deadline,

status:"approved",

createdAt:serverTimestamp()


}


);



alert("✅ Job Added Successfully");



loadJobs();


}



catch(error){


alert(error.message);


}



}









// Load Jobs


async function loadJobs(){



const list =
document.getElementById("jobList");



if(!list) return;



list.innerHTML="";



const snapshot =
await getDocs(collection(db,"jobs"));



let count=0;



snapshot.forEach(doc=>{


count++;



let data=doc.data();



list.innerHTML += `


<div class="card">


<h3>${data.title}</h3>


<p>
${data.company}
</p>


<p>
Deadline: ${data.deadline}
</p>


</div>


`;



});



let total =
document.getElementById("totalJobs");


if(total)

total.innerHTML=count;



}









// Load Users


async function loadUsers(){



const list =
document.getElementById("userList");



if(!list) return;



list.innerHTML="";



const snapshot =
await getDocs(collection(db,"users"));



let count=0;



snapshot.forEach(doc=>{


count++;


let data=doc.data();



list.innerHTML += `


<div class="card">


<h3>${data.name}</h3>


<p>
${data.mobile}
</p>


<p>
Type: ${data.accountType}
</p>


</div>


`;



});




let total =
document.getElementById("totalUsers");

if(total)

total.innerHTML=count;



}









// Load Companies


async function loadCompanies(){



const list =
document.getElementById("companyList");



if(!list) return;



list.innerHTML="";



const q =
query(

collection(db,"users"),

where("accountType","==","company")

);



const snapshot =
await getDocs(q);



let count=0;



snapshot.forEach(doc=>{


count++;


let data=doc.data();



list.innerHTML += `


<div class="card">


<h3>
${data.institution}
</h3>


<p>
${data.mobile}
</p>


</div>


`;



});





let total =
document.getElementById("totalCompany");


if(total)

total.innerHTML=count;



}









// Dashboard Load


async function loadDashboard(){


loadUsers();

loadCompanies();

loadJobs();


}
