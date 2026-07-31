//======================================
// SK JOB BD
// LOGIN SYSTEM
//======================================


//======================================
// FIREBASE IMPORT
//======================================


import {
    auth
}
from "./firebase.js";


import {

    signInWithEmailAndPassword,

    onAuthStateChanged,

    signOut

}
from "https://www.gstatic.com/firebasejs/10.13.2/firebase-auth.js";




//======================================
// LOGIN FORM
//======================================


const loginForm =
document.getElementById("loginForm");




//======================================
// IF ALREADY LOGIN
//======================================


onAuthStateChanged(
    
    auth,

    (user)=>{


        if(user){


            const page =
            window.location.pathname;



            if(
                page.includes("login.html")
            ){


                window.location.href =
                "profile.html";


            }


        }


    }

);





//======================================
// LOGIN SUBMIT
//======================================


if(loginForm){


loginForm.addEventListener(

"submit",

async function(e){


e.preventDefault();




const email =
document.getElementById("email")
.value
.trim();



const password =
document.getElementById("password")
.value
.trim();





if(
email === "" ||
password === ""
){


alert(
"Email এবং Password লিখুন"
);


return;


}




try{


const userCredential =

await signInWithEmailAndPassword(

auth,

email,

password

);



const user =
userCredential.user;



console.log(
"Login User:",
user.email
);





alert(
"Login Successful"
);





//=============================
// PROFILE REDIRECT
//=============================


window.location.href =
"profile.html";





}

catch(error){



console.error(
error
);



if(
error.code ===
"auth/invalid-credential"
){


alert(
"Email অথবা Password ভুল"
);


}

else if(
error.code ===
"auth/user-not-found"
){


alert(
"এই Email দিয়ে কোনো Account নেই"
);


}

else if(
error.code ===
"auth/wrong-password"
){


alert(
"Password ভুল"
);


}

else{


alert(
"Login সমস্যা হয়েছে"
);


}



}



}


);


}





//======================================
// LOGOUT FUNCTION
//======================================


window.logoutUser = async function(){


try{


await signOut(auth);



window.location.href =
"login.html";



}

catch(error){


console.error(error);


}



};




//======================================
// READY
//======================================


console.log(
"SK Job BD Login System Ready"
);
