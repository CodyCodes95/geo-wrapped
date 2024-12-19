import type { Marker as MarkerType } from "@googlemaps/markerclusterer";
import React, { useCallback } from "react";
import { AdvancedMarker, Marker } from "@vis.gl/react-google-maps";
import { type Location } from "./Map";

export type TreeMarkerProps = {
  location: Location;
  onClick: (tree: Location) => void;
  setMarkerRef: (marker: MarkerType | null, key: string) => void;
};

/**
 * Wrapper Component for an AdvancedMarker for a single tree.
 */
export const LocationMarker = (props: TreeMarkerProps) => {
  const { location, onClick, setMarkerRef } = props;

  const handleClick = useCallback(() => onClick(location), [onClick, location]);
  const ref = useCallback(
    (marker: MarkerType | null) => setMarkerRef(marker, location.key),
    [setMarkerRef, location.key],
  );

  return (
    <Marker
      position={location.location}
      ref={ref}
      onClick={() => {
        handleClick();
        // window.location.href = `http://maps.google.com/maps?q=&layer=c&cbll=${location.location.lat},${location.location.lng}`;
      }}
    />
    // <AdvancedMarker
    //   position={location.location}
    //   ref={ref}
    //   onClick={handleClick}
    // >
    //   <span className="marker-clustering-tree">🌳</span>
    // </AdvancedMarker>
  );
};
