import React, { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import backgroundImage from '../assets/home.jpg';
import Movielogo from '../assets/homeTitle.webp';
import { FaPlay } from "react-icons/fa";
import { AiOutlineInfoCircle } from "react-icons/ai";
import { useNavigate } from 'react-router';
import { useNetflix } from '../store/SimpleStore.jsx';
import Slider from '../components/Slider';
import { onAuthStateChanged } from 'firebase/auth';
import { firebaseAuth } from '../utils/firebase-config';

const Netflix = () => {
  const navigate = useNavigate();
  
  const { 
    movies, 
    genres, 
    genresLoaded, 
    loading, 
    error,
    getGenres, 
    getTrendingMovies 
  } = useNetflix();

  const [isScrolled, setIsScrolled] = useState(false);
  const [user, setUser] = useState(null);


  useEffect(() => {
    const unsubscribe = onAuthStateChanged(firebaseAuth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
      } else {
        navigate('/signup');
      }
    });
    return () => unsubscribe();
  }, [navigate]);

  useEffect(() => {
    if (user) {
      getGenres();
    }
  }, [user]);

  useEffect(() => {
    if (genresLoaded) {
      getTrendingMovies();
    }
  }, [genresLoaded]);

  useEffect(() => {
    if (movies.length > 0) {
      console.log("Movies Loaded:", movies);
    }
  }, [movies]);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.pageYOffset === 0 ? false : true);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);


  if (!user) {
    return <div className="flex items-center justify-center h-screen text-white">Loading user...</div>;
  }

  if (loading) {
    return <div className="flex items-center justify-center h-screen text-white">Loading movies...</div>;
  }

  if (error) {
    return <div className="flex items-center justify-center h-screen text-red-500">Error: {error}</div>;
  }

  return (
    <>
      <Navbar isScrolled={isScrolled} />

      {/* Hero Section */}
      <div className="relative">
        <img
          src={backgroundImage}
          alt="background"
          className="h-screen w-screen object-cover brightness-[0.6]"
        />

        {/* Content over background */}
        <div className="absolute bottom-20 left-0 ml-20">
          <div className="mb-10">
            <img src={Movielogo} alt="Movie Logo" className="h-auto w-[40vw]" />
          </div>
          <div className="flex gap-4 ml-20">
            <button
              onClick={() => navigate("/player")}
              className="flex items-center justify-center gap-2 bg-white text-black font-semibold text-lg px-6 py-2 rounded hover:opacity-80 transition"
            >
              <FaPlay /> Play
            </button>
            <button className="flex items-center justify-center gap-2 bg-gray-600 bg-opacity-70 text-white font-semibold text-lg px-6 py-2 rounded hover:opacity-80 transition">
              <AiOutlineInfoCircle className="text-xl" /> More Info
            </button>
          </div>
        </div>
      </div>

      {/* Movie Slider */}
      <Slider movies={movies} />
    </>
  );

  
}

export default Netflix