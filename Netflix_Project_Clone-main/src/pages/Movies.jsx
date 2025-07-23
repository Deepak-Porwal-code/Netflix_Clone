import React, { useEffect, useState } from 'react'
import { useNetflix } from '../store/SimpleStore.jsx';
import { useNavigate } from 'react-router';
import { onAuthStateChanged } from 'firebase/auth';
import { firebaseAuth } from '../utils/firebase-config';
import Navbar from "../components/Navbar"
import Slider from "../components/Slider"
import NotAvailable from "../components/NotAvailable"
import SelectGenre from "../components/SelectGenre"

const Movies = () => {
  const navigate = useNavigate();
  
  const { 
    movies, 
    genres, 
    genresLoaded, 
    loading,
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
        navigate("/login");
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
      getTrendingMovies('movie');
    }
  }, [genresLoaded]);

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

  return (
    <div className="w-full min-h-screen bg-black">
      <div className="fixed top-0 w-full z-50">
        <Navbar isScrolled={isScrolled} />
      </div>
      <div className="pt-32 px-4 sm:px-8">
        <SelectGenre genres={genres} type="movie" />
        {movies.length > 0 ? (
          <Slider movies={movies} />
        ) : (
          <div className="text-center text-white mt-16 text-lg">
            <NotAvailable />
          </div>
        )}
      </div>
    </div>
  );
  
}

export default Movies