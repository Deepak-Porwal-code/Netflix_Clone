import React, { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import backgroundImage from '../assets/home.jpg';
import Movielogo from '../assets/homeTitle.webp';
import { FaPlay } from "react-icons/fa";
import { AiOutlineInfoCircle } from "react-icons/ai";
import { useNavigate } from 'react-router';
import { getGenres, getTrendingMovies } from '../store';
import Slider from '../components/Slider';

const Netflix = () => {
  const navigate = useNavigate();
  
  // Simple state using useState
  const [isScrolled, setIsScrolled] = useState(false);
  const [movies, setMovies] = useState([]);
  const [genres, setGenres] = useState([]);
  const [loading, setLoading] = useState(true);

  // Load genres and movies when component mounts
  useEffect(() => {
    const loadData = async () => {
      try {
        // First get genres
        const genresList = await getGenres();
        setGenres(genresList);
        
        // Then get trending movies
        const moviesList = await getTrendingMovies(genresList, "all");
        setMovies(moviesList);
        
        setLoading(false);
      } catch (error) {
        console.error("Error loading data:", error);
        setLoading(false);
      }
    };

    loadData();
  }, []);

  // Scroll effect for Navbar
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.pageYOffset === 0 ? false : true);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

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
      {loading ? (
        <div className="text-white text-center text-xl mt-16">Loading movies...</div>
      ) : (
        <Slider movies={movies} />
      )}
    </>
  );

  
}

export default Netflix