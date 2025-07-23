import React, { useRef, useState, useEffect } from "react";
import { AiOutlineLeft, AiOutlineRight } from "react-icons/ai";
import Card from "./Card";

const CARD_WIDTH = 300; // Width of each card
const GAP = 16; // Gap between cards
const VISIBLE_CARDS = 5; // How many cards you want visible on screen

const CardSlider = ({ data, title }) => {
  const listRef = useRef();
  const [sliderPosition, setSliderPosition] = useState(0);
  const [showControls, setShowControls] = useState(false);

  const maxSliderPosition = Math.max(data.length - VISIBLE_CARDS, 0);

  const handleDirection = (direction) => {
    if (direction === "left" && sliderPosition > 0) {
      setSliderPosition(sliderPosition - 1);
    } else if (direction === "right") {
      if (sliderPosition < maxSliderPosition) {
        setSliderPosition(sliderPosition + 1);
      } else {
        setSliderPosition(0); // Reset to start
      }
    }
  };

  useEffect(() => {
    if (listRef.current) {
      const moveX = -(sliderPosition * (CARD_WIDTH + GAP));
      listRef.current.style.transition = "transform 0.3s ease-in-out";
      listRef.current.style.transform = `translateX(${moveX}px)`;
    }
  }, [sliderPosition]);

  return (
    <div
      className="relative py-8 flex flex-col gap-4"
      onMouseEnter={() => setShowControls(true)}
      onMouseLeave={() => setShowControls(false)}
    >
      <h1 className="text-white text-2xl font-semibold ml-[50px]">{title}</h1>

      <div className="relative overflow-visible">
        {/* Left Arrow */}
        {showControls && (
          <div className="absolute top-0 bottom-0 left-0 w-[50px] z-30 flex items-center justify-center">
            <AiOutlineLeft
              className={`text-white text-3xl cursor-pointer ${
                sliderPosition === 0 ? "opacity-40 cursor-not-allowed" : ""
              }`}
              onClick={() => handleDirection("left")}
            />
          </div>
        )}

        {/* Cards container */}
        <div
          ref={listRef}
          className="flex gap-4 ml-[50px] transition-transform duration-300 ease-in-out"
          style={{ minHeight: "150px", width: "max-content" }}
        >
          {data.map((movie, index) => (
            <Card
              key={movie.id}
              movieData={movie}
              index={index}
            />
          ))}
        </div>

        {/* Right Arrow */}
        {showControls && (
          <div className="absolute top-0 bottom-0 right-0 w-[50px] z-30 flex items-center justify-center">
            <AiOutlineRight
              className="text-white text-3xl cursor-pointer"
              onClick={() => handleDirection("right")}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default React.memo(CardSlider);
