import React from 'react'
import { useNavigate } from 'react-router'
import logo from "../assets/logo.png"

export default function Header({ login }) {
  const navigate = useNavigate()

  return (
    <div className="flex items-center justify-between p-16">
      <div className="logo">
        <img src={logo} alt="logo" className='h-20' />
      </div>
      <button 
        onClick={() => navigate(login ? "/login" : "/signup")}
        className="px-4 py-2 bg-[#e50914] text-white font-bold text-[1.05rem] rounded cursor-pointer border-none"
      >
        {login ? "Log in" : "Sign Up"}
      </button>
    </div>
  )
}


