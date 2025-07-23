import React, { useState } from "react";
import {  useNavigate } from "react-router";
import { onAuthStateChanged, signInWithEmailAndPassword, } from "firebase/auth";
import { firebaseAuth } from "../utils/firebase-config";
import BackgroundImage from "../components/Backgroundimage";
import Header from "../components/Header";

const  Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      await signInWithEmailAndPassword(firebaseAuth, email, password);
    } catch (error) {
      console.error("Login Error:", error.code);
    }
  };
onAuthStateChanged(firebaseAuth , (currentUser) =>{
  if(currentUser) navigate("/")
})
  return (
    <div className="relative">
      <BackgroundImage />
      <div className="absolute top-0 left-0 h-screen w-screen bg-black/50 grid grid-rows-[15vh_85vh]">
        <Header />
        <div className="flex items-center justify-center h-[85vh]">
          <div className="flex flex-col items-center justify-center p-8 gap-8 bg-black/70 text-white w-[25vw]">
            <h3 className="text-2xl font-semibold">Login</h3>
            <div className="flex flex-col gap-6">
              <input
                type="text"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="px-4 py-2 w-60 border border-black bg-white text-black focus:outline-none"
              />
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="px-4 py-2 w-60 border border-black bg-white text-black focus:outline-none"
              />
              <button
                onClick={handleLogin}
                className="px-4 py-2 bg-[#e50914] text-white font-bold text-[1.05rem] rounded cursor-pointer"
              >
                Login to your account
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
