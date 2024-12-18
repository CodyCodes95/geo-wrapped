import React, { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { WelcomeSlide } from "./slides/WelcomeSlide";
import { TopGenreSlide } from "./slides/TopMapSlide";
import { ListeningClockSlide } from "./slides/ListeningClockSlide";
import { MoodSlide } from "./slides/MoodSlide";
import { TopSongSlide } from "./slides/TopSongSlide";
import { SummarySlide } from "./slides/SummarySlide";

export type YearStats = {
  topGenre: {
    name: string;
    hours: number;
    topArtists: string[];
  };
  listeningClock: {
    peakHour: string;
    timeRange: string;
    type: string;
  };
  moods: {
    name: string;
    percentage: number;
    emoji: string;
  }[];
  topSong: {
    name: string;
    artist: string;
    playCount: number;
    minutes: number;
    imageUrl: string;
  };
};

export const yearStats = {
  topGenre: {
    name: "Electronic",
    hours: 1284,
    topArtists: ["Daft Punk", "Deadmau5", "The Chemical Brothers"],
  },
  listeningClock: {
    peakHour: "11 PM",
    timeRange: "11 PM - 2 AM",
    type: "Night Owl 🦉",
  },
  moods: [
    { name: "Energetic", percentage: 42, emoji: "🎵" },
    { name: "Chill", percentage: 35, emoji: "✨" },
    { name: "Melancholic", percentage: 13, emoji: "💫" },
    { name: "Intense", percentage: 10, emoji: "⚡" },
  ],
  topSong: {
    name: "Around the World",
    artist: "Daft Punk",
    playCount: 247,
    minutes: 823,
    imageUrl: "https://source.unsplash.com/featured/400x400?album",
  },
};

const slides = [
  WelcomeSlide,
  TopGenreSlide,
  ListeningClockSlide,
  MoodSlide,
  TopSongSlide,
  SummarySlide,
];

const Wrapped = () => {
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
          <CurrentSlideComponent stats={yearStats} />
        ) : (
          <CurrentSlideComponent stats={yearStats} />
        )}
      </motion.div>
    </AnimatePresence>
  );
};

export default Wrapped;
