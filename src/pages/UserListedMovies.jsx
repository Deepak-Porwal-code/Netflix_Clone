import { onAuthStateChanged } from "firebase/auth";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { firebaseAuth } from "../utils/firebase-config";
import Card from "../components/Card";
import Navbar from "../components/Navbar";
import { useMovies } from "../context/MovieContext";

export default function UserListedMovies() {
  const navigate = useNavigate();
  const [isScrolled, setIsScrolled] = useState(false);
  const { likedMovies, currentUser } = useMovies();

  // Check if user is logged in
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(firebaseAuth, (user) => {
      if (!user) {
        navigate("/login");
      }
    });
    return () => unsubscribe();
  }, [navigate]);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.pageYOffset !== 0);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="w-full min-h-screen bg-black text-white">
      <Navbar isScrolled={isScrolled} />
      <div className="px-8 pt-32 flex flex-col gap-12">
        <h1 className="text-3xl font-bold ml-12">My List</h1>
        {likedMovies.length > 0 ? (
          <div className="flex flex-wrap gap-4 justify-start">
            {likedMovies.map((movie, index) => (
              <Card
                movieData={movie}
                key={movie.id}
              />
            ))}
          </div>
        ) : (
          <div className="text-center text-white text-xl mt-16">
            <p>No movies in your list yet.</p>
            <p className="text-gray-400 mt-2">Add some movies to see them here!</p>
          </div>
        )}
      </div>
    </div>
  );
}
