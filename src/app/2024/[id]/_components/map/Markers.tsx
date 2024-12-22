"use client";
import React, { useEffect } from "react";
import { api } from "~/trpc/react";
import { usePlayerId } from "../dashboard/_hooks/usePlayerId";
import { useMonth } from "../_layout/MonthSelector";
import {
  AdvancedMarker,
  useMap,
  useMapsLibrary,
} from "@vis.gl/react-google-maps";
import { Button } from "~/components/ui/button";
import { type RoundAnswer, useMapStore } from "~/store/mapStore";
import { useMapStateStore } from "~/store/clusterStore";
import { ClusterMarker } from "./ClusterMarker";
import { buildStreetViewUrl } from "~/utils/googleMaps";
import { keepPreviousData } from "@tanstack/react-query";

const Markers = () => {
  const playerId = usePlayerId()!;
  const { selectedMonth } = useMonth();
  const map = useMap();
  const mapsLib = useMapsLibrary("maps");
  const { selectedRounds, clearSelectedRounds, setSelectedRounds } =
    useMapStore();
  const { bounds, zoom } = useMapStateStore();
  const { data: player } = api.players.getPlayer.useQuery({ id: playerId });

  // Get clustered markers from server
  const { data: clusters } = api.games.getClusteredMarkers.useQuery(
    {
      playerId,
      selectedMonth,
      bounds: bounds!,
      zoom,
    },
    {
      enabled: !!bounds && !!playerId,
      placeholderData: keepPreviousData,
    },
  );

  const polyLines = React.useMemo(() => {
    if (!mapsLib) return [];
    return selectedRounds.map(
      () =>
        new mapsLib.Polyline({
          strokeColor: "black",
          strokeOpacity: 1.0,
          strokeWeight: 2,
        }),
    );
  }, [mapsLib, selectedRounds.length]);

  useEffect(() => {
    if (!map || !polyLines.length) return;

    polyLines.forEach((line, i) => {
      const round = selectedRounds[i]!;
      line.setPath([
        { lat: round.guess.lat, lng: round.guess.lng },
        { lat: round.answer.lat, lng: round.answer.lng },
      ]);
      line.setMap(map);
    });

    return () => {
      polyLines.forEach((line) => line.setMap(null));
    };
  }, [map, polyLines, selectedRounds]);

  const openGooglePano = (answer: RoundAnswer) => {
    window.open(
      buildStreetViewUrl({
        latitude: answer.lat,
        longitude: answer.lng,
        heading: answer.heading,
        pitch: answer.pitch,
        zoom: answer.zoom,
        panoramaId: answer.googlePanoId,
      }),
      "_blank",
    );
  };

  if (selectedRounds.length) {
    return (
      <>
        <Button
          onClick={clearSelectedRounds}
          className="absolute bottom-0 right-0"
        >
          Clear selected rounds
        </Button>
        {selectedRounds.map((round) => (
          <React.Fragment key={round.id}>
            <AdvancedMarker position={round.guess} anchorPoint={["50%", "50%"]}>
              <img
                className="h-8 w-8 rounded-full border-2 border-white"
                src={`https://www.geoguessr.com/images/resize:auto:96:96/gravity:ce/plain/${player?.avatarUrl}`}
              />
            </AdvancedMarker>
            <AdvancedMarker
              onClick={() => openGooglePano(round.answer)}
              position={round.answer}
              anchorPoint={["50%", "50%"]}
            >
              <img
                className="h-8 w-8 rounded-full border-2 border-white"
                src={"/flag.webp"}
              />
            </AdvancedMarker>
          </React.Fragment>
        ))}
      </>
    );
  }

  return (
    <>
      {clusters?.map((cluster) => {
        const [lng, lat] = cluster.geometry.coordinates;
        const { cluster: isCluster, point_count: pointCount } =
          cluster.properties;

        if (isCluster) {
          return (
            <ClusterMarker
              key={`cluster-${cluster.id}`}
              position={{ lat: lat!, lng: lng! }}
              count={pointCount}
              avatarUrl={player?.avatarUrl ?? ""}
            />
          );
        }

        const { roundId, guess, answer } = cluster.properties;
        return (
          <AdvancedMarker
            key={roundId}
            position={{ lat: lat!, lng: lng! }}
            anchorPoint={["50%", "50%"]}
            onClick={() => {
              setSelectedRounds([
                {
                  id: roundId,
                  guess,
                  answer,
                },
              ]);
            }}
          >
            <img
              className="h-8 w-8 rounded-full border-2 border-white"
              src={`https://www.geoguessr.com/images/resize:auto:96:96/gravity:ce/plain/${player?.avatarUrl}`}
            />
          </AdvancedMarker>
        );
      })}
    </>
  );
};

export default Markers;
