"use client";
import React from "react";
import { APIProvider, Map as GoogleMap } from "@vis.gl/react-google-maps";
import { env } from "~/env";
import Markers from "./Markers";

const Map = () => {
  return (
    <APIProvider apiKey={env.NEXT_PUBLIC_GOOGLE_API_KEY}>
      <GoogleMap
        mapId={env.NEXT_PUBLIC_GOOGLE_MAP_ID}
        style={{ width: "100%", height: "60vh" }}
        defaultCenter={{ lat: 22.54992, lng: 0 }}
        defaultZoom={2}
        gestureHandling={"greedy"}
        // disableDefaultUI={true}
      >
        <Markers />
      </GoogleMap>
    </APIProvider>
  );
};

export default Map;
