import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import { onAuthStateChanged } from "firebase/auth";
import { firebaseAuth } from "../utils/firebase-config";
import { useNavigate } from 'react-router';
import { getGenres, getTrendingMovies } from "../store";
import SelectGenre from "../components/SelectGenre";
import Slider from "../components/Slider";

function TVShows() {
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

  // Load genres and TV shows
  useEffect(() => {
    const loadData = async () => {
      try {
        const genresList = await getGenres();
        setGenres(genresList);
        
        const tvShowsList = await getTrendingMovies(genresList, "tv");
        setMovies(tvShowsList);
        
        setLoading(false);
      } catch (error) {
        console.error("Error loading TV shows:", error);
        setLoading(false);
      }
    };

    loadData();
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.pageYOffset !== 0);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="w-full min-h-screen bg-black">
      <Navbar isScrolled={isScrolled} />
      <div className="pt-32 px-4 sm:px-8">
        <SelectGenre 
          genres={genres} 
          type="tv" 
          onGenreChange={(genreId) => {
            console.log("Selected TV genre:", genreId);
          }}
        />
        {loading ? (
          <div className="text-white text-center text-xl mt-16">Loading TV shows...</div>
        ) : movies.length ? (
          <Slider movies={movies} />
        ) : (
          <h1 className="text-center text-white text-lg mt-16">
            No TV Shows available for the selected genre. Please select a different genre.
          </h1>
        )}
      </div>
    </div>
  );
}

export default TVShows;
