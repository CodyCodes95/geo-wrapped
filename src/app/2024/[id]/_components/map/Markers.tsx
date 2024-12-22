"use client";
import React from "react";
import { api } from "~/trpc/react";
import { usePlayerId } from "../dashboard/_hooks/usePlayerId";
import { useMonth } from "../_layout/MonthSelector";
import { AdvancedMarker } from "@vis.gl/react-google-maps";

const Markers = () => {
  const playerId = usePlayerId()!;
  const { selectedMonth } = useMonth();
  const { data: player } = api.players.getPlayer.useQuery({ id: playerId });
  const { data: rounds } = api.games.getAllWithResults.useQuery(
    { playerId: playerId, selectedMonth },
    { enabled: !!playerId },
  );
  return (
    <>
      {rounds?.map((round) => (
        <AdvancedMarker
          key={round.roundId}
          position={{
            lat: round.guess.lat,
            lng: round.guess.lng,
          }}
        >
          <img
            className="h-7 w-7 rounded-full border-2 border-white"
            src={`https://www.geoguessr.com/images/resize:auto:96:96/gravity:ce/plain/${player?.avatarUrl}`}
          />
        </AdvancedMarker>
      ))}
    </>
  );
};

export default Markers;
