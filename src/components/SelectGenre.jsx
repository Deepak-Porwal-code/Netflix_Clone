import React from "react";

export default function SelectGenre({ genres, type, onGenreChange }) {
  return (
    <select
      className="ml-20 cursor-pointer text-lg bg-black/40 text-white px-4 py-2 rounded-md outline-none"
      onChange={(e) => {
        if (onGenreChange) {
          onGenreChange(e.target.value);
        }
      }}
    >
      <option value="">All {type === "movie" ? "Movies" : "TV Shows"}</option>
      {genres.map((genre) => (
        <option value={genre.id} key={genre.id}>
          {genre.name}
        </option>
      ))}
    </select>
  );
}
