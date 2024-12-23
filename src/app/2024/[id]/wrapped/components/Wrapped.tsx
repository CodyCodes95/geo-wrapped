"use client";
import React, { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  WelcomeSlide,
  RecapSlide,
  StrongestCountries,
  WeakestCountries,
  ScoreSlide,
  CompteitivePerformanceSlide,
  SummarySlide,
} from "./Slides";
import { type WrappedStats } from "../page";
import { parseAsInteger, useQueryState } from "nuqs";

export type YearStats = {
  topGenre: {
    name: string;
    hours: number;
    topArtists: string[];
  };
  topMap: {
    name: string;
    gamesPlayed: number;
    minutesPlayed: number;
    averageScore: number;
    bestGames: {
      gameMode: string;
      points: number;
      summaryUrl: string;
    };
  };
  listeningClock: {
    peakHour: string;
    timeRange: string;
    type: string;
  };
  strongestCountries: {
    country: string;
    correctGuesses: number;
    totalGuesses: number;
  }[];
  weakestCountries: {
    country: string;
    correctGuesses: number;
    totalGuesses: number;
  }[];
  topSong: {
    name: string;
    artist: string;
    playCount: number;
    minutes: number;
    imageUrl: string;
  };
};

const slides = [
  WelcomeSlide,
  RecapSlide,
  ScoreSlide,
  StrongestCountries,
  WeakestCountries,
  CompteitivePerformanceSlide,
  SummarySlide,
];

const Wrapped = ({ stats }: { stats: WrappedStats }) => {
  const [currentSlide, setCurrentSlide] = useQueryState(
    "slide",
    parseAsInteger.withDefault(0),
  );

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.code === "Space" || e.code === "ArrowRight") {
      void setCurrentSlide((prev) => Math.min(prev + 1, slides.length - 1));
    } else if (e.code === "ArrowLeft") {
      void setCurrentSlide((prev) => Math.max(prev - 1, 0));
    }
  };

  const handleTouchClick = (direction: "left" | "right") => {
    if (direction === "right") {
      void setCurrentSlide((prev) => Math.min(prev + 1, slides.length - 1));
    } else {
      void setCurrentSlide((prev) => Math.max(prev - 1, 0));
    }
  };

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const CurrentSlideComponent = slides[currentSlide]!;

  return (
    <div className="relative min-h-screen">
      {/* Touch navigation areas */}
      <div
        className="fixed inset-y-0 left-0 z-10 w-1/4"
        onClick={() => handleTouchClick("left")}
      />
      <div
        className="fixed inset-y-0 right-0 z-10 w-1/4"
        onClick={() => handleTouchClick("right")}
      />

      <AnimatePresence mode="wait">
        <motion.div
          key={currentSlide}
          initial={{ opacity: 0, x: 100 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -100 }}
          transition={{ duration: 0.3 }}
        >
          {currentSlide === 0 ? (
            <CurrentSlideComponent stats={stats} />
          ) : (
            <CurrentSlideComponent stats={stats} />
          )}
        </motion.div>
      </AnimatePresence>

      {/* Slide indicators */}
      <div className="fixed bottom-8 left-1/2 z-20 flex -translate-x-1/2 gap-2">
        {slides.map((_, index) => (
          <div
            key={index}
            className={`h-2 w-2 rounded-full transition-all duration-300 ${
              index === currentSlide ? "w-4 bg-primary" : "bg-primary/20"
            }`}
          />
        ))}
      </div>
    </div>
  );
};

export default Wrapped;
