import React, { useEffect, useState } from 'react'
import { getGenres, getTrendingMovies } from '../store';
import { useNavigate } from 'react-router';
import { onAuthStateChanged } from 'firebase/auth';
import { firebaseAuth } from '../utils/firebase-config';
import Navbar from "../components/Navbar"
import Slider from "../components/Slider"
import NotAvailable from "../components/NotAvailable"
import SelectGenre from "../components/SelectGenre"

const Movies = () => {
  const navigate = useNavigate();
  
  // Simple state using useState
  const [isScrolled, setIsScrolled] = useState(false);
  const [movies, setMovies] = useState([]);
  const [genres, setGenres] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  // Check if user is logged in
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(firebaseAuth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser.uid);
      } else {
        navigate("/login");
      }
    });
    return () => unsubscribe();
  }, [navigate]);

  // Load genres and movies
  useEffect(() => {
    const loadData = async () => {
      try {
        const genresList = await getGenres();
        setGenres(genresList);
        
        const moviesList = await getTrendingMovies(genresList, "movie");
        setMovies(moviesList);
        
        setLoading(false);
      } catch (error) {
        console.error("Error loading movies:", error);
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
    <div className="w-full min-h-screen bg-black">
      <div className="fixed top-0 w-full z-50">
        <Navbar isScrolled={isScrolled} />
      </div>
      <div className="pt-32 px-4 sm:px-8">
        <SelectGenre 
          genres={genres} 
          type="movie" 
          onGenreChange={(genreId) => {
            // Handle genre change - you can implement this later
            console.log("Selected genre:", genreId);
          }}
        />
        {loading ? (
          <div className="text-white text-center text-xl mt-16">Loading movies...</div>
        ) : movies.length > 0 ? (
          <Slider movies={movies} />
        ) : (
          <NotAvailable />
        )}
      </div>
    </div>
  );
  
}

export default Movies