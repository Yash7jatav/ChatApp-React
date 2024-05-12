import "./chatList.css";
import { useEffect, useState } from "react";
import AddUser from '../adduser/AddUser';
import { doc, getDoc, onSnapshot, updateDoc } from "firebase/firestore";
import { db } from "../../../library/firebase";
import { useUserStore } from "../../../library/userStore";
import { useChatStore } from "../../../library/chatStore";

function ChatList() {

    const [chats, setChats] = useState([]);
    const [addBtn, setAddBtn] = useState(false);
    const [inp, setInp] = useState("");

    const {currentUser} = useUserStore();
    const {chatId, changeChat} = useChatStore();

    console.log(chatId);

    useEffect(() => {
        const unSub = onSnapshot(doc(db, "userchats", currentUser.id), async(res) => {
            const items = res.data().chats;

            const promises = items.map(async(item) => {
                const userDocRef = doc(db, "users", item.receiverId);
                const userDocSnap = await getDoc(userDocRef);

                const user = userDocSnap.data();

                return{...item, user};
            });

            const chatData = await Promise.all(promises)

            setChats(chatData.sort((a, b) => b.updatedAt - a.updatedAt));
        });

        return () => {
            unSub();
        }   
    },[currentUser.id]);

    const handleAddBtn = () => {
        setAddBtn((prev) => !prev);                     //Handling + , - button of the search bar.
    }

    const handleSelect = async(chat) => {
        const userChats = chats.map((item) => {
            const {user, ...rest} = item;
            return rest
        })

        const chatIdx = userChats.findIndex(
            (item) => item.chatId === chat.chatId
        );

        userChats[chatIdx].isSeen = true;

        const userChatsRef = doc(db, "userchats", currentUser.id);

        try{

            await updateDoc(userChatsRef,{
                chats : userChats,
            });

        }catch(error){
            console.log(error);
        }

       changeChat(chat.chatId, chat.user)
    }

    const handleSearchInp = (event) => {
        setInp(event.target.value);
    }

    const filteredChats = chats.filter((chat) => 
        chat.user.username.toLowerCase().includes(inp.toLowerCase())
    );
    
    return (

<div className="chatList">

            <div className="search">
                <div className="searchBar">
                    <img src="./search.png" />
                    <input type="text" placeholder="Search" onChange={handleSearchInp}/>
                </div>
                <img src = {addBtn ? "./minus.png" : "./plus.png"} className="addBtn" onClick={handleAddBtn}/>
            </div>

            {filteredChats.map((chat) => (
                <div className="item" key={chat.chatId} 
                onClick={()=>handleSelect(chat)}
                style={{
                    backgroundColor : chat?.isSeen ? "transparent" : "#5183fe",
                }}
                >
                    <img src=
                        {chat.user.blocked && chat.user.blocked.includes(currentUser.id) 
                        ? "./avatar.png" 
                        : chat.user.avatar || "./avatar.png"
                        }
                    />
                    <div className="texts">
                        <span>
                            {chat.user.blocked && chat.user.blocked.includes(currentUser.id) 
                            ? "User" 
                            : chat.user.username}
                        </span>
                        <p>{chat.lastMessage}</p>
                    </div>
                </div>
            ))}
            
           {addBtn && <AddUser/>}
</div>
    );
};

export default ChatList;
