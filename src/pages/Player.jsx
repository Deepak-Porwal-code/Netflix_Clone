import React from "react";
import { BsArrowLeft } from "react-icons/bs";
import {  useNavigate } from "react-router";
import video from "../assets/video.mp4";

export default function Player() {
  const navigate = useNavigate();

  return (
    <div className="w-screen h-screen relative">
      {/* Back Button */}
      <div className="absolute top-0 left-0 p-8 z-10">
        <BsArrowLeft
          onClick={() => navigate(-1)}
          className="text-white text-4xl cursor-pointer"
        />
      </div>

      {/* Video Player */}
      <video
        src={video}
        autoPlay
        loop
        controls
        muted
        className="w-full h-full object-cover"
      />
    </div>
  );
}
