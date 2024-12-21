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

type Props = {
  stats: YearStats;
};

export const WeakestCountries = ({ stats }: Props) => (
  <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-[#191414]">
    <h1 className="bg bg-clip-text text-4xl font-bold text-primary">
      Your Weakest Countries
    </h1>
    <div className="mb-12 text-gray-400">
      Imagine not getting these wrong 💀
    </div>

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
