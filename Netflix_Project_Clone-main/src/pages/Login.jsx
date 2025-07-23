import React, { useState, useEffect } from "react";
import {  useNavigate } from "react-router";
import { onAuthStateChanged, signInWithEmailAndPassword, } from "firebase/auth";
import { firebaseAuth } from "../utils/firebase-config";
import BackgroundImage from "../components/Backgroundimage";
import Header from "../components/Header";

const  Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(firebaseAuth, (currentUser) => {
      if (currentUser) {
        navigate("/");
      }
    });
    return () => unsubscribe();
  }, [navigate]);

  const handleLogin = async () => {
    if (!email || !password) {
      setError("Please fill in all fields");
      return;
    }

    setLoading(true);
    setError("");
    
    try {
      await signInWithEmailAndPassword(firebaseAuth, email, password);
    } catch (error) {
      console.error("Login Error:", error.code);
      switch (error.code) {
        case 'auth/invalid-credential':
          setError("Invalid email or password. Please check your credentials.");
          break;
        case 'auth/user-not-found':
          setError("No account found with this email. Please sign up first.");
          break;
        case 'auth/wrong-password':
          setError("Incorrect password. Please try again.");
          break;
        case 'auth/invalid-email':
          setError("Please enter a valid email address.");
          break;
        case 'auth/too-many-requests':
          setError("Too many failed attempts. Please try again later.");
          break;
        default:
          setError("Login failed. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="relative">
      <BackgroundImage />
      <div className="absolute top-0 left-0 h-screen w-screen bg-black/50 grid grid-rows-[15vh_85vh]">
        <Header />
        <div className="flex items-center justify-center h-[85vh]">
          <div className="flex flex-col items-center justify-center p-8 gap-8 bg-black/70 text-white w-[25vw]">
            <h3 className="text-2xl font-semibold">Login</h3>
            <div className="flex flex-col gap-6">
              {error && (
                <div className="px-4 py-2 bg-red-600 text-white text-sm rounded">
                  {error}
                </div>
              )}
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="px-4 py-2 w-60 border border-black bg-white text-black focus:outline-none"
                disabled={loading}
              />
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="px-4 py-2 w-60 border border-black bg-white text-black focus:outline-none"
                disabled={loading}
              />
              <button
                onClick={handleLogin}
                disabled={loading}
                className="px-4 py-2 bg-[#e50914] text-white font-bold text-[1.05rem] rounded cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? "Logging in..." : "Login to your account"}
              </button>
              <div className="text-center">
                <span className="text-gray-300">Don't have an account? </span>
                <button
                  onClick={() => navigate("/signup")}
                  className="text-[#e50914] hover:underline"
                >
                  Sign up here
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
