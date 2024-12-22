"use client";
import React, { useEffect, useState } from "react";
import { api } from "~/trpc/react";
import { usePlayerId } from "../dashboard/_hooks/usePlayerId";
import { useMonth } from "../_layout/MonthSelector";
import {
  AdvancedMarker,
  useMap,
  useMapsLibrary,
} from "@vis.gl/react-google-maps";

type SelectedRound = {
  id: string;
  guess: {
    lat: number;
    lng: number;
  };
  answer: {
    lat: number;
    lng: number;
    streetViewUrl: string;
  };
};

const Markers = () => {
  const playerId = usePlayerId()!;
  const { selectedMonth } = useMonth();
  const map = useMap();
  const mapsLib = useMapsLibrary("maps");
  const [selectedRound, setSelectedRound] = useState<SelectedRound | null>(
    null,
  );
  const { data: player } = api.players.getPlayer.useQuery({ id: playerId });
  const { data: rounds } = api.games.getAllWithResults.useQuery(
    { playerId: playerId, selectedMonth },
    { enabled: !!playerId },
  );

  useEffect(() => {
    if (!mapsLib) return;
    if (!selectedRound) {
      // remove the polyline
      return;
    }

    const polyline = new mapsLib.Polyline({
      path: [
        { lat: selectedRound.guess.lat, lng: selectedRound.guess.lng },
        { lat: selectedRound.answer.lat, lng: selectedRound.answer.lng },
      ],
      strokeColor: "black",
      strokeOpacity: 1.0,
      strokeWeight: 1.5,
    });

    polyline.setMap(map);
  }, [selectedRound, mapsLib]);

  if (selectedRound) {
    return (
      <>
        <AdvancedMarker
          anchorPoint={["50%", "50%"]}
          position={selectedRound.guess}
        >
          <img
            className="h-8 w-8 rounded-full border-2 border-white"
            src={`https://www.geoguessr.com/images/resize:auto:96:96/gravity:ce/plain/${player?.avatarUrl}`}
          />
        </AdvancedMarker>
        <AdvancedMarker
          anchorPoint={["50%", "50%"]}
          position={selectedRound.answer}
        >
          <img
            className="h-8 w-8 rounded-full border-2 border-white"
            src={"/flag.webp"}
          />
        </AdvancedMarker>
      </>
    );
  }

  return (
    <>
      {rounds?.map((round) => (
        <AdvancedMarker
          anchorPoint={["50%", "50%"]}
          onClick={() => {
            setSelectedRound({
              id: round.roundId,
              guess: {
                lat: round.guess.lat,
                lng: round.guess.lng,
              },
              answer: {
                lat: round.answer.lat,
                lng: round.answer.lng,
                streetViewUrl: round.answer.googlePanoId,
              },
            });
          }}
          key={round.roundId}
          position={{
            lat: round.guess.lat,
            lng: round.guess.lng,
          }}
        >
          <img
            className="h-8 w-8 rounded-full border-2 border-white"
            src={`https://www.geoguessr.com/images/resize:auto:96:96/gravity:ce/plain/${player?.avatarUrl}`}
          />
        </AdvancedMarker>
      ))}
    </>
  );
};

export default Markers;
