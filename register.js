import { auth, db } from "./firebase.js";

import {
  createUserWithEmailAndPassword
} from "https://www.gstatic.com/firebasejs/10.13.2/firebase-auth.js";

import {
  doc,
  setDoc,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.13.2/firebase-firestore.js";

window.registerUser = async function () {

    const type = document.getElementById("accountType").value;
    const name = document.getElementById("name").value.trim();
    const mobile = document.getElementById("mobile").value.trim();
    const email = document.getElementById("email").value.trim();
    const institution = document.getElementById("institution").value.trim();
    const institutionCode = document.getElementById("institutionCode").value.trim();
    const password = document.getElementById("password").value;

    const message = document.getElementById("message");

    message.innerHTML = "";

    if(type===""){
        message.innerHTML="❌ Account Type নির্বাচন করুন";
        return;
    }

    if(name===""){
        message.innerHTML="❌ নাম লিখুন";
        return;
    }

    if(mobile===""){
        message.innerHTML="❌ মোবাইল নম্বর লিখুন";
        return;
    }

    if(email===""){
        message.innerHTML="❌ Email লিখুন";
        return;
    }

    if(password.length<8){
        message.innerHTML="❌ Password কমপক্ষে ৮ অক্ষরের হতে হবে";
        return;
    }

    try{

        const userCredential = await createUserWithEmailAndPassword(
            auth,
            email,
            password
        );

        const user=userCredential.user;

        await setDoc(doc(db,"users",user.uid),{

            uid:user.uid,
            accountType:type,
            name:name,
            mobile:mobile,
            email:email,
            institution:institution,
            institutionCode:institutionCode,

            status:"pending",

            createdAt:serverTimestamp()

        });

        message.innerHTML="✅ Registration Successful";

        setTimeout(()=>{
            window.location.href="login.html";
        },1500);

    }

    catch(error){

        console.error(error);

        message.innerHTML="❌ "+error.code;

    }

}
