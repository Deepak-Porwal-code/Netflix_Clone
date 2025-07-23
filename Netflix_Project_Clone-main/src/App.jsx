import React from "react";
import { BrowserRouter, Route, Routes } from "react-router";
import Login from "./pages/Login";
import Netflix from "./pages/Netflix";
import Signup from "./pages/Signup";
import Player from "./pages/Player";
import Movies from "./pages/Movies";
import TVShows from "./pages/TVShows";
import UserListedMovies from "./pages/UserListedMovies";

const App = () => {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/player" element={<Player />} />
          <Route path="/movies" element={<Movies />} />
          <Route path="/TV" element={<TVShows />} />
          <Route path="/mylist" element={<UserListedMovies />} />
          <Route path="/" element={<Netflix />} />
        </Routes>
      </BrowserRouter>
    </>
  );
};

export default App;
