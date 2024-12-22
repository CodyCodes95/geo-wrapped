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
// import { format } from "date-fns";

export const GameTable = () => {
  const playerId = usePlayerId()!;
  const { selectedMonth } = useMonth();
  const { setSelectedRounds } = useMapStore();
  const { data: games } = api.games.getAllWithResults.useQuery(
    { playerId, selectedMonth },
    { enabled: !!playerId },
  );

  if (!games?.length) {
    return <div>No games found</div>;
  }

  const groupedGames = games.reduce((acc, round) => {
    const game = acc.get(round.gameId) ?? [];
    game.push(round);
    acc.set(round.gameId, game);
    return acc;
  }, new Map<string, typeof games>());

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Map</TableHead>
          <TableHead>Type</TableHead>
          <TableHead>Mode</TableHead>
          <TableHead>Score</TableHead>
          <TableHead>Played</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {Array.from(groupedGames.entries()).map(([gameId, rounds]) => {
          const game = rounds[0];
          return (
            <TableRow
              key={gameId}
              className="cursor-pointer hover:bg-muted"
              onClick={() => {
                const selectedRounds: SelectedRound[] = rounds.map((r) => ({
                  id: r.roundId,
                  guess: {
                    lat: r.guess.lat,
                    lng: r.guess.lng,
                  },
                  answer: {
                    lat: r.answer.lat,
                    lng: r.answer.lng,
                  },
                }));
                setSelectedRounds(selectedRounds);
              }}
            >
              <TableCell>{game?.mapName}</TableCell>
              <TableCell>{game?.type}</TableCell>
              <TableCell>{game?.mode}</TableCell>
              <TableCell>
                {rounds.reduce((sum, r) => sum + r.guess.points, 0)}
              </TableCell>
              <TableCell>
                {/* {format(new Date(game.gameTimeStarted), "PPpp")} */}
              </TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
};
