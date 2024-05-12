import { useEffect, useRef, useState } from "react";
import "./chat.css";
import EmojiPicker from "emoji-picker-react";                       //Emoji picker react for emojicons in chat
import { arrayUnion, doc, getDoc, onSnapshot, updateDoc } from "firebase/firestore";
import { db } from "../../library/firebase";
import { useChatStore } from "../../library/chatStore";
import { useUserStore } from "../../library/userStore";
import upload from "../../library/upload";
import { serverTimestamp } from "firebase/firestore";

function Chat() {

    const [openemoji, setOpenEmoji] = useState(false);
    const [inpVal, setInpVal] = useState("");
    const [chat, setChat] = useState();
    const {chatId, user, isCurrentUserBlocked, isReceiverBlocked} = useChatStore();
    const {currentUser} = useUserStore();
    const [img, setImg] = useState({
        file : null,
        url : ""
    })

    const endRef = useRef(null);
    useEffect(()=>{
        endRef.current?.scrollIntoView({behaviour : "smooth"});
    },[]);

    useEffect(()=>{
        const unSub = onSnapshot(doc(db, "chats", chatId), (res) => {
            setChat(res.data());
        })

        return () => {
            unSub();
        }

    },[chatId]);

    console.log(chat);                  //console.log(chat);

    const handleInpVal = (event) => {
        setInpVal(event.target.value)   
    }

    const handleEmojiClick = (event) => {
        setInpVal((prev) => prev + event.emoji);
        setOpenEmoji(false);
    }

    const handleImg = (event) => {
        if(event.target.files){
            setImg({
                file : event.target.files[0],
                url : URL.createObjectURL(event.target.files[0])
            })
        }
    }

    const handleSend = async() =>{
        if(inpVal === ""){
            return;
        }

        let imgUrl = null;

        try{

            if(img.file){
                imgUrl = await upload(img.file);
            }


            await updateDoc(doc(db, "chats", chatId),{
            messages:arrayUnion({
                senderId : currentUser.id,
                inpVal,
                createdAt : new Date(),
                ...(imgUrl && {img : imgUrl}),
            })
          });

        const userIDs = [currentUser.id, user.id];  

        userIDs.forEach(async(id) => {
            const userChatsRef = doc(db, "userchats", id)
            const userChatsSnapshot = await getDoc(userChatsRef)
    
            if(userChatsSnapshot.exists()){
                const userChatsData = userChatsSnapshot.data()
                const chatIdx = userChatsData.chats.findIndex(
                    (c) => c.chatId === chatId
                );
                userChatsData.chats[chatIdx].lastMessage = inpVal;
                userChatsData.chats[chatIdx].isSeen = 
                id === currentUser.id ? true : false;
                userChatsData.chats[chatIdx].updatedAt = Date.now();
    
                await updateDoc(userChatsRef,{
                    chats : userChatsData.chats,
                });
            };
        });

        }catch(error){
            console.log(error);
        }

        setImg({
            file : null,
            url : ""
        })

        setInpVal("");
    }

    return (
        <div className="chat"> 

            <div className="chatTop">
                <div className="chatuserInfo">
                    <img src={user?.avatar || "./avatar.png"} />
                    <div className="chatTexts">
                        <span>{user?.username}</span>
                    </div>
                </div>
                <div className="chatIcons">
                    <img src="./phone.png" />
                    <img src="./video.png" />
                    <img src="./info.png" />
                </div>
            </div>

            <div className="chatCenter">

            {
                chat?.messages?.map((message) => (
                <div className={message.senderId === currentUser?.id ? "message own" : "message"}>
                    <div className="messageTexts">
                        {message.img && <img 
                        src={message.img} 
                    />}
                    <p>{message.inpVal}</p>
                    <span className="chatTime">{message.createdAt && `${new Date(message.createdAt.toDate()).toLocaleDateString()} ${new Date(message.createdAt.toDate()).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`}</span>
                    </div>
                </div>
            ))}  

            {img.url && 
            (
            <div className="message own">
                <div className="messageTexts">
                    <img src={img.url} alt="" />
                </div>
            </div>
            )}

            <div ref={endRef}></div>

            </div>

            <div className="chatBottom">                       

                <div className="chatBottomIcons">
                    <label htmlFor="file">
                    <img src="./img.png" />
                    </label>
                    <input type="file" id="file" style={{display : "none"}} onChange={handleImg}/>
                    <img src="./camera.png" />
                    <img src="./mic.png" />
                </div>

                <input type="text" 
                placeholder={(isCurrentUserBlocked || isReceiverBlocked) ? "You cannot send the message" : "Type a message..."}
                className="chatMsgInput"
                value={inpVal}
                onChange={handleInpVal}
                disabled={isCurrentUserBlocked || isReceiverBlocked}
                />

                <div className="chatEmoji">
                    <img src="./emoji.png" onClick={() => setOpenEmoji((prev) => !prev)}/>
                    <div className="chatEmojiPicker">
                    <EmojiPicker open = {openemoji} onEmojiClick={handleEmojiClick}/>
                    </div>
                </div>

                <button className="chatBtn" onClick={handleSend} 
                disabled={isCurrentUserBlocked || isReceiverBlocked}>
                    Send
                </button>

            </div>

        </div>
    )
};

export default Chat;