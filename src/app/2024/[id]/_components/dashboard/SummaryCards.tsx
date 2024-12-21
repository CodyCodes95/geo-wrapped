"use client";
import { Globe2Icon, MapIcon, TargetIcon, TrophyIcon } from "lucide-react";
import { usePlayerId } from "./_hooks/usePlayerId";
import { api } from "~/trpc/react";
import { StatCard } from "./StatCard";
import { getCountryFlagEmoji } from "~/utils";
import { useRainboltMode } from "./_hooks/useRainboltMode";
import { cn } from "~/lib/utils";
import { useMonth } from "../_layout/MonthSelector";

export const SummaryCards = () => {
  const { isRainboltMode } = useRainboltMode();
  if (isRainboltMode) {
    return (
      <>
        <ThailandRegionCard />
        <TimedOutCard />
        <GuessesInObamaCard />
        <MooDengCard />
      </>
    );
  }

  return (
    <>
      <TotalGamesCard />
      <AverageScoreCard />
      <TopCountryCard />
      <FavouriteMapCard />
    </>
  );
};

const ThailandRegionCard = () => {
  const playerId = usePlayerId()!;
  const { selectedMonth } = useMonth();
  const { data: guesses } = api.guesses.thailandRegionGuesses.useQuery({
    playerId,
    selectedMonth,
  });
  return (
    <StatCard
      icon={getCountryFlagEmoji("TH")}
      iconColor="text-green-500"
      title={`Thailand Region Guesses (withim 100km)`}
      value={guesses?.hundredKm?.length ?? 0}
      detailedContent={
        <div>
          <h3 className="mb-2 text-lg font-semibold">MooDeng Breakdown</h3>
          <ul className="flex flex-col gap-2">
            <li className="flex w-full items-center justify-between">
              <span>{"5k's"} in Thailand:</span>
              <span className="text-primary">
                {guesses?.fiveK?.length ?? 0}
              </span>
            </li>
            <li className="flex w-full items-center justify-between">
              <span>Thailand guesses within 50km:</span>
              <span className="text-primary">
                {guesses?.fiftyKm?.length ?? 0}
              </span>
            </li>
            <li className="flex w-full items-center justify-between">
              <span>Thailand guesses within 100km:</span>
              <span className="text-primary">
                {guesses?.hundredKm?.length ?? 0}
              </span>
            </li>
          </ul>
        </div>
      }
    />
  );
};

export const TimedOutCard = () => {
  const playerId = usePlayerId()!;
  const { selectedMonth } = useMonth();
  const { data: guesses } = api.guesses.timedOutGuesses.useQuery({
    playerId,
    selectedMonth,
  });
  const { data: totalRoundCount } = api.rounds.totalRoundCount.useQuery({
    playerId,
    selectedMonth,
  });
  return (
    <StatCard
      icon={"😂🫵"}
      iconColor="text-green-500"
      title={`Timed Out Guesses 💀`}
      value={guesses?.[0]?.count ?? 0}
      detailedContent={
        <div className="flex flex-col gap-2">
          <p>
            Out of
            {totalRoundCount} rounds, you timed out{" "}
            <span className="text-primary">{guesses?.[0]?.count} </span>
            times.
          </p>
          <p>
            Thats{" "}
            {(
              ((guesses?.[0]?.count ?? 0) / (totalRoundCount ?? 0)) *
              100
            ).toFixed(2)}
            % of your rounds 💀
          </p>
        </div>
      }
    />
  );
};

export const MooDengCard = () => {
  const playerId = usePlayerId()!;
  const { selectedMonth } = useMonth();
  const { data: guesses } = api.guesses.guessesNearMoodeng.useQuery({
    playerId,
    selectedMonth,
  });
  return (
    <StatCard
      icon={getCountryFlagEmoji("TH")}
      title={"Moo Deng Guesses"}
      value={guesses?.mooDengGuesses ?? 0}
      detailedContent={
        <MooDengDetail
          guesses={guesses?.mooDengGuesses ?? 0}
          tenKm={guesses?.mooDeng10kmGuesses ?? 0}
          fiftyKm={guesses?.mooDeng50kmGuesses ?? 0}
        />
      }
    />
  );
};

const MooDengDetail = ({
  guesses,
  tenKm,
  fiftyKm,
}: {
  guesses: number;
  tenKm: number;
  fiftyKm: number;
}) => {
  return (
    <div>
      <h3 className="mb-2 text-lg font-semibold">MooDeng Breakdown</h3>
      <ul className="flex flex-col gap-2">
        <li className="flex w-full items-center justify-between">
          <span>Guesses on Moo Deng:</span>
          <span className="text-primary">{guesses}</span>
        </li>
        <li className="flex w-full items-center justify-between">
          <span>Guesses within 10km of Moo Deng:</span>
          <span className="text-primary">{tenKm}</span>
        </li>
        <li className="flex w-full items-center justify-between">
          <span>Guesses within 50km of Moo Deng:</span>
          <span className="text-primary">{fiftyKm}</span>
        </li>
      </ul>
    </div>
  );
};

export const GuessesInObamaCard = () => {
  const playerId = usePlayerId()!;
  const { selectedMonth } = useMonth();
  const { data: guesses } = api.guesses.guessesInObama.useQuery({
    playerId,
    selectedMonth,
  });
  return (
    <StatCard
      icon={getCountryFlagEmoji("JP")}
      iconColor="text-green-500"
      title={`Guesses in Obama`}
      value={guesses?.[0]?.count ?? 0}
      detailedContent={
        <ObamaDetail guessesInObama={guesses?.[0]?.count ?? 0} />
      }
    />
  );
};

export const SkeletonCell = ({ className }: { className: string }) => {
  return (
    <div
      className={cn(
        "h-6 w-full animate-pulse rounded-md bg-muted-foreground",
        className,
      )}
    />
  );
};

export const ObamaDetail = ({ guessesInObama }: { guessesInObama: number }) => {
  const playerId = usePlayerId()!;
  const { selectedMonth } = useMonth();
  const { data: roundsInObama, isLoading } = api.rounds.roundsInObama.useQuery({
    playerId,
    selectedMonth,
  });

  if (isLoading)
    return (
      <div>
        <h3 className="mb-2 text-lg font-semibold">Game Breakdown</h3>
        <ul className="space-y-1">
          <li>
            Rounds in obama: <SkeletonCell className="w-24" />
          </li>
          <li>
            Guesses in Obama: <SkeletonCell className="w-24" />
          </li>
          <li>
            Obama round to guess ratio: <SkeletonCell className="w-24" />
          </li>
        </ul>
      </div>
    );

  return (
    <div>
      <h3 className="mb-2 text-lg font-semibold">Obama Breakdown</h3>
      <ul className="flex flex-col gap-2">
        <li className="flex w-full items-center justify-between">
          <span>Rounds in obama:</span>
          <span className="text-primary">{roundsInObama}</span>
        </li>
        <li className="flex w-full items-center justify-between">
          <span>Guesses in Obama:</span>
          <span className="text-primary">{guessesInObama}</span>
        </li>
        <li className="rounded-md bg-primary p-2 text-center">
          {guessesInObama > (roundsInObama ?? 0)
            ? "You made more Obama guesses than rounds in Obama. Good job"
            : guessesInObama === 0
              ? "No guesses in Obama, really? Believe in something"
              : "You made less Obama guesses than rounds in Obama. Time to retire"}
        </li>
      </ul>
    </div>
  );
};

export const TotalGamesCard = () => {
  const id = usePlayerId()!;
  const { selectedMonth } = useMonth();
  const { data: gamesTypes } = api.games.gameTypes.useQuery({
    id,
    selectedMonth,
  });
  const { data: gamesModes } = api.games.gameModes.useQuery({
    id,
    selectedMonth,
  });
  const { data: count } = api.games.getTotalGamesCount.useQuery({
    id,
    selectedMonth,
  });
  return (
    <StatCard
      icon={TrophyIcon}
      iconColor="text-yellow-500"
      title="Total Games"
      value={count ?? 0}
      detailedContent={
        <div>
          <h3 className="mb-2 text-lg font-semibold">Game Breakdown</h3>
          <ul className="flex flex-col gap-2">
            <li className="flex w-full items-center justify-between">
              <span>Standard:</span>
              <span className="text-primary">{gamesTypes?.standard}</span>
            </li>
            <li className="flex w-full items-center justify-between">
              <span>Duels:</span>
              <span className="text-primary">{gamesTypes?.duel}</span>
            </li>
            <li className="flex w-full items-center justify-between">
              <span>Moving</span>
              <span className="text-primary">{gamesModes?.standard}</span>
            </li>
            <li className="flex w-full items-center justify-between">
              <span>No Move</span>
              <span className="text-primary">{gamesModes?.noMove}</span>
            </li>
            <li className="flex w-full items-center justify-between">
              <span>NPMZ</span>
              <span className="text-primary">{gamesModes?.nmpz}</span>
            </li>
          </ul>
        </div>
      }
    />
  );
};

export const AverageScoreCard = () => {
  const playerId = usePlayerId()!;
  const { selectedMonth } = useMonth();
  const { data: avgScore } = api.guesses.getAverageScore.useQuery({
    playerId,
    selectedMonth,
  });

  const { data: fiveKGuesses } = api.guesses.fiveKGuesses.useQuery({
    playerId,
    selectedMonth,
  });

  const { data: zeroScoreGuesses } = api.guesses.zeroScoreGuesses.useQuery({
    playerId,
    selectedMonth,
  });

  const { data: correctCountryGuesses } =
    api.guesses.correctCountryGuesses.useQuery({
      playerId,
      selectedMonth,
    });

  const { data: totalRoundCount } = api.rounds.totalRoundCount.useQuery({
    playerId,
    selectedMonth,
  });

  return (
    <StatCard
      icon={TargetIcon}
      iconColor="text-green-500"
      title="Avg. Score"
      value={avgScore ?? 0}
      detailedContent={
        <div>
          <h3 className="mb-2 text-lg font-semibold">Score Breakdown</h3>
          <ul className="flex w-full flex-col gap-2">
            <li className="flex w-full items-center justify-between">
              <span>Total rounds:</span>
              <span className="text-primary">{totalRoundCount}</span>
            </li>
            <li className="flex w-full items-center justify-between">
              <span>{"5k's"}:</span>
              <span className="text-primary">
                {fiveKGuesses?.[0]?.count ?? 0}
              </span>
            </li>
            <li className="flex w-full items-center justify-between">
              <span>0 score guesses:</span>
              <span className="text-primary">
                {zeroScoreGuesses?.[0]?.count ?? 0}
              </span>
            </li>
            <li className="flex w-full items-center justify-between">
              <span>Correct country guesses:</span>
              <span className="text-primary">
                {correctCountryGuesses?.[0]?.count ?? 0} / {totalRoundCount}
              </span>
            </li>
          </ul>
        </div>
      }
    />
  );
};

export const FavouriteMapCard = () => {
  const id = usePlayerId()!;
  const { selectedMonth } = useMonth();

  const { data: maps } = api.games.getFavouriteMaps.useQuery({
    id,
    selectedMonth,
  });

  return (
    <StatCard
      icon={MapIcon}
      iconColor="text-purple-500"
      title="Favorite Map"
      value={maps?.[0]?.mapName ?? ""}
      detailedContent={
        <div>
          <h3 className="mb-2 text-lg font-semibold">Top maps</h3>
          <ul className="flex flex-col gap-2">
            {maps?.map((map) => (
              <li
                key={map.mapName}
                className="flex w-full items-center justify-between"
              >
                <span>{map.mapName}:</span>
                <span className="text-primary">{map.count}</span>
              </li>
            ))}
          </ul>
        </div>
      }
    />
  );
};

export const TopCountryCard = () => {
  const playerId = usePlayerId()!;
  const { selectedMonth } = useMonth();
  const { data: topCountries } = api.asnwers.getTopCountries.useQuery({
    playerId,
    selectedMonth,
  });
  return (
    <StatCard
      icon={Globe2Icon}
      iconColor="text-blue-500"
      title="Top country"
      value={getCountryFlagEmoji(topCountries?.[0]?.country)}
      detailedContent={
        <div>
          <h3 className="mb-2 text-lg font-semibold">Top countries</h3>
          <ul className="flex flex-col gap-2">
            {topCountries?.map((country) => (
              <li
                key={country.country}
                className="flex w-full items-center justify-between"
              >
                <span>{getCountryFlagEmoji(country.country)}:</span>
                <span className="text-primary">{country.count}</span>
              </li>
            ))}
          </ul>
        </div>
      }
    />
  );
};
