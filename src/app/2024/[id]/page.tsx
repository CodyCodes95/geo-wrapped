import React, { Suspense } from "react";
import { api } from "~/trpc/server";
import { notFound } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import { Globe2 } from "lucide-react";
import {
  AverageScoreCard,
  FavouriteMapCard,
  TotalGamesCard,
} from "./_components/dashboard/SummaryCards";
import Map from "./_components/map/Map";
import Dashboard from "./_components/dashboard/Dashboard";
import { getFlagEmoji } from "~/utils";

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
    <p>Processing</p>;
  }

  return (
    <div className="container mx-auto space-y-6 p-6">
      {/* Profile Header */}
      <div className="flex items-center space-x-6 rounded-lg p-6 shadow-sm">
        <Avatar className="h-24 w-24">
          <AvatarImage
            src={`https://www.geoguessr.com/images/resize:auto:96:96/gravity:ce/plain/${player.avatarUrl}`}
            alt={player.nick!}
          />
          <AvatarFallback>{player.nick}</AvatarFallback>
        </Avatar>
        <div>
          <h1 className="text-3xl font-bold">{player.nick}</h1>
          <p className="text-gray-600">
            {getFlagEmoji(player?.countryCode ?? "")}
          </p>
        </div>
      </div>

      <Dashboard />
    </div>
  );
}
