import { auth, db } from "./firebase.js";


import {
createUserWithEmailAndPassword
}
from 
"https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";



import {

doc,
setDoc

}

from

"https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";







window.registerUser = async function(){



let type =
document.getElementById("accountType").value;



let name =
document.getElementById("name").value;



let mobile =
document.getElementById("mobile").value;



let email =
document.getElementById("email").value;



let institution =
document.getElementById("institution").value;



let institutionCode =
document.getElementById("institutionCode").value;



let password =
document.getElementById("password").value;





if(password.length < 8){

document.getElementById("message").innerHTML =
"❌ Password কমপক্ষে ৮ ডিজিট হতে হবে";

return;

}





try{


const userCredential =
await createUserWithEmailAndPassword(
auth,
email,
password
);



const user =
userCredential.user;




await setDoc(
doc(db,"users",user.uid),
{


name:name,

mobile:mobile,

email:email,

accountType:type,

institution:institution,

institutionCode:institutionCode,

status:"pending",

createdAt:new Date()


}

);




document.getElementById("message").innerHTML=
"✅ Registration Successful";



}


catch(error){


document.getElementById("message").innerHTML=
"❌ "+error.message;


}



}
