"use client";
import { Globe2Icon, MapIcon, TargetIcon, TrophyIcon } from "lucide-react";
import { usePathname } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { usePlayerId } from "./_hooks/usePlayerId";
import { api } from "~/trpc/react";
import { StatCard } from "./StatCard";
import { getFlagEmoji } from "~/utils";
import { useRainboltMode } from "./_hooks/useRainboltMode";
import { cn } from "~/lib/utils";

export const SummaryCards = () => {
  const { isRainboltMode } = useRainboltMode();
  if (isRainboltMode) {
    return (
      <>
        <TotalGamesCard />
        <AverageScoreCard />
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

export const MooDengCard = () => {
  const playerId = usePlayerId()!;
  const { data: guesses } = api.guesses.guessesNearMoodeng.useQuery({
    playerId,
  });
  return (
    <StatCard
      icon={TargetIcon}
      iconColor="text-green-500"
      title={`Moo Deng Guesses ${getFlagEmoji("TH")}`}
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
        <li>Guesses on Moo Deng: {guesses}</li>
        <li>Guesses within 10km of Moo Deng: {tenKm}</li>
        <li>Guesses within 50km of Moo Deng: {fiftyKm}</li>
      </ul>
    </div>
  );
};

export const GuessesInObamaCard = () => {
  const playerId = usePlayerId()!;
  const { data: guesses } = api.guesses.guessesInObama.useQuery({
    playerId,
  });
  return (
    <StatCard
      icon={TargetIcon}
      iconColor="text-green-500"
      title={`Guesses in Obama ${getFlagEmoji("JP")}`}
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
  const { data: roundsInObama, isLoading } = api.rounds.roundsInObama.useQuery({
    playerId,
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
      <ul className="space-y-1">
        <li>Rounds in obama: {roundsInObama}</li>
        <li>Guesses in Obama: {guessesInObama}</li>
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

  const { data: count } = api.games.getTotalGamesCount.useQuery({ id });
  return (
    <StatCard
      icon={TrophyIcon}
      iconColor="text-yellow-500"
      title="Total Games"
      value={count ?? 0}
      detailedContent={
        <div>
          <h3 className="mb-2 text-lg font-semibold">Game Breakdown</h3>
          <ul className="space-y-1">
            <li>Single Player: 100</li>
            <li>Multiplayer: 40</li>
            <li>Challenges: 10</li>
          </ul>
        </div>
      }
    />
  );
};

export const AverageScoreCard = () => {
  const playerId = usePlayerId()!;
  const { data: avgScore } = api.guesses.getAverageScore.useQuery({
    playerId,
  });
  return (
    <StatCard
      icon={TargetIcon}
      iconColor="text-green-500"
      title="Avg. Score"
      value={avgScore ?? 0}
      detailedContent={
        <div>
          <h3 className="mb-2 text-lg font-semibold">Game Breakdown</h3>
          <ul className="space-y-1">
            <li>Single Player: 100</li>
            <li>Multiplayer: 40</li>
            <li>Challenges: 10</li>
          </ul>
        </div>
      }
    />
  );
};

export const FavouriteMapCard = () => {
  const id = usePlayerId()!;

  const { data: maps } = api.games.getFavouriteMaps.useQuery({ id });

  return (
    <StatCard
      icon={MapIcon}
      iconColor="text-purple-500"
      title="Favorite Map"
      value={maps?.[0]?.mapName ?? ""}
      detailedContent={
        <div>
          <h3 className="mb-2 text-lg font-semibold">Top maps</h3>
          <ul className="space-y-1">
            {maps?.map((map) => (
              <li key={map.mapName}>
                {map.mapName}: {map.count}
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
  const { data: topCountries } = api.asnwers.getTopCountries.useQuery({
    playerId,
  });
  return (
    <StatCard
      icon={Globe2Icon}
      iconColor="text-blue-500"
      title="Top country"
      value={getFlagEmoji(topCountries?.[0]?.country)}
      detailedContent={
        <div>
          <h3 className="mb-2 text-lg font-semibold">Top countries</h3>
          <ul className="space-y-1">
            {topCountries?.map((country) => (
              <li key={country.country}>
                {getFlagEmoji(country.country)}: {country.count}
              </li>
            ))}
          </ul>
        </div>
      }
    />
  );
};
