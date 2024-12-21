"use client";
import React from "react";
import { APIProvider, Map as GoogleMap } from "@vis.gl/react-google-maps";
import { env } from "~/env";
import { api } from "~/trpc/react";
import { ClusteredMarkers } from "./ClusteredMarkers";
import { usePlayerId } from "../dashboard/_hooks/usePlayerId";

console.log(env.NEXT_PUBLIC_GOOGLE_API_KEY);

const Map = () => {
  const playerId = usePlayerId()!;
  const { data: rounds } = api.games.getAllWithResults.useQuery(
    { playerId: playerId },
    { enabled: !!playerId },
  );

  return (
    <APIProvider apiKey={env.NEXT_PUBLIC_GOOGLE_API_KEY}>
      <GoogleMap
        mapId={env.NEXT_PUBLIC_GOOGLE_MAP_ID}
        style={{ width: "100%", height: "100vh" }}
        defaultCenter={{ lat: 22.54992, lng: 0 }}
        defaultZoom={3}
        gestureHandling={"greedy"}
        disableDefaultUI={true}
      >
        {rounds && <ClusteredMarkers rounds={rounds} />}
      </GoogleMap>
    </APIProvider>
  );
};

export default Map;
