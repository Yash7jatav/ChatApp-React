import { arrayRemove, arrayUnion, doc, updateDoc } from "firebase/firestore";
import { useChatStore } from "../../library/chatStore";
import { auth, db } from "../../library/firebase";
import { useUserStore } from "../../library/userStore";
import "./detail.css";

function Detail() {

    const {chatId, user, isCurrentUserBlocked, isReceiverBlocked, changeBlock} = useChatStore();

    const { currentUser } = useUserStore();

    const handleBlock = async () => {
        if(!user) return;

        const userDocRef = doc(db, "users", currentUser.id);

        try{

            await updateDoc(userDocRef, {
                blocked : isReceiverBlocked ? arrayRemove(user.id) : arrayUnion(user.id),
            })
            changeBlock();

        }catch(error){
            console.log(error);
        }
    }

    return (
        <div className="detail">

            <div className="detailofUser">
                <img src={user?.avatar || "./avatar.png"} />
                <h2>{user?.username}</h2>
            </div>

            <div className="info">

                <div className="option">
                    <div className="title">
                        <span>Chat Settings</span>
                        <img src="./arrowUp.png" alt="" />
                    </div>
                </div>

                <div className="option">
                    <div className="title">
                        <span>Privacy & Help</span>
                        <img src="./arrowUp.png" alt="" />
                    </div>
                </div>

                <div className="option">

                    <div className="title">
                        <span>Shared Photos</span>
                        <img src="./arrowDown.png" alt="" />
                    </div>

                        <div className="photos">

                            <div className="photoDetail">

                                <div className="photoItem">
                                    <img src="https://images.unsplash.com/photo-1575361204480-aadea25e6e68?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8Zm9vdGJhbGx8ZW58MHx8MHx8fDA%3D" alt="" />
                                    <span>photo_2024_2.png</span>
                                </div>

                                <img src="./download.png" className="downloadIcon"/>

                            </div> 

                            <div className="photoDetail">

                                <div className="photoItem">
                                    <img src="https://images.unsplash.com/photo-1575361204480-aadea25e6e68?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8Zm9vdGJhbGx8ZW58MHx8MHx8fDA%3D" alt="" />
                                    <span>photo_2024_2.png</span>
                                </div>

                                <img src="./download.png" className="downloadIcon"/>

                            </div> 

                            <div className="photoDetail">

                                <div className="photoItem">
                                    <img src="https://images.unsplash.com/photo-1575361204480-aadea25e6e68?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8Zm9vdGJhbGx8ZW58MHx8MHx8fDA%3D" alt="" />
                                    <span>photo_2024_2.png</span>
                                </div>

                                <img src="./download.png" className="downloadIcon"/>

                            </div> 

                            <div className="photoDetail">

                                <div className="photoItem">
                                    <img src="https://images.unsplash.com/photo-1575361204480-aadea25e6e68?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8Zm9vdGJhbGx8ZW58MHx8MHx8fDA%3D" alt="" />
                                    <span>photo_2024_2.png</span>
                                </div>

                                <img src="./download.png" className="downloadIcon"/>

                            </div> 

                        </div>

                </div>
                    
                <div className="option">
                    <div className="title">
                        <span>Shared Files</span>
                        <img src="./arrowUp.png" alt="" />
                    </div>
                </div>

                <button className="blockBtn" onClick={handleBlock}>
                    {
                    isCurrentUserBlocked ? "You are Blocked!" : isReceiverBlocked ? "User Blocked" : "Block"
                    }
                </button>

                <button className="logoutBtn" onClick={()=>auth.signOut()}>Log Out</button>

            </div>            
        </div>
    )
};

export default Detail;