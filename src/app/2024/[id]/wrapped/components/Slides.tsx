"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { getCountryFlagEmoji } from "~/utils";
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
import { api } from "~/trpc/react";
import { Input } from "~/components/ui/input";
import { Button } from "~/components/ui/button";
import { toast } from "sonner";

type Props = {
  stats: WrappedStats;
};

export const ProcessingSlide = ({ playerId }: { playerId: string }) => {
  const [email, setEmail] = useState("");

  const player = api.players.getPlayer.useQuery({ id: playerId });
  const addEmail = api.players.addEmailNotification.useMutation({
    onSuccess: () => {
      toast.success("We'll email you when your wrapped is ready.");
      void player.refetch();
    },
    onError: () => {
      toast.error("Something went wrong. Please try again.");
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addEmail.mutate({ playerId, email });
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex min-h-screen flex-col items-center justify-center bg-[#191414] p-8 text-center"
    >
      <h1 className="text-5xl text-primary">
        We are processing your data. Save this link and come back soon to see
        the results!
      </h1>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="mt-12 max-w-2xl text-muted-foreground"
      >
        <p className="mb-8">
          Thank you for checking out GeoWrapped! {"We're"} currently overwhelmed
          with the amazing response and processing is taking longer than
          expected. The estimated time for your wrapped to be ready is ~4 hours.
        </p>

        {player.data?.email ? (
          <div className="rounded-lg border border-primary/20 p-6">
            <p className="text-primary">
              {"We'll"} send you an email at {player.data.email} once your
              wrapped is ready!
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <p className="text-sm">
              Enter your email to be notified when your wrapped is ready:
            </p>
            <div className="flex gap-2">
              <Input
                type="email"
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="max-w-sm"
              />
              <Button type="submit" disabled={addEmail.isPending}>
                {addEmail.isPending ? "Submitting..." : "Notify Me"}
              </Button>
            </div>
          </form>
        )}
      </motion.div>
    </motion.div>
  );
};

export const WelcomeSlide = () => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    className="flex min-h-screen flex-col items-center justify-center bg-[#191414] text-center"
  >
    <h1 className="text-6xl font-bold text-primary">Your 2024 in Geo</h1>
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
      className="flex min-h-screen flex-col items-center justify-center gap-4 bg-[#191414] p-4"
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
        className="mt-8 w-full max-w-2xl"
      >
        <h2 className="mb-4 text-center text-2xl font-bold text-primary">
          Top Games
        </h2>
        <div className="grid gap-4">
          {stats.bestGames.map((game, index) => (
            <div
              key={index}
              className="flex items-center justify-between rounded-lg border border-primary/20 p-4"
            >
              <div className="flex flex-col gap-1">
                <span className="text-xl font-bold text-primary">
                  {game.points?.toLocaleString()} points
                </span>
                <span className="text-sm text-muted-foreground">
                  {game.mapName} - {game.gameMode}
                </span>
              </div>
              <Link
                href={`https://www.geoguessr.com/results/${game.summaryId}`}
                target="_blank"
                className="text-primary hover:underline"
              >
                View game
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
          <span className="text-5xl font-bold text-primary">
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

      <motion.div
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 1.2 }}
        className="mt-8 w-full max-w-2xl"
      >
        <h2 className="mb-4 text-center text-2xl font-bold text-primary">
          Top Guesses
        </h2>
        <div className="grid gap-4">
          {stats.scoreStats.topGuesses.map((guess, index) => (
            <div
              key={index}
              className="flex items-center justify-between rounded-lg border border-primary/20 p-4"
            >
              <div className="flex flex-col gap-1">
                <span className="text-xl font-bold text-primary">
                  {guess.points} points
                </span>
                <span className="text-sm text-muted-foreground">
                  {guess.mapName}
                  {guess.gameType === "Duel" && " Duels"} - {guess.gameMode}
                </span>
              </div>
              <div className="flex flex-col items-end gap-1 text-sm text-muted-foreground">
                <span>{Math.round(guess.distanceInMeters)}m away</span>
                <span>Guessed in {guess.timeInSeconds}s</span>
                <Link
                  href={`https://www.geoguessr.com${guess.gameUrl}`}
                  target="_blank"
                  className="text-primary hover:underline"
                >
                  View game
                </Link>
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export const CompteitivePerformanceSlide = ({ stats }: Props) => {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-8 bg-[#191414] p-4">
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-4xl font-bold text-primary"
      >
        Your Competitive Performance
      </motion.h1>

      <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="flex flex-col items-center gap-2 rounded-lg border border-primary/20 p-6 text-center"
        >
          <span className="text-5xl font-bold text-primary">
            {stats.competitiveStats.totalDuels}
          </span>
          <span className="text-xl text-muted-foreground">Total Duels</span>
        </motion.div>

        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="flex flex-col items-center gap-2 rounded-lg border border-primary/20 p-6 text-center"
        >
          <span className="text-5xl font-bold text-primary">
            {stats.competitiveStats.totalDuelsWon}
          </span>
          <span className="text-xl text-muted-foreground">Duels Won</span>
        </motion.div>
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="flex flex-col items-center gap-2 rounded-lg border border-primary/20 p-6 text-center"
        >
          <span className="text-5xl font-bold text-primary">
            {stats.competitiveStats.winPercentage}%
          </span>
          <span className="text-xl text-muted-foreground">Win rate</span>
        </motion.div>

        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="flex flex-col items-center gap-2 rounded-lg border border-primary/20 p-6 text-center"
        >
          <span className="text-5xl font-bold text-primary">
            {stats.competitiveStats.flawlessVictories}
          </span>
          <span className="text-xl text-muted-foreground">
            Flawless Victories
          </span>
        </motion.div>

        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 1.0 }}
          className="flex flex-col items-center gap-2 rounded-lg border border-primary/20 p-6 text-center"
        >
          <span className="text-5xl font-bold text-primary">
            {stats.competitiveStats.avgScore}
          </span>
          <span className="text-xl text-muted-foreground">Average Score</span>
        </motion.div>
      </div>

      <motion.div
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 1.2 }}
        className="mt-8 w-full max-w-2xl"
      >
        <h2 className="mb-4 text-center text-2xl font-bold text-primary">
          Toughest Duels Won
        </h2>
        <div className="grid gap-4">
          {stats.competitiveStats.toughestWonDuels.map((duel, index) => (
            <div
              key={index}
              className="flex items-center justify-between rounded-lg border border-primary/20 p-4"
            >
              <div className="flex flex-col gap-1">
                <span className="text-xl font-bold text-primary">
                  {duel.roundCount} rounds
                </span>
                <span className="text-sm text-muted-foreground">
                  {duel.mapName}
                </span>
              </div>
              <Link
                className="hover:text-primary"
                href={`https://www.geoguessr.com${duel.gameUrl}`}
              >
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">
                    View game
                  </span>
                  <ExternalLinkIcon className="h-5 w-5" />
                </div>
              </Link>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export const SummarySlide = ({ stats }: Props) => (
  <div className="flex min-h-screen flex-col items-center justify-center bg-[#191414] p-8">
    <h1 className="mb-8 text-4xl font-bold text-primary">
      Your Year in Review
    </h1>

    <motion.div
      className="mb-12 grid max-w-3xl grid-cols-2 gap-8"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      {/* <div className="rounded-lg bg-[#282828] p-6">
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
        <h3 className="mb-2 text-xl text-green-400">Dominant Mood</h3> */}
      {/* <p className="text-2xl font-bold text-white">{stats.moods[0].name}</p> */}
      {/* <p className="text-gray-400">{stats.moods[0].percentage}% of tracks</p> */}
      {/* </div> */}
    </motion.div>
    <Link href=".">
      <motion.button
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="rounded-full bg-green-400 px-8 py-4 font-bold text-black transition-colors hover:bg-primary"
      >
        View Full Stats Dashboard
      </motion.button>
    </Link>
  </div>
);

export const WeakestCountries = ({ stats }: Props) => {
  const [showAll, setShowAll] = useState(false);
  const displayedCountries = showAll
    ? stats.weakestCountries
    : stats.weakestCountries.slice(0, 4);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-[#191414] p-4">
      <h1 className="bg bg-clip-text text-4xl font-bold text-primary">
        Your Weakest Countries
      </h1>
      <div className="mb-12 text-gray-400">Imagine getting these wrong 💀</div>

      <div
        className={`grid max-w-2xl ${showAll ? "grid-cols-1" : "grid-cols-2"} gap-8`}
      >
        {displayedCountries.map((stat, index) => (
          <motion.div
            key={stat.country}
            initial={{
              x: showAll ? 0 : index % 2 === 0 ? -50 : 50,
              opacity: 0,
            }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: index * 0.1 }}
            className={`flex ${showAll ? "flex-row" : "flex-col"} items-center gap-4 text-center`}
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
            <div className="flex flex-col">
              <p className="text-sm">
                {stat.correctGuesses} out of {stat.totalGuesses} rounds
              </p>
              <p className="text-xs text-primary">{stat.percentage}% correct</p>
            </div>
          </motion.div>
        ))}
      </div>

      {!showAll && stats.weakestCountries.length > 4 && (
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          onClick={() => setShowAll(true)}
          className="mt-4 rounded-full bg-primary/10 px-6 py-2 text-primary hover:bg-primary/20"
        >
          See top 20
        </motion.button>
      )}
    </div>
  );
};

export const StrongestCountries = ({ stats }: Props) => {
  const [showAll, setShowAll] = useState(false);
  const displayedCountries = showAll
    ? stats.strongestCountries
    : stats.strongestCountries.slice(0, 4);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-[#191414] p-4">
      <h1 className="bg bg-clip-text text-4xl font-bold text-primary">
        Your Strongest Countries
      </h1>
      <div className="mb-12 text-gray-400">
        You were most accurate guessing these countries
      </div>

      <div
        className={`grid max-w-2xl ${showAll ? "grid-cols-1" : "grid-cols-2"} gap-8`}
      >
        {displayedCountries.map((stat, index) => (
          <motion.div
            key={stat.country}
            initial={{
              x: showAll ? 0 : index % 2 === 0 ? -50 : 50,
              opacity: 0,
            }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: index * 0.1 }}
            className={`flex ${showAll ? "flex-row" : "flex-col"} items-center gap-4 text-center`}
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
            <div className="flex flex-col">
              <p className="text-sm">
                {stat.correctGuesses} out of {stat.totalGuesses} rounds
              </p>
              <p className="text-xs text-primary">{stat.percentage}% correct</p>
            </div>
          </motion.div>
        ))}
      </div>

      {!showAll && stats.strongestCountries.length > 4 && (
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          onClick={() => setShowAll(true)}
          className="mt-4 rounded-full bg-primary/10 px-6 py-2 text-primary hover:bg-primary/20"
        >
          See top 20
        </motion.button>
      )}
    </div>
  );
};
