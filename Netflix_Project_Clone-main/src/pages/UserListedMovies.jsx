import { onAuthStateChanged } from "firebase/auth";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { firebaseAuth } from "../utils/firebase-config";
import Card from "../components/Card";
import Navbar from "../components/Navbar";
import { useNetflix } from "../store/SimpleStore.jsx";

export default function UserListedMovies() {
  const navigate = useNavigate();
  const [isScrolled, setIsScrolled] = useState(false);
  const [user, setUser] = useState(null);


  const { movies, loading, getLikedMovies } = useNetflix();


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


  useEffect(() => {
    if (user && user.email) {
      getLikedMovies(user.email); 
    }
  }, [user]);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.pageYOffset !== 0);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  if (!user) {
    return <div className="flex items-center justify-center h-screen text-white">Loading user...</div>;
  }

  if (loading) {
    return <div className="flex items-center justify-center h-screen text-white">Loading your movies...</div>;
  }

  return (
    <div className="w-full min-h-screen bg-black text-white">
      <Navbar isScrolled={isScrolled} />
      <div className="px-8 pt-32 flex flex-col gap-12">
        <h1 className="text-3xl font-bold ml-12">My List</h1>
        <div className="flex flex-wrap gap-4 justify-start">
          {movies.length > 0 ? (
            movies.map((movie, index) => (
              <Card
                movieData={movie}
                index={index}
                key={movie.id}
                isLiked={true}
              />
            ))
          ) : (
            <p className="text-center text-gray-400 ml-12">No movies in your list yet.</p>
          )}
        </div>
      </div>
    </div>
  );
}
