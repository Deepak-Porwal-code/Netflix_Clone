import React, { useState, useEffect } from "react";
import logo from "../assets/logo.png";
import { Link, useNavigate } from "react-router";
import { FaPowerOff, FaSearch } from "react-icons/fa";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { firebaseAuth } from "../utils/firebase-config";

const Navbar = ({ isScrolled }) => {
  const links = [
    { name: "Home", link: "/" },
    { name: "TV Shows", link: "/TV" },
    { name: "Movies", link: "/movies" },
    { name: "My List", link: "/mylist" },
  ];

  const [showSearch, setshowSearch] = useState(false);
  const [InputHover, setInputHover] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(firebaseAuth, (currentUser) => {
      if (!currentUser) {
        navigate("/login");
      }
    });
    return () => unsubscribe();
  }, [navigate]);

  return (
    <div className="w-full">
      <nav
        className={`fixed top-0 z-50 w-full flex items-center justify-between px-16 h-[6.5rem] transition-all duration-300 ${
          isScrolled ? "bg-black" : ""
        }`}
      >
        {/* Left Section */}
        <div className="flex items-center gap-8">
          <div className="flex items-center justify-center">
            <img src={logo} alt="Logo" className="h-16" />
          </div>
          <ul className="flex gap-8 list-none">
            {links.map(({ name, link }) => (
              <li key={name}>
                <Link to={link} className="text-white hover:underline">
                  {name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-4">
          {/* Search */}
          <div
            className={`flex items-center gap-2 px-2 py-1 transition-all duration-300 ${
              showSearch ? "border border-white bg-black/60" : ""
            }`}
          >
            <button
              onFocus={() => setshowSearch(true)}
              onBlur={() => {
                if (!InputHover) setshowSearch(false);
              }}
              className="bg-transparent border-none outline-none"
            >
              <FaSearch className="text-white text-[1.2rem]" />
            </button>
            <input
              type="text"
              placeholder="Search"
              onMouseEnter={() => setInputHover(true)}
              onMouseLeave={() => setInputHover(false)}
              onBlur={() => {
                setshowSearch(false);
                setInputHover(false);
              }}
              className={`bg-transparent border-none text-white outline-none transition-all duration-300 placeholder-white ${
                showSearch
                  ? "w-full opacity-100 visible px-2 py-1"
                  : "w-0 opacity-0 invisible"
              }`}
            />
          </div>

          {/* Logout Button */}
          <button
            onClick={() => {
              signOut(firebaseAuth);
            }}
            className="bg-transparent border-none outline-none"
          >
            <FaPowerOff className="text-[#f34242] text-[1.2rem]" />
          </button>
        </div>
      </nav>
    </div>
  );
};

export default Navbar;
