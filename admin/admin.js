import { db } from "../firebase.js";


import {

    collection,
    getDocs,
    updateDoc,
    deleteDoc,
    doc

} from "https://www.gstatic.com/firebasejs/10.13.2/firebase-firestore.js";



const userList = document.getElementById("userList");




// Load All Users

async function loadUsers(){


    try{


        userList.innerHTML = "⏳ Loading Users...";



        const usersSnapshot = await getDocs(
            collection(db,"users")
        );



        userList.innerHTML = "";




        if(usersSnapshot.empty){


            userList.innerHTML =
            "<h3>কোন User পাওয়া যায়নি</h3>";


            return;

        }





        usersSnapshot.forEach((userDoc)=>{


            const user = userDoc.data();

            const userId = userDoc.id;




            const card = document.createElement("div");


            card.className = "user-card";



            card.innerHTML = `


            <p>
            <strong>নাম:</strong>
            ${user.name || ""}
            </p>



            <p>
            <strong>মোবাইল:</strong>
            ${user.mobile || ""}
            </p>



            <p>
            <strong>Account Type:</strong>
            ${user.accountType || ""}
            </p>



            <p>
            <strong>প্রতিষ্ঠান:</strong>
            ${user.institution || ""}
            </p>



            <p>
            <strong>Email:</strong>
            ${user.email || "নেই"}
            </p>



            <p>
            <strong>Status:</strong>
            ${user.status || "pending"}
            </p>



            <button 
            class="approve"
            onclick="approveUser('${userId}')">

            ✅ Approve

            </button>



            <button 
            class="delete"
            onclick="deleteUser('${userId}')">

            🗑 Delete

            </button>



            `;



            userList.appendChild(card);



        });



    }


    catch(error){


        console.error(error);


        userList.innerHTML =

        `
        <h3>
        ❌ Error
        </h3>

        <p>
        ${error.message}
        </p>
        `;


    }



}





// Approve User


window.approveUser = async function(id){



    try{


        await updateDoc(

            doc(db,"users",id),

            {

                status:"approved"

            }

        );



        alert("✅ User Approved");


        loadUsers();



    }


    catch(error){


        alert(
            "Error: "+error.message
        );


    }



}





// Delete User


window.deleteUser = async function(id){



    let confirmDelete = confirm(

        "আপনি কি এই User Delete করতে চান?"

    );



    if(!confirmDelete){

        return;

    }





    try{


        await deleteDoc(

            doc(db,"users",id)

        );



        alert("🗑 User Deleted");


        loadUsers();



    }


    catch(error){


        alert(
            "Error: "+error.message
        );


    }



}





// Start

loadUsers();
