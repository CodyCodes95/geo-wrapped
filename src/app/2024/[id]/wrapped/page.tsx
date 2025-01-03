import { api } from "~/trpc/server";
import Wrapped from "./components/Wrapped";
import { notFound } from "next/navigation";
import { ProcessingSlide } from "./components/Slides";

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
  competitiveStats: {
    gamesPlayed: number;
    avgScore: number;
    flawlessVictories: number;
    averageGuessTime: number;
    averageDistance: number;
    timesYouWereMultiMerchented: number;
    timesYouWereTheMultiMerchent: number;
    totalDuels: number;
    totalDuelsWon: number;
    winPercentage: number;
    toughestWonDuels: {
      mapName: string;
      roundCount: number;
      totalPoints: number;
      gameUrl: string;
    }[];
  };
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
    percentage: number;
  }[];
  weakestCountries: {
    country: string;
    correctGuesses: number;
    totalGuesses: number;
    percentage: number;
  }[];
  topSong: {
    name: string;
    artist: string;
    playCount: number;
    minutes: number;
    imageUrl: string;
  };
  scoreStats: {
    perfectScores: number;
    zeroScores: number;
    avgScore: number;
    avgTime: number;
    avgDistance: number;
    timedOutGuesses: number;
    topGuesses: {
      points: number;
      distanceInMeters: number;
      mapName: string;
      gameUrl: string;
      gameMode: string;
      gameType: string;
      timeInSeconds: number;
    }[];
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

  if (!player.processed) {
    return <ProcessingSlide playerId={id} />;
  }

  const strongestCountriesQuery = api.wrapped.strongestCountries({
    playerId: id,
  });
  const weakestCountriesQuery = api.wrapped.weakestCountries({
    playerId: id,
  });
  const totalStatsQuery = api.wrapped.totalGamesSummary({ playerId: id });
  const topMapuery = api.wrapped.topMap({ playerId: id });
  const bestGamesQuery = api.wrapped.bestGames({ playerId: id });
  const scoreStatsQuery = api.wrapped.scoreStats({ playerId: id });
  const competitiveStatsQuery = api.wrapped.competitiveStats({
    playerId: id,
  });

  const [
    totalStats,
    bestGames,
    topMap,
    strongestCountries,
    weakestCountries,
    scoreStats,
    competitiveStats,
  ] = await Promise.all([
    totalStatsQuery,
    bestGamesQuery,
    topMapuery,
    strongestCountriesQuery,
    weakestCountriesQuery,
    scoreStatsQuery,
    competitiveStatsQuery,
  ]);

  const stats = {
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
    scoreStats,
    competitiveStats,
  } as unknown as WrappedStats;
  return <Wrapped stats={stats} />;
}
