import { useState } from "react";
import "./login.css";
import { toast } from "react-toastify";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "../../library/firebase";
import { doc, setDoc } from "firebase/firestore";
import upload from "../../library/upload";

function Login() {

    const [avatarImg, setAvatarImg] = useState({
        file : null,
        url : ""
    })

    const [loading, setLoading] = useState(false);

    const handleAvatarImg = (event) => {
        if(event.target.files){
            setAvatarImg({
                file : event.target.files[0],
                url : URL.createObjectURL(event.target.files[0])
            })
        }
    }

    const handleRegister = async (event) => {

        event.preventDefault();
        setLoading(true);
        const formData = new FormData(event.target);
        const { username, email, password } = Object.fromEntries(formData);
        try{

            const res = await createUserWithEmailAndPassword(auth, email, password);

            const imgUrl = await upload(avatarImg.file);

            await setDoc(doc(db, "users", res.user.uid), {
                username,
                email,
                avatar : imgUrl,
                id : res.user.uid,
                block : [],
            });

            await setDoc(doc(db, "userchats", res.user.uid), {
                chats : [],
            });

            toast.success("Account Created Successfully! Please Login");

        }catch(err){
            console.log(err);
            toast.error(err.message);
        }finally{
            setLoading(false);
        }
    }

    const handleLogin = async (event) => {

        event.preventDefault();
        setLoading(true);

        const formData = new FormData(event.target);
        const { email, password } = Object.fromEntries(formData);
        
        try{
            await signInWithEmailAndPassword(auth, email, password);
        }catch(error){
            console.log(error);
            toast.error(error.message);
        }finally{
            setLoading(false);
        }
    }

    return (
        <div className="loginPage">

            <div className="loginItem">
                <h2>Welcome back,</h2>
                <form onSubmit={handleLogin}>
                    <input type="text" placeholder="Enter Email" name="email"/>
                    <input type="password" placeholder="Enter Password" name="password"/>
                    <button className="signupBtn" disabled = {loading}>{loading ? "Loading" : "Sign In"}</button>
                </form>
            </div>

            <div className="separator"></div>

            <div className="loginItem">
            <h2>Create an account</h2>
                <form onSubmit={handleRegister}>
                    <label htmlFor="file">
                        <img src={avatarImg.url || "./avatar.png"} alt="" />
                        Upload an image</label>
                    <input type="file" id="file" style={{display : "none"}} onChange={handleAvatarImg}/>
                    <input type="text" placeholder="Enter Username" name="username"/>
                    <input type="text" placeholder="Enter Email" name="email"/>
                    <input type="password" placeholder="Enter Password" name="password"/>
                    <button className="signupBtn" disabled = {loading}>{loading ? "Loading" : "Sign Up"}</button>
                </form>
            </div>

        </div>
    )
}

export default Login;