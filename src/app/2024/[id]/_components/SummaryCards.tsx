"use client";
import { Globe2Icon, MapIcon, TargetIcon, TrophyIcon } from "lucide-react";
import { usePathname } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { usePlayerId } from "./usePlayerId";
import { api } from "~/trpc/react";

export const TotalGamesCard = () => {
  const id = usePlayerId()!;

  const { data: count } = api.games.getTotalGamesCount.useQuery({ id });
  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex items-center space-x-2">
          <TrophyIcon className="h-4 w-4 text-yellow-500" />
          <div className="space-y-1">
            <p className="text-sm text-gray-500">Total Games</p>
            <p className="text-2xl font-bold">{count ?? 0}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export const AverageScoreCard = ({ geoGuessrId }: { geoGuessrId: string }) => {
  const { data: avgScore } = api.guesses.getAverageScore.useQuery({
    geoGuessrId,
  });
  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex items-center space-x-2">
          <TargetIcon className="h-4 w-4 text-green-500" />
          <div className="space-y-1">
            <p className="text-sm text-gray-500">Avg. Score</p>
            <p className="text-2xl font-bold">{avgScore ?? 0}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export const FavouriteMapCard = () => {
  const id = usePlayerId()!;

  const { data: mapName } = api.games.getFavouriteMap.useQuery({ id });

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex items-center space-x-2">
          <MapIcon className="h-4 w-4 text-purple-500" />
          <div className="space-y-1">
            <p className="text-sm text-gray-500">Favorite Map</p>
            <p className="text-2xl font-bold">{mapName ?? "World"}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
