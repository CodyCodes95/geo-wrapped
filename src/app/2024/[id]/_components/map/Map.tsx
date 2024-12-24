"use client";
import React from "react";
import { APIProvider, Map as GoogleMap } from "@vis.gl/react-google-maps";
import { env } from "~/env";
import Markers from "./Markers";
import { useMapStateStore } from "~/store/mapStateStore";

const Map = () => {
  const updateBoundsAndZoom = (map: google.maps.Map) => {
    const bounds = map.getBounds();
    const zoom = map.getZoom();
    if (bounds && zoom) {
      useMapStateStore.setState({
        bounds: {
          ne: {
            lat: bounds.getNorthEast().lat(),
            lng: bounds.getNorthEast().lng(),
          },
          sw: {
            lat: bounds.getSouthWest().lat(),
            lng: bounds.getSouthWest().lng(),
          },
        },
        zoom,
      });
    }
  };

  return (
    <APIProvider apiKey={env.NEXT_PUBLIC_GOOGLE_API_KEY}>
      <GoogleMap
        clickableIcons={false}
        mapId={env.NEXT_PUBLIC_GOOGLE_MAP_ID}
        style={{ width: "100%", height: "60vh" }}
        defaultCenter={{ lat: 22.54992, lng: 0 }}
        defaultZoom={3}
        minZoom={2}
        gestureHandling={"greedy"}
        disableDefaultUI={true}
        onDragend={(e) => updateBoundsAndZoom(e.map)}
        onZoomChanged={(e) => updateBoundsAndZoom(e.map)}
      >
        <Markers />
      </GoogleMap>
    </APIProvider>
  );
};

export default Map;
