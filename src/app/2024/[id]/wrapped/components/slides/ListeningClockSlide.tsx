import { motion } from "framer-motion";
import { type YearStats } from "../Wrapped";

interface Props {
  stats: YearStats;
}

export const ListeningClockSlide = ({ stats }: Props) => (
  <div className="flex min-h-screen flex-col items-center justify-center bg-[#191414]">
    <h1 className="mb-4 bg-gradient-to-r from-[#1DB954] to-[#169c46] bg-clip-text text-4xl font-bold text-transparent">
      Your Listening Clock
    </h1>
    <div className="mb-8 text-gray-400">When you listened the most</div>

    <div className="grid grid-cols-2 gap-12">
      <div className="relative h-64 w-64">
        <motion.div
          initial={{ rotate: -90 }}
          animate={{ rotate: 0 }}
          transition={{ duration: 1 }}
          className="absolute inset-0 rounded-full border-4 border-green-400"
        />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-4xl font-bold text-green-400">
            {stats.listeningClock.peakHour}
          </div>
        </div>
      </div>

      <div className="flex flex-col justify-center">
        <motion.div
          initial={{ x: 50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="mb-8"
        >
          <div className="mb-2 text-2xl">{stats.listeningClock.type}</div>
          <div className="text-gray-400">
            {/* You're most active during late hours */}
          </div>
        </motion.div>

        <motion.div
          initial={{ x: 50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          <div className="mb-2 text-xl">Most Active Time</div>
          <div className="text-green-400">{stats.listeningClock.timeRange}</div>
        </motion.div>
      </div>
    </div>
  </div>
);
