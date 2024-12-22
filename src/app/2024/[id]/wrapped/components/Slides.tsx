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
import Link from "next/link";

type Props = {
  stats: WrappedStats;
};

export const WelcomeSlide = () => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    className="flex min-h-screen flex-col items-center justify-center bg-[#191414] text-center"
  >
    <h1 className="bg-gradient-to-r from-primary to-[#15cf4b] bg-clip-text text-6xl font-bold text-transparent">
      Your 2024 in Geo
    </h1>
    <div className="mt-4 text-xl text-primary"></div>
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5 }}
      className="mt-12 text-muted-foreground"
    >
      Press Space to begin
    </motion.div>
  </motion.div>
);

export const RecapSlide = ({ stats }: Props) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex min-h-screen flex-col items-center justify-center gap-4 bg-[#191414]"
    >
      <h1 className="mb-8 bg-clip-text text-4xl font-bold">
        Total games played: {stats.totalStats.totalGamesPlayed}
      </h1>

      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="flex flex-col gap-2 text-center"
      >
        <div className="flex flex-col gap-2">
          <h2 className="text-6xl font-bold text-primary">
            Favourite map: {stats.totalStats.favouriteMap}
          </h2>
          <p className="text-sm text-muted-foreground">
            (Played {stats.totalStats.favouriteMapGamesPlayed} times)
          </p>
        </div>
        <p className="text-muted-foreground">
          Favourite mode: {stats.totalStats.favouriteMode}
        </p>
      </motion.div>

      <motion.div
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="flex flex-col gap-2 text-center"
      >
        <div className="text-2xl">Top 3 games</div>
        <div className="text-xl text-gray-400">
          {stats.bestGames.map((game, index) => (
            <div className="flex justify-between gap-4" key={index}>
              <span>
                {index + 1}. {game.mapName} - {game.gameMode} - {game.points}{" "}
                points
              </span>
              <Link
                target="_blank"
                href={`https://www.geoguessr.com/results/${game.summaryId}`}
              >
                <ExternalLinkIcon className="text-primary" />
              </Link>
            </div>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
};

export const ScoreSlide = ({ stats }: Props) => {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-8 bg-[#191414] p-4">
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-4xl font-bold text-primary"
      >
        Your Guess Breakdown
      </motion.h1>

      <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="flex flex-col items-center gap-2 rounded-lg border border-primary/20 p-6 text-center"
        >
          <span className="text-5xl font-bold text-green-500">
            {stats.scoreStats.perfectScores}
          </span>
          <span className="text-xl text-muted-foreground">{"5K's"}</span>
          <span className="text-sm text-muted-foreground">Perfect scores</span>
        </motion.div>

        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="flex flex-col items-center gap-2 rounded-lg border border-primary/20 p-6 text-center"
        >
          <span className="text-5xl font-bold text-red-500">
            {stats.scoreStats.zeroScores}
          </span>
          <span className="text-xl text-muted-foreground">Zero Scores</span>
          <span className="text-sm text-muted-foreground">
            {stats.scoreStats.timedOutGuesses} of those you timed out on 😂🫵
          </span>
        </motion.div>

        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="flex flex-col items-center gap-2 rounded-lg border border-primary/20 p-6 text-center"
        >
          <span className="text-5xl font-bold text-primary">
            {Math.round(stats.scoreStats.avgScore).toLocaleString()}
          </span>
          <span className="text-xl text-muted-foreground">Average Score</span>
          <span className="text-sm text-muted-foreground">
            Points per round
          </span>
        </motion.div>

        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="flex flex-col items-center gap-2 rounded-lg border border-primary/20 p-6 text-center"
        >
          <span className="text-5xl font-bold text-primary">
            {Math.round(stats.scoreStats.avgTime)}s
          </span>
          <span className="text-xl text-muted-foreground">
            Average Time To Guess
          </span>
          <span className="text-sm text-muted-foreground">
            Seconds per guess
          </span>
        </motion.div>

        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 1 }}
          className="flex flex-col items-center gap-2 rounded-lg border border-primary/20 p-6 text-center"
        >
          <span className="text-5xl font-bold text-primary">
            {Math.round(stats.scoreStats.avgDistance).toLocaleString()}
          </span>
          <span className="text-xl text-muted-foreground">
            Average Distance
          </span>
          <span className="text-sm text-muted-foreground">Kilometers off</span>
        </motion.div>
      </div>
    </div>
  );
};

export const CompteitivePerformanceSlide = ({ stats }: Props) => {
  return (
    <div>
      <p></p>
    </div>
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
