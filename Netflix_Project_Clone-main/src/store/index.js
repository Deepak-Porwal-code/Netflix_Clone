import { configureStore, createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { API_KEY, TMDB_BASE_URL } from "../utils/constants";


const initialState = {
  movies: [],           
  genresLoaded: false,  
  genres: [],           
};

export const getGenres = createAsyncThunk("netflix/genres", async () => {
  const response = await axios.get(`${TMDB_BASE_URL}/genre/movie/list?api_key=${API_KEY}`);
  return response.data.genres;
});


export const fetchMovies = createAsyncThunk("netflix/trending", async ({ type }, thunkAPI) => {

  const state = thunkAPI.getState();
  const genres = state.netflix.genres;
  

  const movies = await getMoviesFromAPI(`${TMDB_BASE_URL}/trending/${type}/week?api_key=${API_KEY}`, genres, true);
  return movies;
});


export const fetchDataByGenre = createAsyncThunk("netflix/genre", async ({ genre, type }, thunkAPI) => {

  const state = thunkAPI.getState();
  const genres = state.netflix.genres;
  

  const movies = await getMoviesFromAPI(`${TMDB_BASE_URL}/discover/${type}?api_key=${API_KEY}&with_genres=${genre}`, genres);
  return movies;
});


export const getUsersLikedMovies = createAsyncThunk("netflix/getLiked", async (email) => {
  const response = await axios.get(`http://localhost:5000/api/user/liked/${email}`);
  return response.data.movies;
});

export const removeMovieFromLiked = createAsyncThunk("netflix/deleteLiked", async ({ movieId, email }) => {
  const response = await axios.put("http://localhost:5000/api/user/remove", {
    email,
    movieId,
  });
  return response.data.movies;
});

async function getMoviesFromAPI(apiUrl, genres, usePaging = false) {
  const moviesList = [];
  

  for (let page = 1; moviesList.length < 60 && page < 10; page++) {
    const url = usePaging ? `${apiUrl}&page=${page}` : apiUrl;
    const response = await axios.get(url);
    const movies = response.data.results;
   
    processMovies(movies, moviesList, genres);
  }
  
  return moviesList;
}

function processMovies(rawMovies, moviesList, genres) {
  rawMovies.forEach((movie) => {
  
    if (!movie.backdrop_path) return;
    
   
    const movieGenres = [];
    movie.genre_ids.forEach((genreId) => {
      const genre = genres.find((g) => g.id === genreId);
      if (genre) movieGenres.push(genre.name);
    });
    

    moviesList.push({
      id: movie.id,
      name: movie.original_name || movie.original_title,
      image: movie.backdrop_path,
      genres: movieGenres.slice(0, 3), 
    });
  });
}

const NetflixSlice = createSlice({
  name: "netflix",
  initialState,
  

  reducers: {
    setGenres: (state, action) => {
      state.genres = action.payload;
      state.genresLoaded = true;
    },
    setMovies: (state, action) => {
      state.movies = action.payload;
    },
  },
  
 
  extraReducers: (builder) => {
    builder
  
      .addCase(getGenres.fulfilled, (state, action) => {
        state.genres = action.payload;
        state.genresLoaded = true;
      })
      

      .addCase(fetchMovies.fulfilled, (state, action) => {
        state.movies = action.payload;
      })
      
  
      .addCase(fetchDataByGenre.fulfilled, (state, action) => {
        state.movies = action.payload;
      })
   
      .addCase(getUsersLikedMovies.fulfilled, (state, action) => {
        state.movies = action.payload;
      })
      
     
      .addCase(removeMovieFromLiked.fulfilled, (state, action) => {
        state.movies = action.payload;
      });
  },
});


const store = configureStore({
  reducer: {
    netflix: NetflixSlice.reducer,
  },
});

export default store;

export const { setGenres, setMovies } = NetflixSlice.actions;
