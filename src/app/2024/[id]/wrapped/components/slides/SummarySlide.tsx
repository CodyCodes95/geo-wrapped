import { motion } from "framer-motion";
import { YearStats } from "../types/stats";

interface Props {
  stats: YearStats;
}

export const SummarySlide = ({ stats }: Props) => (
  <div className="flex min-h-screen flex-col items-center justify-center bg-[#191414] p-8">
    <h1 className="mb-8 bg-gradient-to-r from-[#1DB954] to-[#169c46] bg-clip-text text-4xl font-bold text-transparent">
      Your Year in Review
    </h1>

    <motion.div
      className="mb-12 grid max-w-3xl grid-cols-2 gap-8"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <div className="rounded-lg bg-[#282828] p-6">
        <h3 className="mb-2 text-xl text-green-400">Top Genre</h3>
        <p className="text-2xl font-bold text-white">{stats.topGenre.name}</p>
        <p className="text-gray-400">{stats.topGenre.hours} hours</p>
      </div>

      <div className="rounded-lg bg-[#282828] p-6">
        <h3 className="mb-2 text-xl text-green-400">Top Song</h3>
        <p className="text-2xl font-bold text-white">{stats.topSong.name}</p>
        <p className="text-gray-400">{stats.topSong.playCount} plays</p>
      </div>

      <div className="rounded-lg bg-[#282828] p-6">
        <h3 className="mb-2 text-xl text-green-400">Listening Pattern</h3>
        <p className="text-2xl font-bold text-white">
          {stats.listeningClock.type}
        </p>
        <p className="text-gray-400">Peak at {stats.listeningClock.peakHour}</p>
      </div>

      <div className="rounded-lg bg-[#282828] p-6">
        <h3 className="mb-2 text-xl text-green-400">Dominant Mood</h3>
        <p className="text-2xl font-bold text-white">{stats.moods[0].name}</p>
        <p className="text-gray-400">{stats.moods[0].percentage}% of tracks</p>
      </div>
    </motion.div>

    <motion.button
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className="rounded-full bg-green-400 px-8 py-4 font-bold text-black transition-colors hover:bg-green-500"
      onClick={() => (window.location.href = "/dashboard")}
    >
      View Full Stats Dashboard
    </motion.button>
  </div>
);
