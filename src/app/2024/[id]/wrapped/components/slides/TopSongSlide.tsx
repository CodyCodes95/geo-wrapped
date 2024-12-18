import { motion } from "framer-motion";
import { YearStats } from "../types/stats";

interface Props {
  stats: YearStats;
}

export const TopSongSlide = ({ stats }: Props) => (
  <div className="flex min-h-screen flex-col items-center justify-center bg-[#191414] text-center">
    <h1 className="mb-4 bg-gradient-to-r from-[#1DB954] to-[#169c46] bg-clip-text text-4xl font-bold text-transparent">
      Your 2023 Anthem
    </h1>
    <div className="mb-8 text-gray-400">The song that defined your year</div>

    <motion.div
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      className="mb-8"
    >
      <div className="mb-4">
        <img
          src={stats.topSong.imageUrl}
          alt={stats.topSong.name}
          className="mx-auto h-64 w-64 rounded-lg shadow-xl"
        />
      </div>
      <div className="text-2xl font-bold text-white">{stats.topSong.name}</div>
      <div className="text-green-400">{stats.topSong.artist}</div>
      <div className="mt-2 text-gray-400">
        Played {stats.topSong.playCount} times
      </div>
    </motion.div>

    <motion.div
      initial={{ y: 50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 0.3 }}
      className="text-xl text-gray-400"
    >
      That's {stats.topSong.minutes} minutes of pure electronic bliss!
    </motion.div>
  </div>
);
