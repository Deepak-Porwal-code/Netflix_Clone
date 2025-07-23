import React, { createContext, useContext, useState } from 'react';
import axios from 'axios';
import { API_KEY, TMDB_BASE_URL } from '../utils/constants';

const NetflixContext = createContext();

export const useNetflix = () => {
  const context = useContext(NetflixContext);
  if (!context) {
    throw new Error('useNetflix must be used within NetflixProvider');
  }
  return context;
};

export const NetflixProvider = ({ children }) => {
  const [movies, setMovies] = useState([]);
  const [genres, setGenres] = useState([]);
  const [genresLoaded, setGenresLoaded] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const getGenres = async () => {
    try {
      setLoading(true);
      setError('');
      
      const response = await axios.get(`${TMDB_BASE_URL}/genre/movie/list?api_key=${API_KEY}`);
      const genresList = response.data.genres;
      
      setGenres(genresList);
      setGenresLoaded(true);
      
      console.log('Genres loaded:', genresList);
    } catch (err) {
      setError('Failed to load genres');
      console.error('Error loading genres:', err);
    } finally {
      setLoading(false);
    }
  };

  const getTrendingMovies = async (type = 'all') => {
    try {
      setLoading(true);
      setError('');
      
      const allMovies = [];
      let sources = [];
      
      if (type === 'movie') {
        sources = [
          `${TMDB_BASE_URL}/trending/movie/week?api_key=${API_KEY}`,
          `${TMDB_BASE_URL}/movie/popular?api_key=${API_KEY}`,
          `${TMDB_BASE_URL}/movie/top_rated?api_key=${API_KEY}`,
          `${TMDB_BASE_URL}/movie/now_playing?api_key=${API_KEY}`
        ];
      } else if (type === 'tv') {
        sources = [
          `${TMDB_BASE_URL}/trending/tv/week?api_key=${API_KEY}`,
          `${TMDB_BASE_URL}/tv/popular?api_key=${API_KEY}`,
          `${TMDB_BASE_URL}/tv/top_rated?api_key=${API_KEY}`,
          `${TMDB_BASE_URL}/tv/on_the_air?api_key=${API_KEY}`
        ];
      } else {
        sources = [
          `${TMDB_BASE_URL}/trending/all/week?api_key=${API_KEY}`,
          `${TMDB_BASE_URL}/movie/popular?api_key=${API_KEY}`,
          `${TMDB_BASE_URL}/tv/popular?api_key=${API_KEY}`,
          `${TMDB_BASE_URL}/movie/top_rated?api_key=${API_KEY}`
        ];
      }
      
      for (const source of sources) {
        try {
          for (let page = 1; page <= 2 && allMovies.length < 80; page++) {
            const response = await axios.get(`${source}&page=${page}`);
            const rawMovies = response.data.results;
            
            rawMovies.forEach((movie) => {
              if (!movie.backdrop_path || allMovies.find(m => m.id === movie.id)) return;
              
              const movieGenres = [];
              if (movie.genre_ids) {
                movie.genre_ids.forEach((genreId) => {
                  const genre = genres.find((g) => g.id === genreId);
                  if (genre) {
                    movieGenres.push(genre.name);
                  }
                });
              }
              
              allMovies.push({
                id: movie.id,
                name: movie.original_name || movie.original_title || movie.title,
                image: movie.backdrop_path,
                genres: movieGenres.slice(0, 3),
              });
            });
            
            if (allMovies.length >= 80) break;
          }
        } catch (sourceError) {
          console.warn('Error fetching from source:', source, sourceError);
        }
      }
      
      setMovies(allMovies);
      console.log(`${allMovies.length} movies loaded:`, allMovies);
    } catch (err) {
      setError('Failed to load movies');
      console.error('Error loading movies:', err);
    } finally {
      setLoading(false);
    }
  };

  const getMoviesByGenre = async (genreId, type = 'movie') => {
    try {
      setLoading(true);
      setError('');
      
      const allMovies = [];
      
      for (let page = 1; page <= 3 && allMovies.length < 60; page++) {
        const response = await axios.get(`${TMDB_BASE_URL}/discover/${type}?api_key=${API_KEY}&with_genres=${genreId}&page=${page}`);
        const rawMovies = response.data.results;
        
        rawMovies.forEach((movie) => {
          if (!movie.backdrop_path || allMovies.find(m => m.id === movie.id)) return;
          
          const movieGenres = [];
          if (movie.genre_ids) {
            movie.genre_ids.forEach((genreId) => {
              const genre = genres.find((g) => g.id === genreId);
              if (genre) {
                movieGenres.push(genre.name);
              }
            });
          }
          
          allMovies.push({
            id: movie.id,
            name: movie.original_name || movie.original_title || movie.title,
            image: movie.backdrop_path,
            genres: movieGenres.slice(0, 3),
          });
        });
        
        if (allMovies.length >= 60) break;
      }
      
      setMovies(allMovies);
      console.log(`${allMovies.length} movies by genre loaded:`, allMovies);
    } catch (err) {
      setError('Failed to load movies by genre');
      console.error('Error loading movies by genre:', err);
    } finally {
      setLoading(false);
    }
  };

  const getLikedMovies = async (userEmail) => {
    try {
      setLoading(true);
      setError('');
      
      const response = await axios.get(`http://localhost:5000/api/user/liked/${userEmail}`);
      const likedMovies = response.data.movies;
      
      setMovies(likedMovies);
      console.log('Liked movies loaded:', likedMovies);
    } catch (err) {
      setError('Failed to load liked movies');
      console.error('Error loading liked movies:', err);
    } finally {
      setLoading(false);
    }
  };

  const removeLikedMovie = async (movieId, userEmail) => {
    try {
      setLoading(true);
      setError('');
      

      const response = await axios.put('http://localhost:5000/api/user/remove', {
        email: userEmail,
        movieId: movieId,
      });
      const updatedMovies = response.data.movies;
      

      setMovies(updatedMovies);
      
      console.log('Movie removed, updated list:', updatedMovies);
    } catch (err) {
      setError('Failed to remove movie');
      console.error('Error removing movie:', err);
    } finally {
      setLoading(false);
    }
  };




  const clearMovies = () => {
    setMovies([]);
  };

  const clearError = () => {
    setError('');
  };


  const value = {
    movies,
    genres,
    genresLoaded,
    loading,
    error,
    getGenres,
    getTrendingMovies,
    getMoviesByGenre,
    getLikedMovies,
    removeLikedMovie,
    clearMovies,
    clearError,
  };

  return (
    <NetflixContext.Provider value={value}>
      {children}
    </NetflixContext.Provider>
  );
};