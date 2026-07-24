// SK BD Dashboard JS


const userData = localStorage.getItem("loginUser");


// Login না থাকলে Login Page

if(!userData){

    window.location.href = "login.html";

}


// User Data Parse

const user = JSON.parse(userData);




// Show User Information


document.getElementById("name").innerText =
user.name || "N/A";


document.getElementById("mobile").innerText =
user.mobile || "N/A";


document.getElementById("accountType").innerText =
user.accountType || "N/A";


document.getElementById("institution").innerText =
user.institution || "N/A";


document.getElementById("email").innerText =
user.email || "Not Provided";


document.getElementById("status").innerText =
user.status || "Pending";




// Logout Function


window.logout = function(){


    localStorage.removeItem("loginUser");


    window.location.href = "login.html";


}




// Home Button


window.goHome = function(){


    window.location.href = "index.html";


}




// My Applications


window.myJobs = function(){


    alert("My Applications System Coming Soon");


}




// Edit Profile


window.editProfile = function(){


    alert("Profile Edit System Coming Soon");


}
