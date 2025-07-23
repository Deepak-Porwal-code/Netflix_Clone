import React, { createContext, useContext, useState, useEffect } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { firebaseAuth } from '../utils/firebase-config';

// Create context
const MovieContext = createContext();

// Custom hook to use the context
export const useMovies = () => {
  const context = useContext(MovieContext);
  if (!context) {
    throw new Error('useMovies must be used within a MovieProvider');
  }
  return context;
};

// Provider component
export const MovieProvider = ({ children }) => {
  const [likedMovies, setLikedMovies] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);

  // Listen for auth changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(firebaseAuth, (user) => {
      setCurrentUser(user);
      if (user) {
        // Load liked movies for this user
        const savedMovies = localStorage.getItem(`likedMovies_${user.email}`);
        if (savedMovies) {
          setLikedMovies(JSON.parse(savedMovies));
        } else {
          setLikedMovies([]);
        }
      } else {
        setLikedMovies([]);
      }
    });

    return () => unsubscribe();
  }, []);

  // Add movie to liked list
  const addToLikedMovies = (movie) => {
    if (!currentUser) return;

    const isAlreadyLiked = likedMovies.some(m => m.id === movie.id);
    if (isAlreadyLiked) return;

    const updatedMovies = [...likedMovies, movie];
    setLikedMovies(updatedMovies);
    
    // Save to localStorage
    localStorage.setItem(`likedMovies_${currentUser.email}`, JSON.stringify(updatedMovies));
  };

  // Remove movie from liked list
  const removeFromLikedMovies = (movieId) => {
    if (!currentUser) return;

    const updatedMovies = likedMovies.filter(movie => movie.id !== movieId);
    setLikedMovies(updatedMovies);
    
    // Save to localStorage
    localStorage.setItem(`likedMovies_${currentUser.email}`, JSON.stringify(updatedMovies));
  };

  // Check if movie is liked
  const isMovieLiked = (movieId) => {
    return likedMovies.some(movie => movie.id === movieId);
  };

  const value = {
    likedMovies,
    addToLikedMovies,
    removeFromLikedMovies,
    isMovieLiked,
    currentUser
  };

  return (
    <MovieContext.Provider value={value}>
      {children}
    </MovieContext.Provider>
  );
};