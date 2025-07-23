import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { IoPlayCircleSharp } from "react-icons/io5";
import { AiOutlinePlus } from "react-icons/ai";
import { RiThumbUpFill, RiThumbDownFill } from "react-icons/ri";
import { BiChevronDown } from "react-icons/bi";
import { BsCheck } from "react-icons/bs";
import axios from "axios";
import { onAuthStateChanged } from "firebase/auth";
import { firebaseAuth } from "../utils/firebase-config";
import { useNetflix } from "../store/SimpleStore.jsx";
import video from "../assets/video.mp4";

export default React.memo(function Card({ movieData, isLiked = false }) {
  const navigate = useNavigate();
  const [isHovered, setIsHovered] = useState(false);
  const [user, setUser] = useState(null);

  const { removeLikedMovie } = useNetflix();

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

  const addToList = async () => {
    if (!user || !user.email) return;
    
    try {
      await axios.post("http://localhost:5000/api/user/add", {
        email: user.email,
        data: movieData,
      });
      console.log("Movie added to list successfully!");
    } catch (error) {
      console.log(error);
    }
  };

  const removeFromList = () => {
    if (!user || !user.email) return;
    
    removeLikedMovie(movieData.id, user.email); 
  };

  return (
    <div
      className="relative w-[230px] cursor-pointer"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <img
        className="rounded-sm w-full h-full z-10"
        src={`https://image.tmdb.org/t/p/w500${movieData.image}`}
        alt="card"
        onClick={() => navigate("/player")}
      />

      {isHovered && (
        <div className="absolute top-[-18vh] left-0 w-[20rem] bg-[#181818] rounded-md shadow-[0_3px_10px_rgba(0,0,0,0.75)] z-[99] transition duration-300">
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

          <div className="flex flex-col gap-2 p-4">
            <h3
              className="text-white font-semibold text-md"
              onClick={() => navigate("/player")}
            >
              {movieData.name}
            </h3>

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
                    className="hover:text-gray-400 transition"
                    onClick={removeFromList}
                  />
                ) : (
                  <AiOutlinePlus
                    title="Add to my list"
                    className="hover:text-gray-400 transition"
                    onClick={addToList}
                  />
                )}
              </div>

              <BiChevronDown
                title="More Info"
                className="text-white text-2xl hover:text-gray-400 transition"
              />
            </div>

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
});
