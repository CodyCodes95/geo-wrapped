"use client";
import React from "react";
import { api } from "~/trpc/react";
import {
  AverageScoreCard,
  FavouriteMapCard,
  TopCountryCard,
  TotalGamesCard,
} from "./SummaryCards";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Globe2Icon } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import Map from "../map/Map";
import { usePlayerId } from "./_hooks/usePlayerId";
import { useRainboltMode } from "./_hooks/useRainboltMode";

const Dashboard = () => {
  const playerId = usePlayerId()!;
  const { data: games } = api.games.getAll.useQuery(
    { playerId },
    { enabled: !!playerId },
  );
  const { RainboltMode } = useRainboltMode();
  return (
    <>
      {/* Stats Overview */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
        <TotalGamesCard />
        <AverageScoreCard />
        <TopCountryCard />
        <div className="relative">
          <FavouriteMapCard />
          <RainboltMode />
        </div>
      </div>

      {/* Detailed Stats Tabs */}
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="maps">Maps</TabsTrigger>
          <TabsTrigger value="achievements">Achievements</TabsTrigger>
          <TabsTrigger value="history">History</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Your guesses</CardTitle>
            </CardHeader>
            <CardContent>
              <Map />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </>
  );
};

export default Dashboard;
