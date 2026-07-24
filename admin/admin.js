import { db } from "../firebase.js";

import {
    collection,
    getDocs
} from "https://www.gstatic.com/firebasejs/10.13.2/firebase-firestore.js";


const userList = document.getElementById("userList");


userList.innerHTML = "NEW ADMIN JS LOADED";


async function testUsers(){

    const snapshot = await getDocs(
        collection(db,"users")
    );


    userList.innerHTML = 
    "Total User: " + snapshot.size;


}


testUsers();
