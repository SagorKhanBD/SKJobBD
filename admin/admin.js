import { db } from "../firebase.js";

import {
    collection,
    getDocs
} from "https://www.gstatic.com/firebasejs/10.13.2/firebase-firestore.js";


const userList = document.getElementById("userList");


async function testUsers(){


    try{


        userList.innerHTML = "Connecting Firestore...";


        const snapshot = await getDocs(
            collection(db,"users")
        );


        console.log("Total Users:", snapshot.size);


        userList.innerHTML = "";


        if(snapshot.empty){

            userList.innerHTML =
            "<h3>কোন User পাওয়া যায়নি</h3>";

            return;
        }



        snapshot.forEach((doc)=>{


            let data = doc.data();


            userList.innerHTML += `

            <div class="user-card">

            <h3>${data.name}</h3>

            <p>Mobile: ${data.mobile}</p>

            <p>Status: ${data.status}</p>

            </div>

            `;


        });



    }

    catch(error){


        console.error(error);


        userList.innerHTML =

        `
        <h3>❌ Error</h3>
        <p>${error.message}</p>
        `;


    }


}



testUsers();
