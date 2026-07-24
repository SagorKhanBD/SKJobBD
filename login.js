import { db } from "./firebase.js";


import {

    collection,
    query,
    where,
    getDocs

} from "https://www.gstatic.com/firebasejs/10.13.2/firebase-firestore.js";



const form = document.getElementById("loginForm");

const message = document.getElementById("message");



form.addEventListener("submit", async (e)=>{


    e.preventDefault();


    message.innerHTML = "";



    const mobile = 
    document.getElementById("mobile").value.trim();



    const password = 
    document.getElementById("password").value;




    if(mobile === "" || password === ""){


        message.innerHTML =
        "❌ মোবাইল নম্বর এবং Password লিখুন।";


        return;

    }





    try{


        const q = query(

            collection(db,"users"),

            where("mobile","==",mobile)

        );



        const snapshot = await getDocs(q);




        if(snapshot.empty){


            message.innerHTML =
            "❌ এই মোবাইল নম্বরে কোনো Account নেই।";


            return;

        }




        const userData = snapshot.docs[0].data();





        if(userData.password !== password){


            message.innerHTML =
            "❌ ভুল Password।";


            return;


        }




        if(userData.status !== "approved"){


            message.innerHTML =
            "⏳ আপনার Account এখনো Admin Approval Pending আছে।";


            return;


        }





        // Save Login User


        localStorage.setItem(

            "loginUser",

            JSON.stringify(userData)

        );



        message.innerHTML =
        "✅ Login Successful...";




        setTimeout(()=>{


            window.location.href =
            "dashboard.html";


        },1000);




    }


    catch(error){


        console.error(error);


        message.innerHTML =
        "❌ Error: " + error.message;


    }



});
