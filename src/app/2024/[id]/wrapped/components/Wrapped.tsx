"use client";
import React, { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { TopSongSlide } from "./slides/TopSongSlide";
import { SummarySlide } from "./slides/SummarySlide";
import {
  WelcomeSlide,
  RecapSlide,
  StrongestCountries,
  WeakestCountries,
  ScoreSlide,
} from "./Slides";
import { type WrappedStats } from "../page";

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
  // TopSongSlide,
  // SummarySlide,
];

const Wrapped = ({ stats }: { stats: WrappedStats }) => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.code === "Space" || e.code === "ArrowRight") {
      setCurrentSlide((prev) => Math.min(prev + 1, slides.length - 1));
    } else if (e.code === "ArrowLeft") {
      setCurrentSlide((prev) => Math.max(prev - 1, 0));
    }
  };

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const CurrentSlideComponent = slides[currentSlide]!;

  return (
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
  );
};

export default Wrapped;
