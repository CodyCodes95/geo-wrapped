import React, { Suspense } from "react";
import { api } from "~/trpc/server";
import { notFound } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import { Globe2, Map, Target, Trophy, Clock } from "lucide-react";
import {
  AverageScoreCard,
  FavouriteMapCard,
  TotalGamesCard,
} from "./_components/SummaryCards";

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
  return (
    <div className="container mx-auto space-y-6 p-6">
      {/* Profile Header */}
      <div className="flex items-center space-x-6 rounded-lg bg-white p-6 shadow-sm">
        <Avatar className="h-24 w-24">
          <AvatarImage src={player.avatarUrl} alt={player.nick} />
          <AvatarFallback>{player.nick}</AvatarFallback>
        </Avatar>
        <div>
          <h1 className="text-3xl font-bold">{player.nick}</h1>
          <p className="text-gray-600">{player.countryCode}</p>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
        <TotalGamesCard />
        <AverageScoreCard geoGuessrId={player.geoguessrId} />
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2">
              <Globe2 className="h-4 w-4 text-blue-500" />
              <div className="space-y-1">
                <p className="text-sm text-gray-500">Countries Visited</p>
                <p className="text-2xl font-bold">42</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <FavouriteMapCard />
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
              <CardTitle>Performance Overview</CardTitle>
            </CardHeader>
            <CardContent>
              {/* Add charts/stats here */}
              <div className="flex h-[200px] items-center justify-center rounded border">
                Performance Chart Placeholder
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Add other tab contents */}
      </Tabs>
    </div>
  );
}
