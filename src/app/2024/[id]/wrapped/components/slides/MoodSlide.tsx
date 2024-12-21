import { motion } from "framer-motion";
import { YearStats } from "../Wrapped";


interface Props {
  stats: YearStats;
}

export const MoodSlide = ({ stats }: Props) => (
  <div className="flex min-h-screen flex-col items-center justify-center bg-[#191414]">
    <h1 className="mb-4 bg-gradient-to-r from-[#1DB954] to-[#169c46] bg-clip-text text-4xl font-bold text-transparent">
      Your Musical Moods
    </h1>
    <div className="mb-12 text-gray-400">The emotions in your music</div>

    <div className="grid max-w-2xl grid-cols-2 gap-8">
      {stats.moods.map((mood, index) => (
        <motion.div
          key={mood.name}
          initial={{ x: index % 2 === 0 ? -50 : 50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: index * 0.2 }}
          className="text-center"
        >
          <div className="mb-4 text-6xl">{mood.emoji}</div>
          <div className="mb-2 text-2xl">{mood.name}</div>
          <div className="text-gray-400">{mood.percentage}% of your tracks</div>
        </motion.div>
      ))}
    </div>
  </div>
);
