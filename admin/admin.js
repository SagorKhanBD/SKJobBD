import { db } from "../firebase.js";


import {

    collection,
    getDocs,
    updateDoc,
    deleteDoc,
    doc,
    orderBy,
    query

} from "https://www.gstatic.com/firebasejs/10.13.2/firebase-firestore.js";



const userList = document.getElementById("userList");




// Load Users

async function loadUsers(){


    userList.innerHTML = "Loading Users...";



    try{


        const q = query(

            collection(db,"users"),

            orderBy("createdAt","desc")

        );



        const snapshot = await getDocs(q);



        userList.innerHTML = "";



        if(snapshot.empty){


            userList.innerHTML =
            "<p>কোন User পাওয়া যায়নি।</p>";


            return;


        }




        snapshot.forEach((item)=>{


            const user = item.data();

            const id = item.id;




            userList.innerHTML += `


            <div class="user-card">


            <p>
            <strong>নাম:</strong>
            ${user.name}
            </p>



            <p>
            <strong>মোবাইল:</strong>
            ${user.mobile}
            </p>



            <p>
            <strong>Account Type:</strong>
            ${user.accountType}
            </p>



            <p>
            <strong>প্রতিষ্ঠান:</strong>
            ${user.institution}
            </p>



            <p>
            <strong>Status:</strong>
            ${user.status}
            </p>



            <button 
            class="approve"
            onclick="approveUser('${id}')">

            ✅ Approve

            </button>




            <button 
            class="delete"
            onclick="deleteUser('${id}')">

            🗑 Delete

            </button>



            </div>


            `;



        });



    }


    catch(error){


        console.error(error);


        userList.innerHTML =
        "❌ Error: "+error.message;


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


        alert(error.message);


    }


};





// Delete User


window.deleteUser = async function(id){


    const confirmDelete =
    confirm("আপনি কি এই User Delete করতে চান?");



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


        alert(error.message);


    }


};





// Start

loadUsers();
