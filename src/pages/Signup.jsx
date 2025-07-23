import React, { useState } from "react";
import {createUserWithEmailAndPassword, onAuthStateChanged} from 'firebase/auth'
import BackgroundImage from "../components/Backgroundimage";
import Header from "../components/Header";
import { firebaseAuth } from "../utils/firebase-config";
import {  useNavigate } from "react-router";


const Signup = () => {
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate()

  const [formValues, setFormValues] = useState({
    email: "",
    password: "",
  });

  const handleSignIn = async () => {
    try {
      const {email , password} = formValues;
      await createUserWithEmailAndPassword(firebaseAuth , email , password)
    } catch (err) {
      console.log(err);
      
    }
  };

onAuthStateChanged(firebaseAuth , (currentUser) =>{
  if(currentUser) navigate("/")
})

  return (
    <div className="relative">
      <BackgroundImage />
      <div className="absolute top-0 left-0 h-screen w-screen bg-black/50 grid grid-rows-[15vh_85vh]">
        <Header login />
        <div className="flex flex-col items-center justify-center gap-4">
          <div className="flex flex-col text-center gap-4 text-2xl text-white px-[25rem]">
            <h1 className="font-bold text-4xl">
              Unlimited movies, TV shows and more.
            </h1>
            <h4 className="text-xl">Watch anywhere. Cancel anytime.</h4>
            <h6 className="text-base">
              Ready to watch? Enter your email to create or restart membership.
            </h6>
          </div>

          {/* Form */}
          <div
            className={`grid ${
              showPassword ? "grid-cols-2" : "grid-cols-[2fr_1fr]"
            } w-[60%] mt-4 gap-2`}
          >
            <input
              type="email"
              name="email"
              placeholder="Email address"
              autoComplete="off"
              value={formValues.email}
              onChange={(e) =>
                setFormValues({
                  ...formValues,
                  [e.target.name]: e.target.value,
                })
              }
              className="p-6 text-lg border bg-white border-black focus:outline-none"
            />

            {showPassword ? (
              <input
                type="password"
                name="password"
                placeholder="Password"
                autoComplete="off"
                value={formValues.password}
                onChange={(e) =>
                  setFormValues({
                    ...formValues,
                    [e.target.name]: e.target.value,
                  })
                }
                className="p-6 text-lg border bg-white border-black focus:outline-none"
              />
            ) : (
              <button
                onClick={() => setShowPassword(true)}
                className="px-4 py-2 bg-[#e50914] text-white font-bold text-[1.05rem] cursor-pointer"
              >
                Get Started
              </button>
            )}
          </div>

          {showPassword && (
            <button
              onClick={handleSignIn}
              className="mt-4 px-4 py-2 bg-[#e50914] text-white font-bold text-[1.05rem] rounded cursor-pointer"
            >
              Sign In
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Signup;
