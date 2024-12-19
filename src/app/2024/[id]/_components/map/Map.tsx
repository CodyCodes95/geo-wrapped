"use client";
import React from "react";
import { APIProvider, Map as GoogleMap } from "@vis.gl/react-google-maps";
import { env } from "~/env";
import { type players } from "~/server/db/schema";
import { api } from "~/trpc/react";
import { ClusteredMarkers } from "./ClusteredMarkers";

export type Location = {
  location: {
    lng: number;
    lat: number;
  };
  key: string;
};

type MapProps = {
  player: typeof players.$inferInsert;
};

console.log(env.NEXT_PUBLIC_GOOGLE_API_KEY);

const Map = ({ player }: MapProps) => {
  const { data: guesses } = api.guesses.getAll.useQuery(
    { geoGuessrId: player.geoguessrId! },
    { enabled: !!player?.geoguessrId },
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
        {guesses && <ClusteredMarkers locations={guesses} />}
      </GoogleMap>
    </APIProvider>
  );
};

export default Map;
