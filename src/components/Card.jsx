import React, { useState } from "react";
import { useNavigate } from "react-router";
import video from "../assets/video.mp4";
import { IoPlayCircleSharp } from "react-icons/io5";
import { RiThumbDownFill, RiThumbUpFill } from "react-icons/ri";
import { BsCheck } from "react-icons/bs";
import { AiOutlinePlus } from "react-icons/ai";
import { BiChevronDown } from "react-icons/bi";
import { useMovies } from "../context/MovieContext";

const Card = ({ movieData }) => {
  const [isHovered, setIsHovered] = useState(false);
  const navigate = useNavigate();
  const { addToLikedMovies, removeFromLikedMovies, isMovieLiked } = useMovies();

  // Check if this movie is liked
  const isLiked = isMovieLiked(movieData.id);

  // Handle adding to list
  const handleAddToList = () => {
    addToLikedMovies(movieData);
    console.log("Added to list:", movieData.name);
  };

  // Handle removing from list
  const handleRemoveFromList = () => {
    removeFromLikedMovies(movieData.id);
    console.log("Removed from list:", movieData.name);
  };

  return (
    <div
      className="relative w-[330px] h-full cursor-pointer"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <img
        src={`https://image.tmdb.org/t/p/w500${movieData.image}`}
        alt="card"
        className="rounded-sm w-full h-full object-cover z-10"
        onClick={() => navigate("/player")}
      />

      {isHovered && (
        <div className="absolute top-[-18vh] left-0 w-[20rem] bg-[#181818] rounded-md shadow-[0_3px_10px_rgba(0,0,0,0.75)] z-[99] transition duration-300">
          {/* Video Preview */}
          <div className="relative h-[140px]">
            <img
              className="absolute top-0 left-0 w-full h-[140px] object-cover rounded-md z-10"
              src={`https://image.tmdb.org/t/p/w500${movieData.image}`}
              alt="card"
              onClick={() => navigate("/player")}
            />
            <video
              className="absolute top-0 left-0 w-full h-[140px] object-cover rounded-md z-20"
              src={video}
              autoPlay
              loop
              muted
              onClick={() => navigate("/player")}
            />
          </div>

          {/* Info Section */}
          <div className="p-4 flex flex-col gap-2">
            <h3
              className="text-white text-lg font-semibold cursor-pointer"
              onClick={() => navigate("/player")}
            >
              {movieData.name}
            </h3>

            {/* Controls */}
            <div className="flex justify-between items-center">
              <div className="flex gap-4 text-white text-2xl">
                <IoPlayCircleSharp
                  title="Play"
                  className="hover:text-gray-400 transition"
                  onClick={() => navigate("/player")}
                />
                <RiThumbUpFill
                  title="Like"
                  className="hover:text-gray-400 transition"
                />
                <RiThumbDownFill
                  title="Dislike"
                  className="hover:text-gray-400 transition"
                />
                {isLiked ? (
                  <BsCheck
                    title="Remove from List"
                    className="hover:text-gray-400 transition cursor-pointer"
                    onClick={handleRemoveFromList}
                  />
                ) : (
                  <AiOutlinePlus
                    title="Add to my list"
                    className="hover:text-gray-400 transition cursor-pointer"
                    onClick={handleAddToList}
                  />
                )}
              </div>

              <BiChevronDown
                title="More Info"
                className="text-white text-2xl hover:text-gray-400 transition"
              />
            </div>

            {/* Genres */}
            <div className="text-sm text-gray-300">
              <ul className="flex gap-4 flex-wrap">
                {movieData.genres.map((genre, index) => (
                  <li key={index} className="pr-3 list-none">
                    {genre}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Card;
