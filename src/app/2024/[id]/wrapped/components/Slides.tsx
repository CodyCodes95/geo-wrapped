import { motion } from "framer-motion";
import { getCountryFlagEmoji } from "~/utils";
import { type YearStats } from "./Wrapped";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "~/components/ui/tooltip";
import { getCountryName } from "~/utils/countryCodes";
import { type WrappedStats } from "../page";
import { ExternalLinkIcon } from "lucide-react";

type Props = {
  stats: WrappedStats;
};

export const FavouriteMapSlide = ({ stats }: Props) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex min-h-screen flex-col items-center justify-center bg-[#191414]"
    >
      <h1 className="mb-8 bg-clip-text text-4xl font-bold">
        Your Top Map: {stats.topMap.name}
      </h1>

      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="text-center"
      >
        <div className="mb-4 text-6xl font-bold text-green-400">
          {stats.topMap.gamesPlayed} games played
        </div>
        <div className="text-gray-400">
          Favourite mode: {stats.topMap.bestGames[0]?.gameMode}
        </div>
      </motion.div>

      <motion.div
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="mt-12 text-center"
      >
        <div className="mb-2 text-2xl">Top 3 games on {stats.topMap.name}</div>
        <div className="text-xl text-gray-400">
          {stats.topMap.bestGames.map((game, index) => (
            <div className="flex justify-between" key={index}>
              <span>
                {index + 1}. {game.gameMode} - {game.points} points
              </span>
              <ExternalLinkIcon
                href={game.summaryUrl}
                className="cursor-pointer text-primary"
              />
            </div>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
};

export const WeakestCountries = ({ stats }: Props) => (
  <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-[#191414]">
    <h1 className="bg bg-clip-text text-4xl font-bold text-primary">
      Your Weakest Countries
    </h1>
    <div className="mb-12 text-gray-400">Imagine getting these wrong 💀</div>

    <div className="grid max-w-2xl grid-cols-2 gap-8">
      {stats.weakestCountries.map((stat, index) => (
        <motion.div
          key={stat.country}
          initial={{ x: index % 2 === 0 ? -50 : 50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: index * 0.2 }}
          className="flex flex-col gap-2 text-center"
        >
          <TooltipProvider>
            <Tooltip delayDuration={0}>
              <TooltipTrigger className="cursor-pointer text-6xl">
                {getCountryFlagEmoji(stat.country)}
              </TooltipTrigger>
              <TooltipContent>
                <span>{getCountryName(stat.country)}</span>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          <p>
            Guessed correctly {stat.correctGuesses} out of {stat.totalGuesses}{" "}
            rounds
          </p>
        </motion.div>
      ))}
    </div>
  </div>
);

export const StrongestCountries = ({ stats }: Props) => (
  <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-[#191414]">
    <h1 className="bg bg-clip-text text-4xl font-bold text-primary">
      Your Strongest Countries
    </h1>
    <div className="mb-12 text-gray-400">
      You were most accurate guessing these countries
    </div>

    <div className="grid max-w-2xl grid-cols-2 gap-8">
      {stats.strongestCountries.map((stat, index) => (
        <motion.div
          key={stat.country}
          initial={{ x: index % 2 === 0 ? -50 : 50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: index * 0.2 }}
          className="flex flex-col gap-2 text-center"
        >
          <TooltipProvider>
            <Tooltip delayDuration={0}>
              <TooltipTrigger className="cursor-pointer text-6xl">
                {getCountryFlagEmoji(stat.country)}
              </TooltipTrigger>
              <TooltipContent>
                <span>{getCountryName(stat.country)}</span>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          <p>
            Guessed correctly {stat.correctGuesses} out of {stat.totalGuesses}{" "}
            rounds
          </p>
        </motion.div>
      ))}
    </div>
  </div>
);
