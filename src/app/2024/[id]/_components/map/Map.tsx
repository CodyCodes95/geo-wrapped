"use client";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  APIProvider,
  Map as GoogleMap,
  useMap,
} from "@vis.gl/react-google-maps";
import { env } from "~/env";
import { type Marker, MarkerClusterer } from "@googlemaps/markerclusterer";
import ClusteredMarkers from "./ClusteredMarkers";

type Location = { lng: number; lat: number; id: string };

type MapProps = {
  locations: Location[];
};

const Map = ({ locations }: MapProps) => {
  return (
    <APIProvider apiKey={env.NEXT_PUBLIC_GOOGLE_API_KEY}>
      <GoogleMap
        mapId={env.NEXT_PUBLIC_GOOGLE_MAP_ID}
        style={{ width: "100vw", height: "100vh" }}
        defaultCenter={{ lat: 22.54992, lng: 0 }}
        defaultZoom={3}
        gestureHandling={"greedy"}
        disableDefaultUI={true}
      >
        <ClusteredMarkers locations={locations} />
      </GoogleMap>
    </APIProvider>
  );
};

export default Map;
