/*
================================================
SK Job BD
Admin Panel Logic
Version 1.0
================================================
*/


import { 
    ref,
    push,
    set,
    onValue,
    get
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-database.js";


import { 
    signInWithEmailAndPassword
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";




// ==========================================
// Admin Login
// ==========================================


window.adminLogin = function(){


let email =
document.getElementById("adminEmail").value;


let password =
document.getElementById("adminPassword").value;



signInWithEmailAndPassword(
    auth,
    email,
    password
)


.then(()=>{


document.getElementById("loginMessage")
.innerHTML =
"✅ Login Successful";


})


.catch((error)=>{


document.getElementById("loginMessage")
.innerHTML =
"❌ Login Failed";


console.log(error);


});


};







// ==========================================
// Add Job
// ==========================================


window.addJob = function(){


let title =
document.getElementById("jobTitle").value;


let company =
document.getElementById("company").value;


let description =
document.getElementById("description").value;


let deadline =
document.getElementById("deadline").value;


let applyLink =
document.getElementById("applyLink").value;




if(
title==="" ||
company===""
){


alert(
"Job Title এবং Company Name প্রয়োজন"
);


return;


}



let jobID =
push(jobsRef).key;



let jobData = {


id: jobID,


title:title,


company:company,


description:description,


deadline:deadline,


applyLink:applyLink,


status:"active",


createdAt:
new Date().toISOString()



};





set(
ref(database,"jobs/"+jobID),
jobData

)


.then(()=>{


document.getElementById("message")
.innerHTML =
"✅ Job Added Successfully";



clearJobForm();



})


.catch((error)=>{


console.log(error);


alert(
"Job Add Failed"
);


});



};







// ==========================================
// Clear Form
// ==========================================


function clearJobForm(){


document.getElementById("jobTitle").value="";


document.getElementById("company").value="";


document.getElementById("description").value="";


document.getElementById("deadline").value="";


document.getElementById("applyLink").value="";


}







// ==========================================
// Load Jobs
// ==========================================


function loadJobs(){


onValue(
jobsRef,
(snapshot)=>{


let list =
document.getElementById("jobList");


let count =
document.getElementById("jobCount");



list.innerHTML="";


let total=0;



snapshot.forEach(
(child)=>{


total++;


let job =
child.val();



list.innerHTML += `

<div class="job">


<h3>
${job.title}
</h3>


<p>
🏢 ${job.company}
</p>


<p>
📅 Deadline:
${job.deadline}
</p>


<p>
${job.description}
</p>


</div>

`;



});


if(count){

count.innerHTML=total;

}



}

);



}






// ==========================================
// Dashboard Count
// ==========================================


function loadDashboard(){


onValue(
companiesRef,
(snapshot)=>{


let count =
document.getElementById("companyCount");


if(count){

count.innerHTML =
snapshot.size || 0;

}


}

);





onValue(
applicationsRef,
(snapshot)=>{


let count =
document.getElementById("applicationCount");


if(count){

count.innerHTML =
snapshot.size || 0;

}


}

);


}







// Start


document.addEventListener(
"DOMContentLoaded",
()=>{


loadJobs();


loadDashboard();


console.log(
"✅ Admin Panel Ready"
);


});
