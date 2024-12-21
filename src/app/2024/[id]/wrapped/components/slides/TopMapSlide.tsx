import { motion } from "framer-motion";
import { type YearStats } from "../Wrapped";

interface Props {
  stats: YearStats;
}

export const TopGenreSlide = ({ stats }: Props) => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    className="flex min-h-screen flex-col items-center justify-center bg-[#191414]"
  >
    <h1 className="mb-8 bg-gradient-to-r from-[#1DB954] to-[#169c46] bg-clip-text text-4xl font-bold text-transparent">
      Your Top Genre: {stats.topGenre.name}
    </h1>

    <motion.div
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ delay: 0.3 }}
      className="text-center"
    >
      <div className="mb-4 text-6xl font-bold text-green-400">
        {stats.topGenre.hours} hours
      </div>
      <div className="text-gray-400">
        spent listening to {stats.topGenre.name.toLowerCase()} music
      </div>
    </motion.div>

    <motion.div
      initial={{ y: 50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 0.6 }}
      className="mt-12 text-center"
    >
      <div className="mb-2 text-2xl">Top Artists in {stats.topGenre.name}</div>
      <div className="text-xl text-gray-400">
        {stats.topGenre.topArtists.map((artist, index) => (
          <div key={artist}>
            {index + 1}. {artist}
          </div>
        ))}
      </div>
    </motion.div>
  </motion.div>
);
