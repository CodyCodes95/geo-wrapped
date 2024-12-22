"use client";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";
import { api } from "~/trpc/react";
import { usePlayerId } from "../dashboard/_hooks/usePlayerId";
import { useMonth } from "../_layout/MonthSelector";
import { useMapStore, type SelectedRound } from "~/store/mapStore";

const getDistanceInKm = (
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number,
) => {
  const R = 6371; // Radius of the earth in km
  const dLat = deg2rad(lat2 - lat1);
  const dLon = deg2rad(lng2 - lng1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(lat1)) *
      Math.cos(deg2rad(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c);
};

const deg2rad = (deg: number) => {
  return deg * (Math.PI / 180);
};

export const RoundTable = () => {
  const playerId = usePlayerId()!;
  const { selectedMonth } = useMonth();
  const { setSelectedRounds } = useMapStore();
  const { data: rounds } = api.games.getAllWithResults.useQuery(
    { playerId, selectedMonth },
    { enabled: !!playerId },
  );

  if (!rounds?.length) {
    return <div>No rounds found</div>;
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Map</TableHead>
          <TableHead>Mode</TableHead>
          <TableHead>Type</TableHead>
          <TableHead>Points</TableHead>
          <TableHead>Guessed</TableHead>
          <TableHead>Actual</TableHead>
          <TableHead>Distance (km)</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {rounds.map((round) => (
          <TableRow
            key={round.roundId}
            className="cursor-pointer hover:bg-muted"
            onClick={() => {
              const selectedRound: SelectedRound = {
                id: round.roundId,
                guess: {
                  lat: round.guess.lat,
                  lng: round.guess.lng,
                },
                answer: {
                  lat: round.answer.lat,
                  lng: round.answer.lng,
                },
              };
              setSelectedRounds([selectedRound]);
            }}
          >
            <TableCell>{round.mapName}</TableCell>
            <TableCell>{round.mode}</TableCell>
            <TableCell>{round.type}</TableCell>
            <TableCell>{round.guess.points}</TableCell>
            <TableCell>{round.guess.countryCode?.toUpperCase()}</TableCell>
            <TableCell>{round.answer.countryCode.toUpperCase()}</TableCell>
            <TableCell>
              {getDistanceInKm(
                round.guess.lat,
                round.guess.lng,
                round.answer.lat,
                round.answer.lng,
              )}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};
