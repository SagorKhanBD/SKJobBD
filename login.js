import { auth, db } from "./firebase.js";


import {

signInWithEmailAndPassword

}

from

"https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";



import {

doc,
getDoc

}

from

"https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";





window.loginUser = async function(){



const email =
document.getElementById("email").value;



const password =
document.getElementById("password").value;



const message =
document.getElementById("message");





if(!email || !password){

message.innerHTML =
"❌ Email এবং Password দিন";

return;

}







try{


const userCredential =

await signInWithEmailAndPassword(

auth,

email,

password

);




const user = userCredential.user;





const userDoc = await getDoc(

doc(db,"users",user.uid)

);






if(userDoc.exists()){



const data = userDoc.data();



message.innerHTML =
"✅ Login Successful";






// Admin

if(data.accountType === "admin"){


window.location.href =
"admin/admin.html";


}





// Company

else if(data.accountType === "company"){


window.location.href =
"company/dashboard.html";


}





// Candidate

else if(data.accountType === "candidate"){


window.location.href =
"candidate/dashboard.html";


}





// School

else if(data.accountType === "school"){


window.location.href =
"school/dashboard.html";


}





else{


message.innerHTML =
"⚠️ Account Type পাওয়া যায়নি";


}




}

else{


message.innerHTML =
"❌ User Data পাওয়া যায়নি";


}



}



catch(error){



message.innerHTML =
"❌ Login Failed: "+error.message;



}



}
