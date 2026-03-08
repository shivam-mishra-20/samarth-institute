import React, { useState, useEffect, useCallback, useMemo } from "react";
import { motion } from "framer-motion";
import { FiChevronLeft, FiChevronRight, FiPlay, FiClock } from "react-icons/fi";
import CourseCard from "../components/CourseCard";

// Lecture Card for combined carousel
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
      className="bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 border border-samarth-gray-200 overflow-hidden group flex flex-col h-full transform hover:-translate-y-1"
      whileHover={{ y: -4 }}
      transition={{ duration: 0.3 }}
    >
      {/* Thumbnail */}
      <div className="relative overflow-hidden h-48 bg-gray-100">
        <img
          src={thumbnail || "/Images/default-video-thumbnail.jpg"}
          alt={lecture.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
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
            className="w-14 h-14 bg-white/95 rounded-full flex items-center justify-center shadow-xl"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            <FiPlay className="w-6 h-6 text-red-600 ml-1" />
          </motion.a>
        </div>
        {/* Duration badge */}
        {lecture.duration && (
          <div className="absolute bottom-2 right-2 px-2 py-1 bg-black/80 text-white text-xs rounded-md flex items-center gap-1">
            <FiClock className="w-3 h-3" />
            {lecture.duration}
          </div>
        )}
        {/* Video badge */}
        <div className="absolute top-3 right-3 bg-red-600 text-white px-2 py-1 rounded-lg text-xs font-semibold flex items-center gap-1">
          <FiPlay className="w-3 h-3" /> Video
        </div>
        {/* Subject badge */}
        <div className="absolute top-3 left-3 px-3 py-1 bg-white/90 backdrop-blur-sm text-samarth-blue-700 text-xs font-semibold rounded-full">
          {lecture.subject}
        </div>
      </div>

      {/* Content */}
      <div className="p-5 flex-1 flex flex-col">
        <h3 className="text-xl font-bold text-samarth-blue-900 mb-2 line-clamp-2 group-hover:text-samarth-blue-700 transition-colors">
          {lecture.title}
        </h3>

        <div className="flex items-center text-sm text-samarth-gray-600 mb-4 mt-auto pt-2">
          {lecture.instructor && (
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-samarth-blue-100 rounded-full flex items-center justify-center">
                <span className="text-samarth-blue-600 font-semibold text-xs">
                  {lecture.instructor
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </span>
              </div>
              <span className="truncate">{lecture.instructor}</span>
            </div>
          )}
        </div>

        <div className="border-t border-samarth-gray-100 pt-4 flex items-center justify-between text-sm">
          {lecture.class && (
            <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs">
              {lecture.class}
            </span>
          )}
          <a
            href={lecture.videoUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-red-600 font-semibold hover:text-red-700 transition-colors flex items-center gap-1"
          >
            Watch <FiPlay className="w-3 h-3" />
          </a>
        </div>
      </div>
    </motion.div>
  );
};

const CoursesCarousel = ({ courses = [], lectures = [] }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [cardsToShow, setCardsToShow] = useState(3);

  // Combine courses and lectures into single array with type indicator
  const items = useMemo(
    () => [
      ...courses.map((course) => ({ ...course, _type: "course" })),
      ...lectures.map((lecture) => ({ ...lecture, _type: "lecture" })),
    ],
    [courses, lectures]
  );

  // Reset currentIndex when items change to avoid out-of-bounds
  useEffect(() => {
    if (items.length > 0 && currentIndex >= items.length) {
      setCurrentIndex(0);
    }
  }, [items.length, currentIndex]);

  // Responsive breakpoints
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

    handleResize(); // Initial check
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const nextSlide = useCallback(() => {
    if (items.length <= cardsToShow) return;
    setCurrentIndex((prevIndex) =>
      prevIndex + 1 > items.length - cardsToShow ? 0 : prevIndex + 1,
    );
  }, [items.length, cardsToShow]);

  const prevSlide = useCallback(() => {
    if (items.length <= cardsToShow) return;
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? Math.max(0, items.length - cardsToShow) : prevIndex - 1,
    );
  }, [items.length, cardsToShow]);

  // Auto-play
  useEffect(() => {
    if (items.length <= cardsToShow) return;
    const timer = setInterval(() => {
      nextSlide();
    }, 5000);
    return () => clearInterval(timer);
  }, [nextSlide, items.length, cardsToShow]);

  const handleDragEnd = (event, info) => {
    const swipeThreshold = 50;
    if (info.offset.x < -swipeThreshold) {
      nextSlide();
    } else if (info.offset.x > swipeThreshold) {
      prevSlide();
    }
  };

  // Return null if no items
  if (items.length === 0) {
    return null;
  }

  const showNavigation = items.length > cardsToShow;

  return (
    <div className="relative px-0 md:px-14">
      {/* Navigation Buttons */}
      {showNavigation && (
        <>
          <div className="hidden md:block absolute top-1/2 left-0 -translate-y-1/2 z-10">
            <button
              onClick={prevSlide}
              className="p-3 rounded-full bg-white shadow-lg text-samarth-blue-900 hover:text-samarth-blue-700 hover:bg-gray-50 transition-all duration-300 transform hover:scale-110 border border-gray-100"
              aria-label="Previous courses"
            >
              <FiChevronLeft size={24} />
            </button>
          </div>

          <div className="hidden md:block absolute top-1/2 right-0 -translate-y-1/2 z-10">
            <button
              onClick={nextSlide}
              className="p-3 rounded-full bg-white shadow-lg text-samarth-blue-900 hover:text-samarth-blue-700 hover:bg-gray-50 transition-all duration-300 transform hover:scale-110 border border-gray-100"
              aria-label="Next courses"
            >
              <FiChevronRight size={24} />
            </button>
          </div>
        </>
      )}

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
          {items.map((item) => (
            <div
              key={item.id}
              className="flex-shrink-0 px-3"
              style={{ width: `${100 / cardsToShow}%` }}
            >
              {item._type === "lecture" ? (
                <LectureCard lecture={item} />
              ) : (
                <CourseCard course={item} />
              )}
            </div>
          ))}
        </motion.div>
      </div>

      {/* Dots Indicator */}
      {showNavigation && (
        <div className="flex justify-center mt-8 gap-2">
          {Array.from({
            length: Math.max(1, items.length - cardsToShow + 1),
          }).map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentIndex(idx)}
              className={`h-2 rounded-full transition-all duration-300 ${
                idx === currentIndex
                  ? "w-6 bg-samarth-blue-700"
                  : "w-2 bg-gray-300 hover:bg-samarth-blue-300"
              }`}
              aria-label={`Go to slide ${idx + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default CoursesCarousel;
