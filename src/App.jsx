import React from "react";
import { BrowserRouter, Route, Routes } from "react-router";
import { MovieProvider } from "./context/MovieContext";
import Login from "./pages/Login";
import Netflix from "./pages/Netflix";
import Signup from "./pages/Signup";
import Player from "./pages/Player";
import Movies from "./pages/Movies";
import TVShows from "./pages/TVShows";
import UserListedMovies from "./pages/UserListedMovies";

const App = () => {
  return (
    <MovieProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/player" element={<Player />} />
          <Route path="/movies" element={<Movies />} />
          <Route path="/tv" element={<TVShows />} />
          <Route path="/mylist" element={<UserListedMovies />} />
          <Route path="/" element={<Netflix />} />
        </Routes>
      </BrowserRouter>
    </MovieProvider>
  );
};

export default App;
