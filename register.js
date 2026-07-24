import { db } from "./firebase.js";


import {

    collection,
    query,
    where,
    getDocs,
    addDoc,
    serverTimestamp

} from "https://www.gstatic.com/firebasejs/10.13.2/firebase-firestore.js";



const form = document.getElementById("registerForm");

const message = document.getElementById("message");



form.addEventListener("submit", async (e)=>{


    e.preventDefault();


    message.innerHTML = "";



    const accountType =
    document.getElementById("accountType").value.trim();


    const name =
    document.getElementById("name").value.trim();


    const mobile =
    document.getElementById("mobile").value.trim();


    const institution =
    document.getElementById("institution").value.trim();


    const institutionCode =
    document.getElementById("institutionCode").value.trim();


    const email =
    document.getElementById("email").value.trim();


    const password =
    document.getElementById("password").value;


    const confirmPassword =
    document.getElementById("confirmPassword").value;




    // Required Check

    if(
        accountType === "" ||
        name === "" ||
        mobile === "" ||
        institution === "" ||
        password === "" ||
        confirmPassword === ""
    ){

        message.innerHTML =
        "❌ সকল বাধ্যতামূলক তথ্য পূরণ করুন।";

        return;

    }



    // Mobile Check

    if(!/^01[0-9]{9}$/.test(mobile)){


        message.innerHTML =
        "❌ সঠিক ১১ সংখ্যার মোবাইল নম্বর দিন।";


        return;

    }




    // Password Check

    if(password.length < 8){


        message.innerHTML =
        "❌ Password কমপক্ষে ৮ অক্ষরের হতে হবে।";


        return;

    }




    if(password !== confirmPassword){


        message.innerHTML =
        "❌ Password মিলছে না।";


        return;

    }




    try{


        // Duplicate Mobile Check


        const q = query(

            collection(db,"users"),

            where("mobile","==",mobile)

        );



        const snapshot = await getDocs(q);



        if(!snapshot.empty){


            message.innerHTML =
            "❌ এই মোবাইল নম্বর দিয়ে ইতোমধ্যে Account আছে।";


            return;


        }




        // Save User


        await addDoc(

            collection(db,"users"),

            {


                accountType:accountType,

                name:name,

                mobile:mobile,

                institution:institution,

                institutionCode:institutionCode,

                email:email,

                password:password,


                status:"pending",

                role:"user",


                createdAt:serverTimestamp()


            }


        );





        message.innerHTML =

        "✅ Registration Successful. Admin Approval Pending.";



        form.reset();



    }


    catch(error){


        console.error(error);


        message.innerHTML =

        "❌ Error: " + error.message;



    }



});
