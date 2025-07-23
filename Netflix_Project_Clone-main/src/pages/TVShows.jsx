import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import { onAuthStateChanged } from "firebase/auth";
import { firebaseAuth } from "../utils/firebase-config";
import { useNavigate } from 'react-router';
import { useNetflix } from "../store/SimpleStore.jsx";
import SelectGenre from "../components/SelectGenre";
import Slider from "../components/Slider";

function TVShows() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();


  const { 
    movies, 
    genres, 
    genresLoaded, 
    loading,
    getGenres, 
    getTrendingMovies 
  } = useNetflix();

 
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
      getTrendingMovies('tv'); 
    }
  }, [genresLoaded]);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.pageYOffset !== 0);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);


  if (!user) {
    return <div className="flex items-center justify-center h-screen text-white">Loading user...</div>;
  }

  if (loading) {
    return <div className="flex items-center justify-center h-screen text-white">Loading TV shows...</div>;
  }

  return (
    <div className="w-full h-full">
      <Navbar isScrolled={isScrolled} />
      <div className="mt-32">
        <SelectGenre genres={genres} type="tv" />
        {movies.length ? (
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
