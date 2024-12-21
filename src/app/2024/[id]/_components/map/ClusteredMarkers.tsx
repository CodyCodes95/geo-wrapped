import { InfoWindow, useMap } from "@vis.gl/react-google-maps";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { type Marker, MarkerClusterer } from "@googlemaps/markerclusterer";
import { LocationMarker } from "./Marker";
import { api, type GetAllGamesOutput } from "~/trpc/react";
import { rounds } from "~/server/db/schema";
import { usePlayerId } from "../dashboard/_hooks/usePlayerId";

export type ClusteredMarkersProps = {
  rounds: GetAllGamesOutput;
};

export type Round = NonNullable<GetAllGamesOutput[number]>;

/**
 * The ClusteredMarkers component is responsible for integrating the
 * markers with the markerclusterer.
 */
export const ClusteredMarkers = ({ rounds }: ClusteredMarkersProps) => {
  const [markers, setMarkers] = useState<Record<string, Marker>>({});
  const [selectedRoundId, setSelectedRoundId] = useState<string | null>(null);
  const playerId = usePlayerId()!;
  const { data: player } = api.players.getPlayer.useQuery({ id: playerId });

  const selectedRound = useMemo(
    () =>
      rounds && selectedRoundId
        ? rounds.find((t) => t.roundId === selectedRoundId)!
        : null,
    [rounds, selectedRoundId],
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
    setSelectedRoundId(null);
  }, []);

  const handleMarkerClick = useCallback((round: Round) => {
    setSelectedRoundId(round.roundId);
  }, []);

  return (
    <>
      {rounds.map((round) => (
        <LocationMarker
          key={round.roundId}
          location={round}
          onClick={handleMarkerClick}
          setMarkerRef={setMarkerRef}
          avatarUrl={player?.avatarUrl ?? ""}
        />
      ))}

      {selectedRoundId && (
        <InfoWindow
          anchor={markers[selectedRoundId]}
          onCloseClick={handleInfoWindowClose}
        >
          {selectedRound?.roundId}
        </InfoWindow>
      )}
    </>
  );
};
