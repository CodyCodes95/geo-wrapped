import React from "react";
import { api } from "~/trpc/server";
import { notFound } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import Dashboard from "./_components/dashboard/Dashboard";
import { getCountryFlagEmoji } from "~/utils";

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
    <p>Processing. Please come back later</p>;
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
          <p className="text-2xl">
            {getCountryFlagEmoji(player?.countryCode ?? "")}
          </p>
        </div>
      </div>

      <Dashboard />
    </div>
  );
}
