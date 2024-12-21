import type { Marker as MarkerType } from "@googlemaps/markerclusterer";
import React, { useCallback } from "react";
import { AdvancedMarker, Marker } from "@vis.gl/react-google-maps";
import { type Round } from "./ClusteredMarkers";

export type LocationMarkerProps = {
  location: Round;
  onClick: (round: Round) => void;
  setMarkerRef: (marker: MarkerType | null, key: string) => void;
  avatarUrl: string;
};

export const LocationMarker = (props: LocationMarkerProps) => {
  const { location, onClick, setMarkerRef, avatarUrl } = props;

  const handleClick = useCallback(() => onClick(location), [onClick, location]);
  const ref = useCallback(
    (marker: MarkerType | null) => setMarkerRef(marker, location.roundId),
    [setMarkerRef, location.roundId],
  );

  return (
    <AdvancedMarker
      position={{
        lat: location.guess.lat,
        lng: location.guess.lng,
      }}
      ref={ref}
      onClick={() => {
        handleClick();
        // window.location.href = `http://maps.google.com/maps?q=&layer=c&cbll=${location.location.lat},${location.location.lng}`;
      }}
    >
      <img
        className="h-7 w-7 rounded-full border-2 border-white"
        src={`https://www.geoguessr.com/images/resize:auto:96:96/gravity:ce/plain/${avatarUrl}`}
      />
    </AdvancedMarker>
  );
};
