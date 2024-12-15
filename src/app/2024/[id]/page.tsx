import React, { Suspense } from "react";
import { api } from "~/trpc/server";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import { notFound } from "next/navigation";

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
    <Suspense fallback={<span>Loading...</span>}>
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
      </div>
    </Suspense>
  );
}
