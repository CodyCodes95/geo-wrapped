import { motion } from "framer-motion";
import { type YearStats } from "../Wrapped";
import { getCountryFlagEmoji } from "~/utils";

type Props = {
  stats: YearStats;
};

export const WeakestCountriesSlide = ({ stats }: Props) => (
  <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-[#191414]">
    <h1 className="bg bg-clip-text text-4xl font-bold text-primary">
      Your Weakest Countries
    </h1>
    <div className="mb-12 text-gray-400">
      Imagine not getting these right 💀
    </div>

    <div className="grid max-w-2xl grid-cols-2 gap-8">
      {stats.weakestCountries.map((stat, index) => (
        <motion.div
          key={stat.country}
          initial={{ x: index % 2 === 0 ? -50 : 50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: index * 0.2 }}
          className="text-center"
        >
          <div className="mb-4 text-6xl">
            {getCountryFlagEmoji(stat.country)}
          </div>
          <p>
            Guessed correctly {stat.correctGuesses} out of {stat.totalGuesses}{" "}
            rounds
          </p>
        </motion.div>
      ))}
    </div>
  </div>
);
