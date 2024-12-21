import { api } from "~/trpc/server";
import Wrapped from "./components/Wrapped";
import { notFound } from "next/navigation";

export type WrappedStats = {
  totalStats: {
    totalGamesPlayed: number;
    totalMinutesPlayed: number;
    favouriteMap: string;
    favouriteMode: string;
    favouriteMapGamesPlayed: number;
  };
  bestGames: {
    gameMode: string;
    points: number | null;
    mapName: string;
    summaryId: string;
  }[];
  topGenre: {
    name: string;
    hours: number;
    topArtists: string[];
  };
  topMap: {
    name: string;
    gamesPlayed: number;
    minutesPlayed: number;
    averageScore: number;
    bestGames: {
      gameMode: string;
      points: number;
      summaryUrl: string;
    }[];
  };
  listeningClock: {
    peakHour: string;
    timeRange: string;
    type: string;
  };
  strongestCountries: {
    country: string;
    correctGuesses: number;
    totalGuesses: number;
  }[];
  weakestCountries: {
    country: string;
    correctGuesses: number;
    totalGuesses: number;
  }[];
  topSong: {
    name: string;
    artist: string;
    playCount: number;
    minutes: number;
    imageUrl: string;
  };
};

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const id = (await params).id;
  const player = await api.players.getPlayer({ id });

  if (!player) {
    notFound();
  }

  const strongestCountries = await api.wrapped.strongestCountries({
    playerId: id,
  });
  const weakestCountries = await api.wrapped.weakestCountries({ playerId: id });
  const totalStats = await api.wrapped.totalGamesSummary({ playerId: id });
  const topMap = await api.wrapped.topMap({ playerId: id });
  const bestGames = await api.wrapped.bestGames({ playerId: id });
  const stats: WrappedStats = {
    totalStats,
    bestGames,
    topMap,
    strongestCountries,
    weakestCountries,
    topGenre: {
      name: "Electronic",
      hours: 1284,
      topArtists: ["Daft Punk", "Deadmau5", "The Chemical Brothers"],
    },
    listeningClock: {
      peakHour: "11 PM",
      timeRange: "11 PM - 2 AM",
      type: "Night Owl 🦉",
    },
    topSong: {
      name: "Around the World",
      artist: "Daft Punk",
      playCount: 247,
      minutes: 823,
      imageUrl: "https://source.unsplash.com/featured/400x400?album",
    },
  };
  return <Wrapped stats={stats} />;
}
