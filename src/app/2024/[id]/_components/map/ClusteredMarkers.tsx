"use client";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  InfoWindow,
  Marker,
  useMap,
} from "@vis.gl/react-google-maps";
import { type Marker as MarkerType, MarkerClusterer } from "@googlemaps/markerclusterer";

type Location = { lng: number; lat: number; id: string };

type MapProps = {
  locations: Location[];
};

const ClusteredMarkers = ({ locations }: MapProps) => {
  const [markers, setMarkers] = useState<Record<string, MarkerType>>({});
  const [selectedLocationId, setSelectedLocationId] = useState<string | null>(
    null,
  );

  const selectedLocation = useMemo(
    () =>
      locations && selectedLocationId
        ? locations.find((l) => l.id === selectedLocationId)!
        : null,
    [locations, selectedLocationId],
  );

  const map = useMap();
  const clusterer = useMemo(() => {
    if (!map) return null;

    return new MarkerClusterer({ map });
  }, [map]);

  useEffect(() => {
    if (!clusterer) return;

    clusterer.clearMarkers();
    clusterer.addMarkers(Object.values(markers));
  }, [clusterer, markers]);

  // this callback will effectively get passsed as ref to the markers to keep
  // tracks of markers currently on the map
  const setMarkerRef = useCallback((marker: MarkerType | null, key: string) => {
    setMarkers((markers) => {
      if ((marker && markers[key]) || (!marker && !markers[key]))
        return markers;

      if (marker) {
        return { ...markers, [key]: marker };
      } else {
        const { [key]: _, ...newMarkers } = markers;

        return newMarkers;
      }
    });
  }, []);

  const handleInfoWindowClose = useCallback(() => {
    setSelectedLocationId(null);
  }, []);

  const handleMarkerClick = useCallback((loc: Location) => {
    setSelectedLocationId(loc.id);
  }, []);

  return (
    <>
      {locations.map((location) => (
        <Marker
          key={location.id}
          position={{ lat: location.lat, lng: location.lng }}
          onClick={() => handleMarkerClick(location)}
        />
      ))}

      {selectedLocationId && (
        <InfoWindow
          anchor={markers[selectedLocationId]}
          onCloseClick={handleInfoWindowClose}
        >
          Selected!
        </InfoWindow>
      )}
    </>
  );
};

export default ClusteredMarkers;
