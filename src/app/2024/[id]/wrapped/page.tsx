import { api } from "~/trpc/server";
import Wrapped from "./components/Wrapped";

export type WrappedStats = {
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
    };
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
  const strongestCountries = await api.guesses.strongestCountries({
    playerId: id,
  });
  const weakestCountries = await api.guesses.weakestCountries({ playerId: id });
  const stats: WrappedStats = {
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
