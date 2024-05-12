import { arrayUnion, collection, doc, getDocs, query, serverTimestamp, setDoc, updateDoc, where } from "firebase/firestore";
import "./addUser.css";
import { db } from "../../../library/firebase";
import { useState } from "react";
import { useUserStore } from "../../../library/userStore";

function AddUser() {

    const [user, setUser] = useState(null);

    const {currentUser} = useUserStore();

    const handleSearch = async (event) => {
        event.preventDefault();
        const formData = new FormData(event.target);
        const username = formData.get("username");

        try{
            const userRef = collection(db, "users");

            const q = query(userRef, where("username", "==", username));

            const querySnapShot = await getDocs(q);

            if(!querySnapShot.empty) {
                setUser(querySnapShot.docs[0].data());
            }

        }catch(error){
            console.log(error);
        }
    }

    const handleAdd = async() => {

        const chatRef = collection(db, "chats");
        const userChatsRef = collection(db, "userchats");

        try{

            const newChatRef = doc(chatRef);

            await setDoc(newChatRef, {
                createdAt : serverTimestamp(),
                messages : [],
            });

            await updateDoc(doc(userChatsRef, user.id), {
                chats : arrayUnion({
                    chatId : newChatRef.id,
                    lastMessage : "",
                    receiverId : currentUser.id,
                    updatedAt : Date.now(),
                }),
            });

            await updateDoc(doc(userChatsRef, currentUser.id), {
                chats : arrayUnion({
                    chatId : newChatRef.id,
                    lastMessage : "",
                    receiverId : user.id,
                    updatedAt : Date.now(),
                }),
            });

        }catch(error){
            console.log(error.message);
        }
    };

    return (
        <div className="addUser">

            <form onSubmit={handleSearch}>
                <input type="text" placeholder="Enter Username" name="username" />
                <button>Search</button>
            </form>
            {
                user && 
                <div className="user2">
                    <div className="userDetail">
                        <img src={user.avatar || "./avatar.png"} />
                        <span>{user.username}</span>
                    </div>
                    <button onClick={handleAdd}>Add User</button>
                </div>
            } 

        </div>
    ) 
}

export default AddUser;

