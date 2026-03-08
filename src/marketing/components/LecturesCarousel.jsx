import React, { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { FiChevronLeft, FiChevronRight, FiPlay, FiClock } from "react-icons/fi";
import { Link } from "react-router-dom";

const LectureCard = ({ lecture }) => {
  const getYouTubeThumbnail = (url) => {
    if (!url) return "";
    const videoId = url.match(
      /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/,
    );
    return videoId
      ? `https://img.youtube.com/vi/${videoId[1]}/maxresdefault.jpg`
      : "";
  };

  const thumbnail =
    lecture.thumbnailUrl || getYouTubeThumbnail(lecture.videoUrl);

  return (
    <motion.div
      className="bg-white rounded-2xl shadow-lg overflow-hidden h-full flex flex-col group"
      whileHover={{ y: -5 }}
      transition={{ duration: 0.3 }}
    >
      {/* Thumbnail */}
      <div className="relative aspect-video bg-gray-100 overflow-hidden">
        <img
          src={thumbnail || "/Images/default-video-thumbnail.jpg"}
          alt={lecture.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          onError={(e) => {
            e.target.src = "/Images/default-video-thumbnail.jpg";
          }}
        />
        {/* Play button overlay */}
        <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
          <motion.a
            href={lecture.videoUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-16 h-16 bg-white/90 rounded-full flex items-center justify-center shadow-xl"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            <FiPlay className="w-7 h-7 text-indigo-600 ml-1" />
          </motion.a>
        </div>
        {/* Duration badge */}
        {lecture.duration && (
          <div className="absolute bottom-2 right-2 px-2 py-1 bg-black/80 text-white text-xs rounded-md flex items-center gap-1">
            <FiClock className="w-3 h-3" />
            {lecture.duration}
          </div>
        )}
        {/* Subject badge */}
        <div className="absolute top-2 left-2 px-3 py-1 bg-indigo-600 text-white text-xs font-semibold rounded-full">
          {lecture.subject}
        </div>
      </div>

      {/* Content */}
      <div className="p-5 flex-1 flex flex-col">
        <h3 className="font-bold text-gray-900 text-lg mb-2 line-clamp-2 group-hover:text-indigo-600 transition-colors">
          {lecture.title}
        </h3>
        {lecture.description && (
          <p className="text-gray-600 text-sm line-clamp-2 mb-3 flex-1">
            {lecture.description}
          </p>
        )}
        <div className="flex items-center justify-between text-sm">
          {lecture.instructor && (
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center">
                <span className="text-indigo-600 font-semibold text-xs">
                  {lecture.instructor
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </span>
              </div>
              <span className="text-gray-600">{lecture.instructor}</span>
            </div>
          )}
          {lecture.class && (
            <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs">
              {lecture.class}
            </span>
          )}
        </div>
      </div>
    </motion.div>
  );
};

const LecturesCarousel = ({ lectures }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [cardsToShow, setCardsToShow] = useState(3);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setCardsToShow(1);
      } else if (window.innerWidth < 1024) {
        setCardsToShow(2);
      } else {
        setCardsToShow(3);
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const nextSlide = useCallback(() => {
    setCurrentIndex((prevIndex) =>
      prevIndex + 1 > lectures.length - cardsToShow ? 0 : prevIndex + 1,
    );
  }, [lectures.length, cardsToShow]);

  const prevSlide = useCallback(() => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0
        ? Math.max(0, lectures.length - cardsToShow)
        : prevIndex - 1,
    );
  }, [lectures.length, cardsToShow]);

  useEffect(() => {
    const timer = setInterval(() => {
      nextSlide();
    }, 6000);
    return () => clearInterval(timer);
  }, [nextSlide]);

  const handleDragEnd = (event, info) => {
    const swipeThreshold = 50;
    if (info.offset.x < -swipeThreshold) {
      nextSlide();
    } else if (info.offset.x > swipeThreshold) {
      prevSlide();
    }
  };

  if (!lectures || lectures.length === 0) {
    return null;
  }

  return (
    <div className="relative">
      {/* Navigation Buttons */}
      <div className="hidden md:block absolute top-1/2 md:-left-12 -translate-y-1/2 z-10">
        <button
          onClick={prevSlide}
          className="p-3 rounded-full bg-white shadow-lg text-indigo-900 hover:text-indigo-700 hover:bg-gray-50 transition-all duration-300 transform hover:scale-110 border border-gray-100"
          aria-label="Previous lectures"
        >
          <FiChevronLeft size={24} />
        </button>
      </div>

      <div className="hidden md:block absolute top-1/2 md:-right-12 -translate-y-1/2 z-10">
        <button
          onClick={nextSlide}
          className="p-3 rounded-full bg-white shadow-lg text-indigo-900 hover:text-indigo-700 hover:bg-gray-50 transition-all duration-300 transform hover:scale-110 border border-gray-100"
          aria-label="Next lectures"
        >
          <FiChevronRight size={24} />
        </button>
      </div>

      {/* Carousel Track */}
      <div className="overflow-hidden py-4 -mx-4 px-4 h-full">
        <motion.div
          className="flex select-none cursor-grab active:cursor-grabbing"
          animate={{ x: `-${currentIndex * (100 / cardsToShow)}%` }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          drag="x"
          dragConstraints={{ left: 0, right: 0 }}
          dragElastic={0.2}
          onDragEnd={handleDragEnd}
        >
          {lectures.map((lecture) => (
            <div
              key={lecture.id}
              className="flex-shrink-0 px-3"
              style={{ width: `${100 / cardsToShow}%` }}
            >
              <LectureCard lecture={lecture} />
            </div>
          ))}
        </motion.div>
      </div>

      {/* Dots Indicator */}
      <div className="flex justify-center mt-8 gap-2">
        {Array.from({
          length: Math.ceil(lectures.length - cardsToShow + 1),
        }).map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrentIndex(idx)}
            className={`h-2 rounded-full transition-all duration-300 ${
              idx === currentIndex
                ? "w-6 bg-indigo-600"
                : "w-2 bg-gray-300 hover:bg-indigo-300"
            }`}
            aria-label={`Go to slide ${idx + 1}`}
          />
        ))}
      </div>
    </div>
  );
};

export default LecturesCarousel;
