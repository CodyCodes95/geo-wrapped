import { InfoWindow, useMap } from "@vis.gl/react-google-maps";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { type Marker, MarkerClusterer } from "@googlemaps/markerclusterer";
import { type Location } from "./Map";
import { LocationMarker } from "./Marker";

export type ClusteredMarkersProps = {
  locations: Location[];
};

/**
 * The ClusteredMarkers component is responsible for integrating the
 * markers with the markerclusterer.
 */
export const ClusteredMarkers = ({ locations }: ClusteredMarkersProps) => {
  const [markers, setMarkers] = useState<Record<string, Marker>>({});
  const [selectedTreeKey, setSelectedTreeKey] = useState<string | null>(null);

  const selectedTree = useMemo(
    () =>
      locations && selectedTreeKey
        ? locations.find((t) => t.key === selectedTreeKey)!
        : null,
    [locations, selectedTreeKey],
  );

  // create the markerClusterer once the map is available and update it when
  // the markers are changed
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
  const setMarkerRef = useCallback((marker: Marker | null, key: string) => {
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
    setSelectedTreeKey(null);
  }, []);

  const handleMarkerClick = useCallback((location: Location) => {
    setSelectedTreeKey(location.key);
  }, []);

  return (
    <>
      {locations.map((location) => (
        <LocationMarker
          key={location.key}
          location={location}
          onClick={handleMarkerClick}
          setMarkerRef={setMarkerRef}
        />
      ))}

      {selectedTreeKey && (
        <InfoWindow
          anchor={markers[selectedTreeKey]}
          onCloseClick={handleInfoWindowClose}
        >
          {selectedTree?.key}
        </InfoWindow>
      )}
    </>
  );
};
