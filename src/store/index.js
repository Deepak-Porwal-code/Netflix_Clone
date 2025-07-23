// Simple API functions using axios and useState
import axios from "axios";
import { API_KEY, TMDB_BASE_URL } from "../utils/constants";

// Get all movie genres from TMDB
export const getGenres = async () => {
  try {
    const response = await axios.get(`${TMDB_BASE_URL}/genre/movie/list?api_key=${API_KEY}`);
    return response.data.genres;
  } catch (error) {
    console.error("Error fetching genres:", error);
    return [];
  }
};

// Convert raw movie data to our format
const createMovieArray = (movies, genres) => {
  return movies.map((movie) => {
    // Get genre names for this movie
    const movieGenres = [];
    movie.genre_ids.forEach((genreId) => {
      const genre = genres.find((g) => g.id === genreId);
      if (genre) movieGenres.push(genre.name);
    });

    return {
      id: movie.id,
      name: movie.original_name || movie.original_title,
      image: movie.backdrop_path,
      genres: movieGenres.slice(0, 3), // Only show first 3 genres
    };
  }).filter(movie => movie.image); // Only include movies with images
};

// Get trending movies
export const getTrendingMovies = async (genres, type = "all") => {
  try {
    const moviesArray = [];
    
    // Fetch multiple pages to get more movies
    for (let page = 1; page <= 3 && moviesArray.length < 60; page++) {
      const response = await axios.get(
        `${TMDB_BASE_URL}/trending/${type}/week?api_key=${API_KEY}&page=${page}`
      );
      
      const formattedMovies = createMovieArray(response.data.results, genres);
      moviesArray.push(...formattedMovies);
    }
    
    return moviesArray.slice(0, 60); // Return max 60 movies
  } catch (error) {
    console.error("Error fetching trending movies:", error);
    return [];
  }
};

// Get movies by specific genre
export const getMoviesByGenre = async (genres, genreId, type = "movie") => {
  try {
    const moviesArray = [];
    
    // Fetch multiple pages
    for (let page = 1; page <= 3 && moviesArray.length < 60; page++) {
      const response = await axios.get(
        `${TMDB_BASE_URL}/discover/${type}?api_key=${API_KEY}&with_genres=${genreId}&page=${page}`
      );
      
      const formattedMovies = createMovieArray(response.data.results, genres);
      moviesArray.push(...formattedMovies);
    }
    
    return moviesArray.slice(0, 60);
  } catch (error) {
    console.error("Error fetching movies by genre:", error);
    return [];
  }
};
