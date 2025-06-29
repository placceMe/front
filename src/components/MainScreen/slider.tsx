import React, { useState, useEffect } from "react";

import "./slider.css";

import Slide1 from "../../assets/slider/slide1.png"
import Slide2 from "../../assets/slider/slide2.png"
import Slide3 from "../../assets/slider/slide3.png"
const slides = [
  { id: 1, image: Slide1, alt: "Захист - 1" },
  { id: 2, image: Slide2, alt: "Захист - 2" },
  { id: 3, image: Slide3, alt: "Захист - 3" },
];

const Slider: React.FC = () => {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 5000); // 5 секунд

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="slider">
      {slides.map((slide, index) => (
        <div
          key={slide.id}
          className={`slide ${index === current ? "active" : ""}`}
        >
          <img src={slide.image} alt={slide.alt} />
        </div>
      ))}
      <div className="dots">
        {slides.map((_, index) => (
          <span
            key={index}
            className={`dot ${index === current ? "active-dot" : ""}`}
            onClick={() => setCurrent(index)}
          ></span>
        ))}
      </div>
    </div>
  );
};

export default Slider;
