"use client";
import { Globe2Icon, MapIcon, TargetIcon, TrophyIcon } from "lucide-react";
import { usePathname } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { usePlayerId } from "./_hooks/usePlayerId";
import { api } from "~/trpc/react";
import { StatCard } from "./StatCard";
import { getFlagEmoji } from "~/utils";

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
