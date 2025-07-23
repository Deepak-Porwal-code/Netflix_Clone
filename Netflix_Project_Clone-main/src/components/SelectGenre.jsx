import React from "react";
import { useNetflix } from "../store/SimpleStore.jsx";

export default function SelectGenre({ genres, type }) {
  const { getMoviesByGenre } = useNetflix();

  const handleGenreChange = (e) => {
    const selectedGenreId = e.target.value;
    if (selectedGenreId) {
      getMoviesByGenre(selectedGenreId, type);
    }
  };

  return (
    <select
      className="ml-20 cursor-pointer text-lg bg-black/40 text-white px-4 py-2 rounded-md outline-none"
      onChange={handleGenreChange}
    >
      <option value="">Select Genre</option>
      {genres.map((genre) => (
        <option value={genre.id} key={genre.id}>
          {genre.name}
        </option>
      ))}
    </select>
  );
}
